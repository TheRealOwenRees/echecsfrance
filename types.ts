import { LatLngLiteral } from "leaflet";
import { ObjectId } from "mongodb";

export type Status = "scheduled" | "ongoing" | "finished";

export type TournamentData = {
  _id: ObjectId;
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
  status: Status
};

export enum TimeControl {
  Classic = "Classic",
  Rapid = "Rapid",
  Blitz = "Blitz",
  Other = "Other",
}

export type Tournament = {
  id: string;
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

export type ResponseMessage = {
  isSuccessful: boolean;
  message: string;
};

export type ScrollableElement = Window | HTMLElement;
