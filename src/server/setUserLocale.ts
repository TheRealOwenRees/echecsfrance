"use server";

import { ObjectId } from "mongodb";
import { z } from "zod";

import { auth } from "@/auth";
import { collections, dbConnect } from "@/server/mongodb";
import { errorLog } from "@/utils/logger";

import { actionClient } from "./safeAction";

export const setUserLocale = actionClient
  .schema(z.string())
  .action(async (input) => {
    try {
      await dbConnect();

      const user = await auth();
      if (!user?.user) {
        throw new Error("You must be logged update your locale");
      }

      await collections.users!.findOneAndUpdate(
        { _id: new ObjectId(user.user.id) },
        { $set: { locale: input.parsedInput } },
      );

      return true;
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
