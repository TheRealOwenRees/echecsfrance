import { zu } from "@infra-blocks/zod-utils";
import { ObjectId } from "mongodb";
import { z } from "zod";

const featureCollection = zu.geojson.featureCollection();

export type ZoneModel = {
  userId: ObjectId;
  name: string;
  classicNotifications: boolean;
  rapidNotifications: boolean;
  blitzNotifications: boolean;
  otherNotifications: boolean;
  features: z.infer<typeof featureCollection>;
};
