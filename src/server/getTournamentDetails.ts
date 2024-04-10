"use server";

import { z } from "zod";

import { collections, dbConnect } from "@/server/mongodb";
import { TimeControl, tcMap } from "@/types";
import { errorLog } from "@/utils/logger";

import { action } from "./safeAction";

const inputSchema = z.object({
  ffeId: z.string(),
});

export const getTournamentDetails = action(inputSchema, async (input) => {
  try {
    await dbConnect();
    const t = await collections.tournaments!.findOne({
      tournament_id: input.ffeId,
    });

    if (t === null) {
      return null;
    }

    const timeControl = tcMap[t.time_control] ?? TimeControl.Other;

    return {
      id: t._id.toString(),
      ffeId: t.tournament_id!,
      tournament: t.tournament,
      town: t.town,
      department: t.department,
      date: t.date,
      url: t.url,
      timeControl,
      status: t.status,
    };
  } catch (error) {
    errorLog(JSON.stringify(error, null, 2));
    throw error;
  }
});
