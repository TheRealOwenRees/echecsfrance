import clientPromise from "@/lib/mongodb";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { dateOrderingFrance } from "@/utils/dbDateOrdering";
import { errorLog } from "@/utils/logger";

import TournamentTable from "./TournamentTable";

export const revalidate = 3600; // revalidate cache every 6 hours;

const LoadingMap = () => {
  const t = useTranslations("Tournaments");
  return (
    <div className="grid h-screen place-items-center bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
      <p>{t("loading")}</p>
    </div>
  );
};

/**
 * Imports the tournament map component, ensuring CSR only.
 * @remarks SSR is not supported by react-leaflet
 */
const TournamentMap = dynamic(() => import("./TournamentMap"), {
  ssr: false,
  loading: LoadingMap,
});

const getTournaments = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("tournamentsFranceDB");
    const data = await dateOrderingFrance(db);
    return JSON.stringify(data);
  } catch (error) {
    errorLog(error);
    throw new Error("Error fetching tournament data");
  }
};

export default async function Tournaments() {
  const tournamentData = await getTournaments();

  return (
    <main className="relative grid h-full lg:grid-cols-2">
      <div className="">
        <TournamentMap tournamentData={JSON.parse(tournamentData)} />
      </div>
      <div className="relative bg-white dark:bg-gray-800 lg:overflow-y-auto">
        <TournamentTable tournamentData={JSON.parse(tournamentData)} />
      </div>
    </main>
  );
}
