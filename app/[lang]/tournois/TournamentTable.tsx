"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { twMerge } from "tailwind-merge";
import { FaExternalLinkAlt } from "react-icons/fa";

import {
  filteredTournamentsListAtom,
  syncVisibleAtom,
  hoveredMapTournamentIdAtom,
  debouncedHoveredMapTournamentIdAtom,
  debouncedHoveredListTournamentIdAtom,
} from "@/app/atoms";
import { useBreakpoint } from "@/hooks/tailwind";

import SearchBar from "./SearchBar";
import TimeControlFilters from "./TimeControlFilters";
import ScrollToTopButton from "./ScrollToTopButton";

export default function TournamentTable() {
  const t = useTranslations("Tournaments");

  const filteredTournaments = useAtomValue(filteredTournamentsListAtom);
  const [syncVisible, setSyncVisible] = useAtom(syncVisibleAtom);
  const hoveredMapTournamentId = useAtomValue(hoveredMapTournamentIdAtom);
  const debouncedHoveredMapTournamentId = useAtomValue(
    debouncedHoveredMapTournamentIdAtom
  );
  const setHoveredListTournamentId = useSetAtom(
    debouncedHoveredListTournamentIdAtom
  );

  const isLg = useBreakpoint("lg");

  useEffect(() => {
    if (!isLg || debouncedHoveredMapTournamentId === null) return;

    const tournamentRow = document.getElementById(
      debouncedHoveredMapTournamentId
    );

    tournamentRow?.scrollIntoView({ behavior: "smooth" });
  }, [debouncedHoveredMapTournamentId, isLg]);

  return (
    <section
      className="tournament-table grid w-full auto-rows-max pb-20 lg:col-start-2 lg:col-end-3 lg:h-content lg:overflow-y-scroll lg:pb-0"
      id="tournament-table"
      data-test="tournament-table-div"
    >
      <div className="z-10 flex w-full flex-wrap items-center justify-between gap-3 p-3">
        <SearchBar />
        <div className="text-gray-900 dark:text-white">
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={syncVisible}
              onChange={() => setSyncVisible(!syncVisible)}
            />
            {t("syncWithMapCheckbox")}
          </label>
        </div>

        <div className="hidden lg:block">
          <TimeControlFilters />
        </div>
      </div>

      <ScrollToTopButton />

      <table
        className="relative w-full table-fixed text-center text-xs"
        data-test="tournament-table"
      >
        <thead>
          <tr>
            <th className="sticky top-0 bg-teal-600 p-3 text-white dark:bg-gray-600">
              {t("date")}
            </th>
            <th className="sticky top-0 bg-teal-600 p-3 text-white dark:bg-gray-600">
              {t("town")}
            </th>
            <th className="sticky top-0 bg-teal-600 p-3 text-white dark:bg-gray-600">
              {t("tournament")}
            </th>
            <th className="sticky top-0 bg-teal-600 p-3 text-white dark:bg-gray-600">
              {t("timeControl")}
            </th>
            <th className="sticky top-0 w-[50px] bg-teal-600 p-3 text-white dark:bg-gray-600"></th>
          </tr>
        </thead>

        <tbody>
          {filteredTournaments.length === 0 ? (
            <tr className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
              <td colSpan={4} className="p-3">
                {t("noneFound")}
              </td>
            </tr>
          ) : (
            filteredTournaments.map((tournament) => (
              <tr
                key={tournament._id}
                id={tournament._id}
                onMouseEnter={() => setHoveredListTournamentId(tournament._id)}
                onMouseLeave={() => setHoveredListTournamentId(null)}
                className={twMerge(
                  "scroll-m-20 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900",
                  hoveredMapTournamentId === tournament._id &&
                    "bg-gray-200 dark:bg-gray-900"
                )}
              >
                <td className="p-3">{tournament.date}</td>
                <td className="p-3">{tournament.town}</td>
                <td className="p-3">{tournament.tournament}</td>
                <td className="p-3">
                  {t("timeControlEnum", { tc: tournament.timeControl })}
                </td>
                <td className="p-3">
                  <a href={tournament.url} target="_blank">
                    <FaExternalLinkAlt />
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
