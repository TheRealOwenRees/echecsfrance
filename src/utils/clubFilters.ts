import { ObjectId } from "mongodb";

import { Club } from "@/types";

export interface IClub extends Omit<Club, "id" | "latLng"> {
  _id: ObjectId;
  coordinates: number[];
  manual_entry?: boolean;
  pending?: boolean;
}

export const filterClubsByManualEntry = (clubData: IClub[]): IClub[] =>
  Object.values(
    clubData.reduce<Record<string, IClub>>((acc, club) => {
      const key = club.name;

      if (!acc[key]) {
        acc[key] = club;
        return acc;
      }

      const existing = acc[key];

      if (
        club.manual_entry === true &&
        existing.manual_entry !== true &&
        club.pending !== true
      ) {
        acc[key] = club;
      }

      return acc;
    }, {}),
  );
