import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import TournamentTable from "@/components/TournamentTable";
import { Tournament } from "@/types";

/**
 * Imports the tournament map component, ensuring CSR only.
 * @remarks SSR is not supported by react-leaflet
 */
const TournamentMap = dynamic(() => import("@/components/TournamentMap"), {
  ssr: false,
  loading: () => (
    <div className="h-screen grid text-black place-items-center">
      <p>Loading map...</p>
    </div>
  ),
});

/**
 * Retrieves tournament data from /api/tournaments
 * @remarks The result is cached for the revalidation period in seconds
 */
async function getTournaments() {
  const res = await fetch("http://localhost:3000/api/tournaments", {
    next: { revalidate: 300 },
  });
  return await res.json();
}

export default async function Tournaments() {
  const tournamentData: Tournament[] = await getTournaments();

  return (
    <Layout>
      <main className="grid lg:grid-cols-2">
        <div className="relative h-screen">
          <TournamentMap tournamentData={tournamentData} />
        </div>
        <div className="bg-gray-800">
          <TournamentTable tournamentData={tournamentData} />
        </div>
      </main>
    </Layout>
  );
}
