import mongoDB, { MongoClient } from "mongodb";

import { TournamentModel } from "@/server/models/tournamentModel";
import { UserModel, VerificationModel } from "@/server/models/userModel";
import { ZoneModel } from "@/server/models/zoneModel";

import { ClubModel } from "./models/clubModel";

export const collections: {
  tournaments?: mongoDB.Collection<TournamentModel>;
  clubs?: mongoDB.Collection<ClubModel>;
  users?: mongoDB.Collection<UserModel>;
  zones?: mongoDB.Collection<ZoneModel>;
  userVerificationTokens?: mongoDB.Collection<VerificationModel>;
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

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  //@ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);

    //@ts-ignore
    global._mongoClientPromise = client.connect();
  }

  //@ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function dbConnect() {
  const p = await clientPromise;

  const userData: mongoDB.Db = p.db("userData");
  collections.users = userData.collection("userData");
  collections.userVerificationTokens = userData.collection(
    "userVerificationTokens",
  );
  collections.zones = userData.collection("zones");

  const tournamentData: mongoDB.Db = p.db("tournamentsFranceDB");
  collections.tournaments = tournamentData.collection("tournaments");
  collections.clubs = tournamentData.collection("clubs");
}
