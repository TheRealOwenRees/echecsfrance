import { Tournament } from "@/types";

import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import TournamentTable from "@/components/TournamentTable";
import getTournaments from "@/utils/getTournamentData";

// TODO can these functions be put into a custom hook?
/**
 * Imports the tournament map component, ensuring CSR only.
 * @remarks SSR is not supported by react-leaflet
 */
const TournamentMap = dynamic(() => import("@/components/TournamentMap"), {
  ssr: false,
  loading: () => (
    <div className="h-screen grid place-items-center text-gray-900 bg-white dark:bg-gray-800 dark:text-white">
      <p>Loading map...</p>
    </div>
  ),
});

export default async function Tournaments() {
  const tournamentData: Tournament[] = await getTournaments("france");

  return (
    <Layout>
      <main className="grid lg:grid-cols-2">
        <div className="">
          <TournamentMap tournamentData={tournamentData} />
        </div>
        <div className="bg-white dark:bg-gray-800 lg:overflow-y-auto">
          <TournamentTable tournamentData={tournamentData} />
        </div>
      </main>
    </Layout>
  );
}
