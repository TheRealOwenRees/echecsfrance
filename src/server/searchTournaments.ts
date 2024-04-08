"use server";

import { endOfDay } from "date-fns";
import { z } from "zod";

import clientPromise from "@/lib/mongodb";
import { TournamentData } from "@/types";
import { TimeControl, Tournament, tcMap } from "@/types";
import { ExtractSafeActionResult } from "@/types";
import { errorLog } from "@/utils/logger";
import { removeDiacritics } from "@/utils/string";

import { action } from "./safeAction";

const inputSchema = z.object({
  searchValue: z.string(),
  limit: z.number().optional(),
});

export type SearchedTournament = Pick<
  Tournament,
  | "id"
  | "ffeId"
  | "date"
  | "department"
  | "status"
  | "timeControl"
  | "tournament"
  | "town"
  | "url"
>;

export const searchTournaments = action(inputSchema, async (input) => {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");

    const searchTerms = input.searchValue
      .split(" ")
      .map((s) => removeDiacritics(s.trim()))
      .filter((s) => s !== "")
      .map((s) => ({ tournament_index: { $regex: s, $options: "i" } }));

    const data = await db
      .collection("tournaments")
      .aggregate<TournamentData>([
        {
          $addFields: {
            dateParts: {
              $dateFromString: {
                dateString: "$start_date",
                format: "%d/%m/%Y",
              },
            },
          },
        },
        {
          $match: {
            $and: [
              { federation: { $eq: "FFE" } },
              { dateParts: { $lte: endOfDay(new Date()) } },
              ...searchTerms,
            ],
          },
        },
        {
          $sort: {
            dateParts: -1,
          },
        },
        { $limit: input.limit ?? 20 },
        {
          $unset: "dateParts",
        },
      ])
      .toArray();

    return data.map<SearchedTournament>((t) => {
      const timeControl = tcMap[t.time_control] ?? TimeControl.Other;

      return {
        id: t._id.toString(),
        ffeId: t.tournament_id,
        tournament: t.tournament,
        town: t.town,
        department: t.department,
        date: t.start_date,
        url: t.url,
        timeControl,
        status: t.status,
      };
    });
  } catch (error) {
    errorLog(JSON.stringify(error, null, 2));
    throw error;
  }
});
