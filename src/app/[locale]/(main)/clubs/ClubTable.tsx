"use client";

import { useEffect } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { FaExternalLinkAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import {
  debouncedHoveredListIdAtom,
  debouncedHoveredMapIdAtom,
  filteredClubsListAtom,
  hoveredMapIdAtom,
  syncVisibleAtom,
} from "@/atoms";
import SearchBar from "@/components/SearchBar";
import { useBreakpoint } from "@/hooks/tailwind";

const ClubTable = () => {
  const t = useTranslations("Clubs");
  const at = useTranslations("App");

  const filteredClubs = useAtomValue(filteredClubsListAtom);
  const [syncVisible, setSyncVisible] = useAtom(syncVisibleAtom);
  const hoveredMapId = useAtomValue(hoveredMapIdAtom);
  const debouncedHoveredMapId = useAtomValue(debouncedHoveredMapIdAtom);
  const setHoveredListId = useSetAtom(debouncedHoveredListIdAtom);

  const isLg = useBreakpoint("lg");

  useEffect(() => {
    if (!isLg || debouncedHoveredMapId === null) return;
    const clubRow = document.querySelector(
      `[data-group-id="${debouncedHoveredMapId}"]`,
    );

    clubRow?.scrollIntoView({ behavior: "smooth" });
  }, [debouncedHoveredMapId, isLg]);

  return (
    <section
      className="club-table grid w-full auto-rows-max pb-20 lg:col-start-2 lg:col-end-3 lg:h-content lg:overflow-y-scroll lg:pb-0"
      id="listing"
    >
      <div className="z-10 flex w-full flex-wrap items-center justify-between gap-3 p-3">
        <SearchBar />

        <div className="flex flex-col gap-0 text-gray-900 dark:text-white">
          <label>
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
              checked={syncVisible}
              onChange={() => setSyncVisible(!syncVisible)}
            />
            {t("syncWithMapCheckbox")}
          </label>
        </div>
      </div>

      <div className="overflow-x-scroll bg-red-50">
        <table className="relative min-w-full table-fixed text-center text-xs lg:min-w-full">
          <thead>
            <tr>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("name")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("contact")}
              </th>
              <th className="sticky top-0 w-[50px] bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("ffe")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredClubs.length === 0 ? (
              <tr className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                <td colSpan={4} className="p-3">
                  {t("noneFound")}
                </td>
              </tr>
            ) : (
              filteredClubs.map((club) => (
                <tr
                  key={club.id}
                  id={club.id}
                  onMouseEnter={() => setHoveredListId(club.id)}
                  onMouseLeave={() => setHoveredListId(null)}
                  className={twMerge(
                    "scroll-m-20 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900",
                    hoveredMapId === club.id && "bg-gray-200 dark:bg-gray-900",
                  )}
                >
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {club.name}
                  </td>
                  <td className="px-1 py-2 text-left sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {club.address && <div>{club.address}</div>}
                    {club.website && (
                      <div>
                        <a
                          href={club.website}
                          className="text-primary hover:text-primary-800"
                          target="_blank"
                        >
                          {club.website}
                        </a>
                      </div>
                    )}
                    {club.email && (
                      <div>
                        <a
                          href={`mailto:${club.email}`}
                          className="text-primary hover:text-primary-800"
                        >
                          {club.email}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    <div className="flex justify-center">
                      <a
                        href={club.url}
                        target="_blank"
                        className="text-primary hover:text-primary-800"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ClubTable;
