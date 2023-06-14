import clientPromise from "@/lib/mongodb";
import { cache } from "react";
import { dateOrderingFrance } from "@/utils/dbDateOrdering";

/**
 * Tournament data API endpoint
 * @route /api/tournaments/france
 * @internal
 */
export const revalidate = 86400;
export const GET = cache(async function () {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");

    const data = await dateOrderingFrance(db);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
});
