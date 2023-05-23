import clientPromise from "@/lib/mongodb";

/**
 * Tournament data API endpoint
 * @route /api/tournaments
 * @internal
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");

    /**
     * Converts date from string into a date to allow ordering
     */
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
