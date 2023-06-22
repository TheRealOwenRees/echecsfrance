import clientPromise from "@/lib/mongodb";
import { dateOrderingFrance } from "@/utils/dbDateOrdering";

/**
 * Tournament data API endpoint
 * @route /api/v1/tournaments/france
 * @public
 */
export const revalidate = 3600; // revalidate cache every 6 hours
export async function GET() {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");
    const results = await dateOrderingFrance(db);
    const data = results.map(({ _id, ...rest }) => ({
      id: _id,
      ...rest,
    }));

    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500, headers });
  }
}
