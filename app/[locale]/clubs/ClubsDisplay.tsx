"use client";

import { useHydrateAtoms } from "jotai/utils";
import dynamic from "next/dynamic";

import { clubsAtom } from "@/app/atoms";
import LoadingMap from "@/components/LoadingMap";
import { Club } from "@/types";

import ClubTable from "./ClubTable";

type ClubsDisplayProps = {
  clubs: Club[];
};

/**
 * Imports the club map component, ensuring CSR only.
 * @remarks SSR is not supported by react-leaflet
 */
const ClubMap = dynamic(() => import("./ClubMap"), {
  ssr: false,
  loading: LoadingMap,
});

export default function ClubsDisplay({ clubs }: ClubsDisplayProps) {
  useHydrateAtoms([[clubsAtom, clubs]]);

  return (
    <main className="relative grid h-full w-full lg:grid-cols-2">
      <div>
        <ClubMap />
      </div>
      <div className="relative bg-white dark:bg-gray-800 lg:overflow-y-auto">
        <ClubTable />
      </div>
    </main>
  );
}
