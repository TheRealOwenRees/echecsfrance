import { groupBy } from "lodash";

import clientPromise from "@/lib/mongodb";
import { Club, ClubData } from "@/types";
import { errorLog } from "@/utils/logger";

import ClubsDisplay from "./ClubsDisplay";

export const revalidate = 3600; // Revalidate cache every 6 hours

const getClubs = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");
    const data = await db
      .collection("clubs")
      .find<ClubData>({})
      .sort({ name: 1 })
      .toArray();

    return data
      .filter((c) => !!c.coordinates)
      .map<Club>((club) => {
        return {
          id: club._id.toString(),
          name: club.name,
          url: club.url,
          address: club.address,
          email: club.email,
          website: club.website,
          latLng: { lat: club.coordinates[0], lng: club.coordinates[1] },
        };
      });
  } catch (error) {
    errorLog(error);
    throw new Error("Error fetching club data");
  }
};

export default async function Clubs() {
  const clubs = await getClubs();
  return <ClubsDisplay clubs={clubs} />;
}
