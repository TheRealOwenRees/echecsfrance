import { unstable_cache } from "next/cache";

import { collections, dbConnect } from "@/server/mongodb";
import { Club } from "@/types";
import { filterClubsByManualEntry } from "@/utils/clubFilters";
import { errorLog } from "@/utils/logger";

import ClubsDisplay from "./ClubsDisplay";

export const revalidate = 3600; // Revalidate cache every 6 hours

const getClubs = async () => {
  try {
    await dbConnect();
    const data = await collections
      .clubs!.find({ pending: { $ne: true } })
      .sort({ name: 1 })
      .toArray();

    return filterClubsByManualEntry(data)
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
  const clubs = await unstable_cache(
    async () => {
      const data = await getClubs();
      return data;
    },
    ["clubs"],
    {
      revalidate: 60 * 60 * 6,
    },
  )();

  return <ClubsDisplay clubs={clubs} />;
}
