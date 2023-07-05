"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useHydrateAtoms } from "jotai/utils";

import { Tournament } from "@/types";
import { tournamentsAtom } from "@/app/atoms";

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

type TournamentsDisplayProps = {
  tournaments: Tournament[];
};

export default async function TournamentsDisplay({
  tournaments,
}: TournamentsDisplayProps) {
  useHydrateAtoms([[tournamentsAtom, tournaments]]);

  return (
    <main className="relative grid h-full w-full lg:grid-cols-2">
      <div className="">
        <TournamentMap />
      </div>
      <div className="relative bg-white dark:bg-gray-800 lg:overflow-y-auto">
        <TournamentTable />
      </div>
    </main>
  );
}
