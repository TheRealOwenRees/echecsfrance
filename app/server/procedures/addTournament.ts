import { format } from "date-fns";

import clientPromise from "@/lib/mongodb";
import { addTournamentSchema } from "@/schemas";
import { TournamentData } from "@/types";
import { TimeControl } from "@/types";
import { errorLog } from "@/utils/logger";

import { publicProcedure } from "../trpc";

const tcMap: Record<TimeControl, TournamentData["time_control"]> = {
  [TimeControl.Classic]: "Cadence Lente",
  [TimeControl.Rapid]: "Rapide",
  [TimeControl.Blitz]: "Blitz",
  [TimeControl.Other]: "Other",
};

export const addTournament = publicProcedure
  .input(addTournamentSchema)
  .mutation(async ({ input }) => {
    try {
      const client = await clientPromise;
      const db = client.db("tournamentsFranceDB").collection("tournaments");

      const { name, email, message, tournament } = input;

      const tournamentData: Omit<TournamentData, "_id"> = {
        ...tournament,
        date: format(tournament.date, "dd/MM/yyyy"),
        time_control: tcMap[tournament.time_control],
        coordinates: tournament.coordinates as [number, number],
        entry_method: "manual",
        pending: true,
      };

      const result = await db.insertOne(tournamentData);

      if (result.insertedId) {
        const { tournament, country, date, time_control } = tournamentData;

        if (typeof process.env.DISCORD_WEBHOOK_ADD_TOURNAMENT_URL === "string") {
          await fetch(process.env.DISCORD_WEBHOOK_ADD_TOURNAMENT_URL as string, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              embeds: [
                {
                  title: "Tournament Submitted",
                  fields: [
                    { name: "Tournament", value: tournament },
                    { name: "Country", value: country },
                    { name: "Date", value: date },
                    {
                      name: "Time Control",
                      value: time_control,
                    },
                    { name: "Sender", value: name },
                    { name: "Sender Email", value: email },
                    { name: "Message", value: message ?? "" },
                  ],
                },
              ],
            }),
          });
        }

        return true;
      }
    } catch (error) {
      errorLog(error);
      throw error;
    }
  });
