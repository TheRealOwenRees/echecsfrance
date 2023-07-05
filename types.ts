import { LatLngLiteral } from "leaflet";

export enum TimeControl {
  Classic = "Classic",
  Rapid = "Rapid",
  Blitz = "Blitz",
  KO = "KO",
};

export interface Tournament {
  _id: string;
  town: string;
  department: string;
  tournament: string;
  url: string;
  timeControl: TimeControl;
  date: string;
  latLng: LatLngLiteral;
}

export type ScrollableElement = Window | HTMLElement;
