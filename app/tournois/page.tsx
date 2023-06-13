import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import TournamentTable from "@/components/TournamentTable";

const server = process.env.SERVER;

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
  /**
   * Retrieves tournament data from /api/tournaments/:country
   * @remarks The result is cached for the revalidation period in seconds
   */
  const res = await fetch(`${server}/api/tournaments/france`, {
    next: { revalidate: 300 },
  });
  if (res.status !== 200) {
    throw new Error("Failed to fetch tournament data");
  }
  const tournamentData = await res.json();

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
