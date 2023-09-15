import { fetchTournamentResultsSchema } from "@/schemas";
import { errorLog } from "@/utils/logger";

import { publicProcedure } from "../trpc";

export const fetchTournamentResults = publicProcedure
  .input(fetchTournamentResultsSchema)
  .mutation(async ({ input }) => {
    try {
      console.log(input.url);

      // Fetch the tournament results using Python

      return true;
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
