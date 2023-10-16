import { differenceInDays, isSameDay, parse } from "date-fns";
import { groupBy } from "lodash";

import clientPromise from "@/lib/mongodb";
import { TournamentData } from "@/types";
import { TimeControl, Tournament } from "@/types";
import { errorLog } from "@/utils/logger";

import TournamentsDisplay from "./TournamentsDisplay";

export const revalidate = 3600; // Revalidate cache every 6 hours

const tcMap: Record<TournamentData["time_control"], TimeControl> = {
  "Cadence Lente": TimeControl.Classic,
  Rapide: TimeControl.Rapid,
  Blitz: TimeControl.Blitz,
};

const getTournaments = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");
    const data = await db
      .collection("tournaments")
      .aggregate<TournamentData>([
        {
          $addFields: {
            dateParts: {
              $dateFromString: {
                dateString: "$date",
                format: "%d/%m/%Y",
              },
            },
          },
        },
        {
          $match: {
            status: { $ne: "completed" }
          },
        },
        {
          $sort: {
            dateParts: 1,
          },
        },
        {
          $unset: "dateParts",
        },
      ])
      .toArray();

    // Group the tournaments by their location
    const groupedByLocation = groupBy(
      data,
      (t) => `${t.coordinates[0]}_${t.coordinates[1]}`,
    );

    // For each location, create an array of arrays of contiguous dates for this location
    const dateRangesByLocation: Record<string, Date[][]> = {};
    for (const location in groupedByLocation) {
      const tournaments = groupedByLocation[location];

      // Note that this works since the tournaments are sorted by date
      const dateRanges = tournaments.reduce<Date[][]>(
        (acc, tournament) => {
          const group = acc[acc.length - 1];
          const date = parse(tournament.date, "dd/MM/yyyy", new Date());
          const diff = differenceInDays(date, group[group.length - 1] ?? date);
          if (diff > 1) {
            acc.push([date]);
          } else if (group.length === 0 || diff === 1) {
            group.push(date);
          }
          return acc;
        },
        [[]],
      );

      dateRangesByLocation[location] = dateRanges;
    }

    return data.map<Tournament>((t) => {
      const location = `${t.coordinates[0]}_${t.coordinates[1]}`;
      const date = parse(t.date, "dd/MM/yyyy", new Date());
      const dateRanges = dateRangesByLocation[location];
      const rangeIndex = dateRanges.findIndex((ranges) =>
        ranges.some((d) => isSameDay(d, date)),
      );

      // We place each tournament into a group based on location and date and time control, so that
      // we can display a single map marker.
      const timeControl = tcMap[t.time_control] ?? TimeControl.Other;
      const groupId = `${location}_${rangeIndex}_${timeControl}`;

      return {
        id: t._id.toString(),
        groupId,
        tournament: t.tournament,
        town: t.town,
        department: t.department,
        date: t.date,
        url: t.url,
        timeControl,
        latLng: { lat: t.coordinates[0], lng: t.coordinates[1] },
        norm: t.norm_tournament,
        pending: t.pending,
        status: t.status,
      };
    });
  } catch (error) {
    errorLog(error);
    throw new Error("Error fetching tournament data");
  }
};

export default async function Tournaments() {
  const tournaments = await getTournaments();
  return <TournamentsDisplay tournaments={tournaments} />;
}
