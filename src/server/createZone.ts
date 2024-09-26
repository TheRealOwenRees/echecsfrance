"use server";

import { ObjectId } from "mongodb";

import { auth } from "@/auth";
import { zoneSchema } from "@/schemas";
import { collections, dbConnect } from "@/server/mongodb";
import { errorLog } from "@/utils/logger";

import { ZoneModel } from "./models/zoneModel";
import { actionClient } from "./safeAction";

export const createZone = actionClient
  .schema(zoneSchema)
  .action(async (input) => {
    try {
      await dbConnect();

      const user = await auth();
      if (!user?.user) {
        throw new Error("You must be logged in to create a zone");
      }

      const zoneData: ZoneModel = {
        ...input.parsedInput,
        userId: new ObjectId(user.user!.id!),
      };

      const result = await collections.zones!.insertOne(zoneData);

      if (!result.acknowledged) {
        throw new Error("ERR_ZONE_INSERT_FAILED");
      }

      return true;
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
