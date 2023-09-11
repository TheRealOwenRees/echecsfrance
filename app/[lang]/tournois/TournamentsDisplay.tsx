"use client";

import { useHydrateAtoms } from "jotai/utils";
import dynamic from "next/dynamic";

import LoadingMap from "@/app/[lang]/components/LoadingMap";
import { tournamentsAtom } from "@/app/atoms";
import { Tournament } from "@/types";

import TournamentTable from "./TournamentTable";

type TournamentsDisplayProps = {
  tournaments: Tournament[];
};

/**
 * Imports the tournament map component, ensuring CSR only.
 * @remarks SSR is not supported by react-leaflet
 */
const TournamentMap = dynamic(() => import("./TournamentMap"), {
  ssr: false,
  loading: LoadingMap,
});

export default function TournamentsDisplay({
  tournaments,
}: TournamentsDisplayProps) {
  useHydrateAtoms([[tournamentsAtom, tournaments]]);

  return (
    <main className="relative grid h-full w-full lg:grid-cols-2">
      <div>
        <TournamentMap />
      </div>
      <div className="relative bg-white dark:bg-gray-800 lg:overflow-y-auto">
        <TournamentTable />
      </div>
    </main>
  );
}
