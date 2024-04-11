"use server";

import { omit } from "lodash";
import { ObjectId } from "mongodb";
import { z } from "zod";

import { auth } from "@/auth";
import { collections, dbConnect } from "@/server/mongodb";

import { action } from "./safeAction";

export const myZones = action(z.void(), async () => {
  await dbConnect();

  const user = await auth();
  if (!user?.user) {
    throw new Error("You must be logged in to fetch your zones");
  }

  const zones = await collections
    .zones!.find({ userId: new ObjectId(user.user!.id!) })
    .toArray();

  return zones.map((zone) => ({
    ...omit(zone, ["_id"]),
    id: zone._id.toString(),
    userId: zone.userId.toString(),
  }));
});
