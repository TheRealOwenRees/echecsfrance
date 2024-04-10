import { ObjectId } from "mongodb";

export type ClubModel = {
  _id: ObjectId;
  name: string;
  url?: string;
  address?: string;
  email?: string;
  website?: string;
  coordinates: [number, number];
};
