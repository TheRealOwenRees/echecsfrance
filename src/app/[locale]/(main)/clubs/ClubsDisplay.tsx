"use client";

import { Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { clubsAtom, regionFilterAtom } from "@/atoms";
import LoadingMap from "@/components/LoadingMap";
import regionNames from "@/resources/regionNames.json";
import regionGeoJson from "@/resources/regionsGeoJson.json";
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
  const setRegionFilter = useSetAtom(regionFilterAtom);

  const searchParams = useSearchParams();
  const regionSearchParam = searchParams.get("region");

  if (regionSearchParam) {
    const matchedRegion = regionNames.name.find(
      (name) =>
        name
          .toLowerCase()
          .replaceAll(" ", "-")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") === regionSearchParam.toLowerCase(),
    );

    const regionData = regionGeoJson.features.find(
      (f) => f.properties.nom === matchedRegion,
    );

    if (regionData) {
      setRegionFilter(
        regionData as Feature<Polygon | MultiPolygon, GeoJsonProperties>,
      );
    }
  }

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
