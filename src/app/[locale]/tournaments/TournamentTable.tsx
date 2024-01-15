"use client";

import { useEffect, useRef, useState } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";

import DatePicker from "@/app/[locale]/tournaments/DatePicker";
import {
  datePickerIsOpenAtom,
  dateRangeAtom,
  debouncedHoveredListIdAtom,
  debouncedHoveredMapIdAtom,
  filteredTournamentsListAtom,
  hoveredMapIdAtom,
  normsOnlyAtom,
  syncVisibleAtom,
} from "@/atoms";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SearchBar from "@/components/SearchBar";
import { useBreakpoint } from "@/hooks/tailwind";
import useDatePickerWidth from "@/hooks/useDatePickerWidth";
import calendarSvg from "@/img/calendar.svg";
import { DatePickerDirection } from "@/types";

import TimeControlFilters from "./TimeControlFilters";

const TournamentTable = () => {
  const t = useTranslations("Tournaments");
  const at = useTranslations("App");

  const isLg = useBreakpoint("lg");
  const datePickerRef = useRef<HTMLDivElement>(null);

  const filteredTournaments = useAtomValue(filteredTournamentsListAtom);

  const [syncVisible, setSyncVisible] = useAtom(syncVisibleAtom);
  const [normsOnly, setNormsOnly] = useAtom(normsOnlyAtom);
  const hoveredMapId = useAtomValue(hoveredMapIdAtom);
  const debouncedHoveredMapId = useAtomValue(debouncedHoveredMapIdAtom);
  const setHoveredListId = useSetAtom(debouncedHoveredListIdAtom);

  const setDateRange = useSetAtom(dateRangeAtom);
  const [datePickerIsOpen, setDatePickerIsOpen] = useAtom(datePickerIsOpenAtom);
  const [dateDirectionState, setDateDirectionState] =
    useState<DatePickerDirection>("horizontal");

  useDatePickerWidth({ datePickerRef, setDateDirectionState });

  useEffect(() => {
    if (!isLg || debouncedHoveredMapId === null) return;
    const tournamentRow = document.querySelector(
      `[data-group-id="${debouncedHoveredMapId}"]`,
    );

    tournamentRow?.scrollIntoView({ behavior: "smooth" });
  }, [debouncedHoveredMapId, isLg]);

  const handleDatePickerClick = () => {
    // reset date range today -> max date
    setDateRange([
      {
        startDate: new Date(),
        endDate: undefined,
        key: "selection",
      },
    ]);
    setDatePickerIsOpen(!datePickerIsOpen);
  };

  return (
    <section
      className="grid w-full auto-rows-max pb-20 lg:col-start-2 lg:col-end-3 lg:h-content lg:overflow-y-scroll lg:pb-0"
      id="listing"
    >
      <div className="z-10 flex w-full flex-wrap items-center justify-start gap-3 p-3">
        <SearchBar />

        {/*<FaCalendarAlt*/}
        {/*  className="cursor-pointer text-black dark:text-white"*/}
        {/*  onClick={handleDatePickerClick}*/}
        {/*/>*/}

        <Image
          src={calendarSvg}
          alt="date"
          width={30}
          className="cursor-pointer"
          onClick={handleDatePickerClick}
        />

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

          <label>
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
              checked={normsOnly}
              onChange={() => setNormsOnly(!normsOnly)}
            />
            {t("normsOnly")}
          </label>
        </div>

        <div className="hidden lg:block">
          <TimeControlFilters />
        </div>
      </div>

      <div className="flex justify-center" ref={datePickerRef}>
        {datePickerIsOpen && (
          <DatePicker datePickerDirection={dateDirectionState} />
        )}
      </div>

      <ScrollToTopButton />

      <div className="overflow-x-scroll">
        <table className="relative min-w-full table-fixed text-center text-xs lg:w-full">
          <thead>
            <tr>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("date")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("town")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("tournament")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("timeControl")}
              </th>
              <th className="sticky top-0 w-[50px] bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("ffe")}
              </th>
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
                  key={tournament.id}
                  id={tournament.id}
                  data-group-id={tournament.groupId}
                  onMouseEnter={() => setHoveredListId(tournament.id)}
                  onMouseLeave={() => setHoveredListId(null)}
                  className={twMerge(
                    "scroll-m-20 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900",
                    hoveredMapId === tournament.groupId &&
                      "bg-gray-200 dark:bg-gray-900",
                  )}
                >
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {tournament.date}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {tournament.town}
                  </td>
                  <td className="px-1 py-2 text-left sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    <span>
                      {tournament.norm && (
                        <FaTrophy
                          className="mr-2 inline-block h-4 w-4"
                          data-norm="norm"
                        />
                      )}
                      {tournament.tournament}
                    </span>
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {at("timeControlEnum", { tc: tournament.timeControl })}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    <div className="flex justify-center">
                      <a
                        href={tournament.url}
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

      <Tooltip anchorSelect="[data-norm='norm']">
        <div className="flex items-center">
          <FaTrophy className="mr-3 h-4 w-4" />
          {t("norm")}
        </div>
      </Tooltip>
    </section>
  );
};

export default TournamentTable;
