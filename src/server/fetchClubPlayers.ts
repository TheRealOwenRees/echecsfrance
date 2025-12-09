"use server";

import { z } from "zod";

import { fetchClubPlayersSchema } from "@/schemas";
import { errorLog } from "@/utils/logger";

import { actionClient } from "./safeAction";

const resultsSchema = z.array(
  z.object({
    nrFFE: z.string(),
    name: z.string(),
    elo: z.string(),
    elo_rapid: z.string(),
    elo_blitz: z.string(),
    category: z.string(),
    club: z.string(),
  }),
);

const outputSchema = z.array(
  z.object({
    nrFFE: z.string(),
    name: z.string(),
    elo: z.string(),
    elo_rapid: z.string(),
    elo_blitz: z.string(),
    category: z.string(),
    club: z.string(),
  }),
);

export type ClubPlayerResultsData = z.infer<typeof outputSchema>;

const reportFetchError = async (url: string, error: any) => {
  await fetch(process.env.DISCORD_WEBHOOK_ERROR_LOGS_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          title: "Error Fetching Club Player Details",
          fields: [
            { name: "url", value: url },
            {
              name: "error.message",
              value: "message" in error ? error.message : "",
            },
            { name: "error", value: JSON.stringify(error, null, 2) },
          ],
        },
      ],
    }),
  });
};

export const fetchClubPlayers = actionClient
  .schema(fetchClubPlayersSchema)
  .action(async (input) => {
    const { clubId } = input.parsedInput;

    try {
      const headers = new Headers();
      const apiKey = process.env.RESULTS_API_KEY;

      if (apiKey) {
        headers.append("api-key", apiKey);
      }

      const rawResults = await fetch(
        `https://api.echecsfrance.com/api/v1/club_player_details/${clubId}`,
        {
          headers: headers,
        },
      );

      if (rawResults.status !== 200) {
        throw new Error("ERR_CLUB_NOT_FOUND");
      }

      const results = await rawResults.json();

      const parsedResults = resultsSchema.parse(results);

      return outputSchema.parse(parsedResults);
    } catch (error: any) {
      if (
        !("message" in error) ||
        error.message !== "ERR_TOURNAMENT_NOT_FOUND"
      ) {
        // reportFetchError(id, error);
        errorLog(JSON.stringify(error, null, 2));
      }

      throw error;
    }
  });
