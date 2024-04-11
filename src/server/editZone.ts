"use server";

import { omit } from "lodash";
import { ObjectId } from "mongodb";
import { z } from "zod";

import { auth } from "@/auth";
import { zoneSchema } from "@/schemas";
import { collections, dbConnect } from "@/server/mongodb";
import { errorLog } from "@/utils/logger";

import { ZoneModel } from "./models/zoneModel";
import { action } from "./safeAction";

const editZoneSchema = z.object({
  id: z.string(),
  zone: zoneSchema,
});

export const editZone = action(editZoneSchema, async ({ id, zone }) => {
  try {
    await dbConnect();

    const user = await auth();
    if (!user?.user) {
      throw new Error("You must be logged in to create a zone");
    }

    const zoneData: ZoneModel = {
      ...zone,
      userId: new ObjectId(user.user!.id!),
    };

    const result = await collections.zones!.findOneAndUpdate(
      { _id: new ObjectId(id), userId: new ObjectId(user.user!.id!) },
      { $set: { _id: new ObjectId(id), ...zoneData } },
    );

    if (!result) {
      throw new Error("ERR_ZONE_UPDATE_FAILED");
    }

    return {
      ...omit(result, ["_id"]),
      id: result._id.toString(),
      userId: result.userId.toString(),
    };
  } catch (error) {
    errorLog(error);
    throw error;
  }
});
