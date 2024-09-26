"use server";

import { FeatureCollection } from "geojson";
import { omit } from "lodash";
import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import { collections, dbConnect } from "@/server/mongodb";

import { ZoneModel } from "./models/zoneModel";
import { actionClient } from "./safeAction";

export type Zone = Omit<ZoneModel, "userId" | "features"> & {
  id: string;
  features: FeatureCollection;
};

export const myZones = actionClient.action(async () => {
  await dbConnect();

  const user = await auth();
  if (!user?.user) {
    throw new Error("You must be logged in to fetch your zones");
  }

  const zones = await collections
    .zones!.find({ userId: new ObjectId(user.user!.id!) })
    .toArray();

  const result: Zone[] = zones.map((zone) => ({
    ...omit(zone, ["_id", "userId"]),
    id: zone._id.toString(),
    features: zone.features as FeatureCollection,
  }));

  return result;
});
