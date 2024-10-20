import { LatLngLiteral } from "leaflet";

import { TournamentModel } from "./server/models/tournamentModel";

export type Status = "scheduled" | "ongoing" | "finished" | "in-play";

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

export const tcMap: Record<TournamentModel["time_control"], TimeControl> = {
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

export type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${K}.${Path<T[K], keyof T[K]>}`
    : K

  : never;