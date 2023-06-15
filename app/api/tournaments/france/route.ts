import clientPromise from "@/lib/mongodb";
import { dateOrderingFrance } from "@/utils/dbDateOrdering";

/**
 * Tournament data API endpoint
 * @route /api/tournaments/france
 * @internal
 */
// TODO add headers to response content-type application/json
export const revalidate = 3600; // revalidate cache every 6 hours
async function GET() {
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");

    const data = await dateOrderingFrance(db);

    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500, headers });
  }
}
