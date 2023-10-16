import { LatLngLiteral } from "leaflet";
import { ObjectId } from "mongodb";

export type Status = "scheduled" | "ongoing" | "finished";

export type TournamentData = {
  _id: ObjectId;
  tournament_id: string;
  town: string;
  department: string;
  country: string;
  tournament: string;
  url: string;
  time_control: "Cadence Lente" | "Rapide" | "Blitz" | string;
  norm_tournament: boolean;
  date: string;
  coordinates: [number, number];
  entry_method: "manual" | "auto";
  pending: boolean;
  status: Status;
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

export type ScrollableElement = Window | HTMLElement;

// Prettify takes a type as its argument and returns a new type that has the same properties as the original type,
// but the properties are not intersected. This means that the new type is easier to read and understand.
// https://gist.github.com/palashmon/db68706d4f26d2dbf187e76409905399

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
