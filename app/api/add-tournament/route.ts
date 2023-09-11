import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import { errorLog } from "@/utils/logger";

export async function POST(req: Request) {
  const {
    address,
    town,
    department,
    tournament,
    url,
    time_control,
    norm_tournament,
    date,
    coordinates,
    country,
  } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB").collection("tournaments");

    const tournamentData = {
      address,
      town,
      department,
      tournament,
      url,
      time_control,
      norm_tournament,
      date,
      coordinates,
      country,
      entry_method: "manual",
      pending: true,
    };

    const result = await db.insertOne(tournamentData);

    if (result.insertedId) {
      return new NextResponse(
        JSON.stringify({ success: "Tournament added to DB as pending" }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    errorLog(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to insert tournament data" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
