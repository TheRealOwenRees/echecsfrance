import type { Dispatch, SetStateAction } from "react";

import {
  type Feature,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from "geojson";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { IoClose } from "react-icons/io5";

import { regionFilterAtom } from "@/atoms";
import { Modal } from "@/components/Modal";
import regionNames from "@/resources/regionNames.json";
import regionGeoJson from "@/resources/regionsGeoJson.json";

interface IProps {
  isRegionModalOpen: boolean;
  setIsRegionModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const RegionSelectModal = ({
  isRegionModalOpen,
  setIsRegionModalOpen,
}: IProps) => {
  const t = useTranslations("Zones");
  const setRegionFilter = useSetAtom(regionFilterAtom);

  const handleCloseModal = () => {
    setIsRegionModalOpen(false);
  };

  const handleRegionSelect = (region: string) => {
    const regionData = regionGeoJson.features.find(
      (f) => f.properties.nom === region,
    );
    if (regionData) {
      setRegionFilter(
        regionData as Feature<Polygon | MultiPolygon, GeoJsonProperties>,
      );
      handleCloseModal();
    }
  };

  const regions = [...regionNames.name];

  const midPoint = Math.ceil(regions.length / 2);
  const leftColumnRegions = regions.slice(0, midPoint);
  const rightColumnRegions = regions.slice(midPoint);

  return (
    <Modal
      open={isRegionModalOpen}
      onClose={handleCloseModal}
      title={t("RegionFilter.regionModalTitle")}
      panelClass="max-w-3xl relative"
    >
      <button
        onClick={handleCloseModal}
        className="absolute right-4 top-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        <IoClose size={24} />
      </button>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            {leftColumnRegions.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionSelect(region)}
                className="w-full rounded-lg border border-gray-300 p-3 text-left text-gray-900 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {region}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {rightColumnRegions.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionSelect(region)}
                className="w-full rounded-lg border border-gray-300 p-3 text-left text-gray-900 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
