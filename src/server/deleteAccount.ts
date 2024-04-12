"use server";

import { ObjectId } from "mongodb";
import { z } from "zod";

import { adapter, auth } from "@/auth";
import { collections, dbConnect } from "@/server/mongodb";
import { errorLog } from "@/utils/logger";

import { action } from "./safeAction";

export const deleteAccount = action(z.void(), async () => {
  try {
    await dbConnect();

    const user = await auth();
    if (!user?.user) {
      throw new Error("You must be logged in to delete your account");
    }

    await collections.zones!.deleteMany({
      userId: new ObjectId(user.user!.id!),
    });

    await adapter.deleteUser!(user.user!.id!);

    return true;
  } catch (error) {
    errorLog(error);
    throw error;
  }
});
