import { LatLngLiteral } from "leaflet";

export enum TimeControl {
  Classic = "Classic",
  Rapid = "Rapid",
  Blitz = "Blitz",
  Other = "Other",
}

export interface Tournament {
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
}

export type ScrollableElement = Window | HTMLElement;
