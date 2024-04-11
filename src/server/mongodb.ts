import mongoDB, { MongoClient } from "mongodb";

import { TournamentModel } from "@/server/models/tournamentModel";
import { UserModel } from "@/server/models/userModel";
import { ZoneModel } from "@/server/models/zoneModel";

import { ClubModel } from "./models/clubModel";

export const collections: {
  tournaments?: mongoDB.Collection<TournamentModel>;
  clubs?: mongoDB.Collection<ClubModel>;
  users?: mongoDB.Collection<UserModel>;
  zones?: mongoDB.Collection<ZoneModel>;
} = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: mongoDB.MongoClient;
export let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export async function dbConnect() {
  await clientPromise;

  const userData: mongoDB.Db = client!.db("userData");
  collections.users = userData.collection("userData");
  collections.zones = userData.collection("zones");

  const tournamentData: mongoDB.Db = client!.db("tournamentsFranceDB");
  collections.tournaments = tournamentData.collection("tournaments");
  collections.clubs = tournamentData.collection("clubs");
}
