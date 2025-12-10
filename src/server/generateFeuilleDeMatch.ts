"use server";

import { matchSchema } from "@/schemas";
import { actionClient } from "@/server/safeAction";

export const generateFeuilleDeMatch = actionClient
  .schema(matchSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log("generateFeuilleDeMatch", parsedInput);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
