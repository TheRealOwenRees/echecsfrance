import { z } from "zod";

import clientPromise from "@/lib/mongodb";
import { TournamentData } from "@/types";
import { TimeControl, tcMap } from "@/types";
import { errorLog } from "@/utils/logger";

import { publicProcedure } from "../trpc";

const inputSchema = z.object({
  ffeId: z.string(),
});

export const getTournamentDetails = publicProcedure
  .input(inputSchema)
  .query(async ({ input }) => {
    try {
      const client = await clientPromise;
      const db = client.db("tournamentsFranceDB");
      const t = await db
        .collection("tournaments")
        .findOne<TournamentData>({ tournament_id: input.ffeId });

      if (t === null) {
        return null;
      }

      const timeControl = tcMap[t.time_control] ?? TimeControl.Other;

      return {
        id: t._id.toString(),
        ffeId: t.tournament_id,
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
