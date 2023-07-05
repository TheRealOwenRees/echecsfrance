import clientPromise from "@/lib/mongodb";

import { errorLog } from "@/utils/logger";
import { Tournament, TimeControl } from "@/types";

import TournamentsDisplay from "./TournamentsDisplay";
import { ObjectId } from "mongodb";

export const revalidate = 3600; // Revalidate cache every 6 hours

export interface TournamentData {
  _id: ObjectId;
  town: string;
  department: string;
  tournament: string;
  url: string;
  time_control: "Cadence Lente" | "Rapide" | "Blitz" | "1h KO";
  date: string;
  coordinates: [number, number];
}

const tcMap: Record<TournamentData["time_control"], TimeControl> = {
  "Cadence Lente": TimeControl.Classic,
  Rapide: TimeControl.Rapid,
  Blitz: TimeControl.Blitz,
  "1h KO": TimeControl.KO,
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
          $sort: {
            dateParts: 1,
          },
        },
        {
          $unset: "dateParts",
        },
      ])
      .toArray();

    return data.map<Tournament>((t) => ({
      ...t,
      _id: t._id.toString(),
      timeControl: tcMap[t.time_control],
      latLng: { lat: t.coordinates[0], lng: t.coordinates[1] },
    }));
  } catch (error) {
    errorLog(error);
    throw new Error("Error fetching tournament data");
  }
};

export default async function Tournaments() {
  const tournaments = await getTournaments();

  return <TournamentsDisplay tournaments={tournaments} />;
}
