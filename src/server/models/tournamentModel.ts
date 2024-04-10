import { ObjectId } from "mongodb";
import { z } from "zod";

export const tournamentModelSchema = z.object({
  tournament_id: z.string().nullish(),
  town: z.string(),
  department: z.string(),
  country: z.string(),
  tournament: z.string(),
  url: z.string(),
  time_control: z.string(),
  norm_tournament: z.boolean().optional(),
  date: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  coordinates: z.array(z.number()).min(2).max(2),
  entry_method: z.enum(["manual", "auto"]),
  pending: z.boolean().optional(),
  status: z.enum(["scheduled", "ongoing", "finished", "in-play"]),
});

export type TournamentModel = z.infer<typeof tournamentModelSchema>;
