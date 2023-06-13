import clientPromise from "@/lib/mongodb";
import { dateOrderingFrance } from "@/utils/dbDateOrdering";

/**
 * Tournament data API endpoint
 * @route /api/tournaments/france
 * @internal
 */
// TODO cache this result for 24 hours - using cache()
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");

    const data = await dateOrderingFrance(db);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
