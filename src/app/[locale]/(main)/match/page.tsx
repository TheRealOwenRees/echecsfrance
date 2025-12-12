import { unstable_cache } from "next/cache";

import MatchForm from "@/app/[locale]/(main)/match/MatchForm";
import { collections, dbConnect } from "@/server/mongodb";
import { Club } from "@/types";
import { filterClubsByManualEntry } from "@/utils/clubFilters";
import { errorLog } from "@/utils/logger";

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

export default async function Match() {
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

  return (
    <section className="grid place-items-center bg-white p-2 pb-20 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Match
        </h2>

        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
          Match
        </p>
      </div>

      <MatchForm clubs={clubs} />
    </section>
  );
}
