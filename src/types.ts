import { LatLngLiteral } from "leaflet";
import { ObjectId } from "mongodb";
import { z } from "zod";

export type Status = "scheduled" | "ongoing" | "finished" | "in-play";

export const tournamentDataSchema = z.object({
  tournament_id: z.string(),
  town: z.string(),
  department: z.string(),
  country: z.string(),
  tournament: z.string(),
  url: z.string(),
  time_control: z.string(),
  norm_tournament: z.boolean().optional(),
  date: z.string(),
  coordinates: z.array(z.number()).min(2).max(2),
  entry_method: z.enum(["manual", "auto"]),
  pending: z.boolean().optional(),
  status: z.enum(["scheduled", "ongoing", "finished", "in-play"]),
});

export type TournamentData = z.infer<typeof tournamentDataSchema> & {
  _id: ObjectId;
};

export type ClubData = {
  _id: ObjectId;
  name: string;
  url?: string;
  address?: string;
  email?: string;
  website?: string;
  coordinates: [number, number];
};

export enum TimeControl {
  Classic = "Classic",
  Rapid = "Rapid",
  Blitz = "Blitz",
  Other = "Other",
}

export type Tournament = {
  id: string;
  ffeId: string;
  groupId: string;
  town: string;
  department: string;
  tournament: string;
  url: string;
  timeControl: TimeControl;
  date: string;
  isoDate: string;
  latLng: LatLngLiteral;
  norm: boolean;
  pending: boolean;
  status: Status;
};

export const tcMap: Record<TournamentData["time_control"], TimeControl> = {
  "Cadence Lente": TimeControl.Classic,
  Rapide: TimeControl.Rapid,
  Blitz: TimeControl.Blitz,
};

export type Club = {
  id: string;
  name: string;
  url?: string;
  address?: string;
  email?: string;
  website?: string;
  latLng: LatLngLiteral;
};

export type ResponseMessage = {
  isSuccessful: boolean;
  message: string;
};

export type DatePickerDirection = "horizontal" | "vertical";

export type ScrollableElement = Window | HTMLElement;

// Prettify takes a type as its argument and returns a new type that has the same properties as the original type,
// but the properties are not intersected. This means that the new type is easier to read and understand.
// https://gist.github.com/palashmon/db68706d4f26d2dbf187e76409905399

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
