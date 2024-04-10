import {
  differenceInDays,
  formatISO,
  isSameDay,
  parse,
  setDefaultOptions,
} from "date-fns";
import { fr } from "date-fns/locale";
import { groupBy } from "lodash";
import { unstable_cache } from "next/cache";

import { tournamentModelSchema } from "@/server/models/tournamentModel";
import { collections, dbConnect } from "@/server/mongodb";
import { TimeControl, Tournament, tcMap } from "@/types";
import { errorLog } from "@/utils/logger";

import TournamentsDisplay from "./TournamentsDisplay";

setDefaultOptions({ locale: fr });

const getTournaments = async () => {
  try {
    await dbConnect();

    const data = await collections
      .tournaments!.aggregate([
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
            status: { $ne: "completed" },
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

    const bad = data.filter((t) => {
      const result = tournamentModelSchema.safeParse(t);
      if (result.success === false) {
        console.log(JSON.stringify(result, null, 2));
        console.log(JSON.stringify(t, null, 2));

        if (typeof process.env.DISCORD_WEBHOOK_ERROR_LOGS_URL === "string") {
          fetch(process.env.DISCORD_WEBHOOK_ERROR_LOGS_URL as string, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              embeds: [
                {
                  title: "Error parsing tournaments",
                  fields: [
                    {
                      name: "parseError",
                      value: JSON.stringify(result, null, 2),
                    },
                    { name: "tournament", value: JSON.stringify(t, null, 2) },
                  ],
                },
              ],
            }),
          });
        }
      }

      return result.success === false;
    });

    const badIds = bad.map((t) => t._id.toString());
    const goodData = data.filter((t) => !badIds.includes(t._id.toString()));

    // Group the tournaments by their location
    const groupedByLocation = groupBy(
      goodData,
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

    return goodData.map<Tournament>((t) => {
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
        ffeId: t.tournament_id,
        groupId,
        tournament: t.tournament,
        town: t.town,
        department: t.department,
        date: t.date,
        url: t.url,
        timeControl,
        latLng: { lat: t.coordinates[0], lng: t.coordinates[1] },
        norm: t.norm_tournament ?? false,
        pending: t.pending ?? false,
        status: t.status,
      };
    });
  } catch (error) {
    errorLog(error);
    throw new Error("Error fetching tournament data");
  }
};

export default async function Tournaments() {
  const tournaments = await unstable_cache(
    async () => {
      const data = await getTournaments();
      return data;
    },
    ["tournaments"],
    {
      revalidate: 60 * 60 * 6,
    },
  )();

  return <TournamentsDisplay tournaments={tournaments} />;
}
