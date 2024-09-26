"use server";

import { endOfDay } from "date-fns";
import { z } from "zod";

import { collections, dbConnect } from "@/server/mongodb";
import { TimeControl, Tournament, tcMap } from "@/types";
import { errorLog } from "@/utils/logger";
import { removeDiacritics } from "@/utils/string";

import { actionClient } from "./safeAction";

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

export const searchTournaments = actionClient
  .schema(inputSchema)
  .action(async (input) => {
    const { searchValue, limit } = input.parsedInput;
    try {
      await dbConnect();

      const searchTerms = searchValue
        .split(" ")
        .map((s) => removeDiacritics(s.trim()))
        .filter((s) => s !== "")
        .map((s) => ({ tournament_index: { $regex: s, $options: "i" } }));

      const data = await collections
        .tournaments!.aggregate([
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
          { $limit: limit ?? 20 },
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
