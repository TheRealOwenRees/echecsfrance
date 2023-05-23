import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // TODO delete req / res ?
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");
    // const data = await db.collection("tournaments").find({}).toArray();
    // converts date from string into a date and then orders by date
    const data = await db
      .collection("tournaments")
      .aggregate([
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

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
