"use server";

import { format } from "date-fns";

import { addTournamentSchema } from "@/schemas";
import { collections, dbConnect } from "@/server/mongodb";
import { TimeControl } from "@/types";
import { errorLog } from "@/utils/logger";

import { TournamentModel } from "./models/tournamentModel";
import { action } from "./safeAction";

const tcMap: Record<TimeControl, TournamentModel["time_control"]> = {
  [TimeControl.Classic]: "Cadence Lente",
  [TimeControl.Rapid]: "Rapide",
  [TimeControl.Blitz]: "Blitz",
  [TimeControl.Other]: "Other",
};

export const addTournament = action(addTournamentSchema, async (input) => {
  try {
    await dbConnect();

    const { name, email, message, tournament } = input;

    const tournamentData: Omit<TournamentModel, "_id" | "tournament_id"> = {
      ...tournament,
      date: format(tournament.date, "dd/MM/yyyy"),
      start_date: format(tournament.date, "dd/MM/yyyy"),
      end_date: format(tournament.date, "dd/MM/yyyy"),
      time_control: tcMap[tournament.time_control],
      coordinates: tournament.coordinates as [number, number],
      entry_method: "manual",
      pending: true,
      status: "scheduled",
    };

    const result = await collections.tournaments!.insertOne(tournamentData);

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
