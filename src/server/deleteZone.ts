"use server";

import { ObjectId } from "mongodb";
import { z } from "zod";

import { auth } from "@/auth";
import { collections, dbConnect } from "@/server/mongodb";
import { errorLog } from "@/utils/logger";

import { action } from "./safeAction";

const deleteZoneSchema = z.object({
  id: z.string(),
});

export const deleteZone = action(deleteZoneSchema, async ({ id }) => {
  try {
    await dbConnect();

    const user = await auth();
    if (!user?.user) {
      throw new Error("You must be logged in to create a zone");
    }

    const result = await collections.zones!.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.user!.id!),
    });

    if (!result || result.deletedCount !== 1) {
      throw new Error("ERR_ZONE_DELETE_FAILED");
    }

    return true;
  } catch (error) {
    errorLog(error);
    throw error;
  }
});
