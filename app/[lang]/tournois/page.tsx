import clientPromise from "@/lib/mongodb";

import { errorLog } from "@/utils/logger";
import { Tournament } from "@/types";

import TournamentsDisplay from "./TournamentsDisplay";

export const revalidate = 3600; // Revalidate cache every 6 hours

const getTournaments = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");
    const data = await db
      .collection("tournaments")
      .aggregate<Tournament>([
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

    // We map the ObjectId to a string so that it can be serialized and sent to a client component
    return data.map((t) => ({
      ...t,
      _id: t._id.toString(),
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
