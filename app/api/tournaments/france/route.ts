import clientPromise from "@/lib/mongodb";

// TODO collate only the country of France - redundant for now but will be needed when new countries are added
// probably do this by passing the country name as parameter
/**
 * Tournament data API endpoint
 * @route /api/tournaments/france
 * @internal
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");

    /**
     * Converts date from string into a date to allow ordering
     */
    // TODO add into a middleware?
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
