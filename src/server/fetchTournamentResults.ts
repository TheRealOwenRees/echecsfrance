"use server";

import { z } from "zod";

import { fetchTournamentResultsSchema } from "@/schemas";
import { errorLog } from "@/utils/logger";

import { actionClient } from "./safeAction";

const dbSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    elo: z.string(),
    results: z.array(
      z.object({
        colour: z.enum(["B", "N", ""]),
        result: z.string(),
        opponent_name: z.string().nullable(),
        opponent_elo: z.string().nullable(),
      }),
    ),
  }),
);

const outputSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    elo: z.number(),
    estimated: z.boolean(),
    national: z.boolean(),
    results: z.array(
      z.object({
        colour: z.enum(["white", "black", ""]),
        result: z.number().nullable(),
        lostByForfeit: z.boolean(),
        wonByForfeit: z.boolean(),
        opponent: z.string().nullable(),
        elo: z.number().nullable(),
        estimated: z.boolean(),
        national: z.boolean(),
      }),
    ),
  }),
);

export type TournamentResultsData = z.infer<typeof outputSchema>;

const getEloDetails = (elo: string | null) => {
  if (elo === null || elo === "") {
    return { elo: 0, estimated: false, national: false };
  }
  return {
    elo: parseInt(elo),
    estimated: elo.endsWith("E"),
    national: elo.endsWith("N"),
  };
};

const getResultDetails = (
  results: z.infer<typeof dbSchema>[number]["results"][number],
) => {
  if (results.opponent_name === null) {
    return { result: 0, lostByForfeit: true, wonByForfeit: false };
  }

  if (results.result === "<") {
    return { result: 0, lostByForfeit: true, wonByForfeit: false };
  }

  if (results.result === ">") {
    return { result: 1, lostByForfeit: false, wonByForfeit: true };
  }

  return {
    result: parseFloat(results.result),
    lostByForfeit: false,
    wonByForfeit: false,
  };
};

const reportFetchError = async (url: string, error: any) => {
  if (typeof process.env.DISCORD_WEBHOOK_ERROR_LOGS_URL === "string") {
    await fetch(process.env.DISCORD_WEBHOOK_ERROR_LOGS_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "Error Fetching Tournament Results",
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
  }
};

export const fetchTournamentResults = actionClient
  .schema(fetchTournamentResultsSchema)
  .action(async (input) => {
    const { id } = input.parsedInput;
    try {
      const headers = new Headers();
      const apiKey = process.env.RESULTS_API_KEY;

      if (apiKey) {
        headers.append("api-key", apiKey);
      }

      const rawResults = await fetch(
        `${process.env.RESULTS_SCRAPER_URL}${id}`,
        {
          headers: headers,
        },
      );

      if (rawResults.status >= 500) {
        throw new Error("ERR_TOURNAMENT_RESULTS_NOT_AVAILABLE");
      }

      const results = await rawResults.json();

      if ("detail" in results && results.detail === "Not found") {
        throw new Error("ERR_TOURNAMENT_NOT_FOUND");
      }

      const parsedResults = dbSchema.parse(results);

      return outputSchema.parse(
        parsedResults.map<z.infer<typeof outputSchema>[number]>((player) => ({
          id: player.id,
          name: player.name,
          ...getEloDetails(player.elo),
          results: player.results.map((result) => ({
            colour:
              result.colour === "B"
                ? "white"
                : result.colour === "N"
                  ? "black"
                  : "",
            opponent: result.opponent_name,
            ...getResultDetails(result),
            ...getEloDetails(result.opponent_elo),
          })),
        })),
      );
    } catch (error) {
      reportFetchError(id, error);
      errorLog(JSON.stringify(error, null, 2));
      throw error;
    }
  });
