import { LatLngLiteral } from "leaflet";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

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
  pending: boolean;
}

export interface MapProps {
  position: LatLngLiteral;
  setPosition: Dispatch<SetStateAction<LatLngLiteral>>;
  center: LatLngLiteral;
}

export interface TournamentFormProps {
  addressRef: MutableRefObject<HTMLInputElement | null>;
  townRef: MutableRefObject<HTMLInputElement | null>;
  departmentRef: MutableRefObject<HTMLInputElement | null>;
  tournamentNameRef: MutableRefObject<HTMLInputElement | null>;
  urlRef: MutableRefObject<HTMLInputElement | null>;
  timeControlRef: MutableRefObject<HTMLSelectElement | null>;
  dateRef: MutableRefObject<HTMLInputElement | null>;
  countryRef: MutableRefObject<HTMLInputElement | null>;
  normRef: MutableRefObject<HTMLSelectElement | null>;
  yourNameRef: MutableRefObject<HTMLInputElement | null>;
  yourEmailRef: MutableRefObject<HTMLInputElement | null>;
  messageRef: MutableRefObject<HTMLTextAreaElement | null>;
  position: LatLngLiteral;
  setPosition: Dispatch<SetStateAction<LatLngLiteral>>;
}

export interface ResponseMessage {
  isSuccessful: boolean;
  message: string;
}

export type ScrollableElement = Window | HTMLElement;
