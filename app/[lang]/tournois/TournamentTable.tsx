"use client";

import { TournamentDataProps } from "@/types";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import SearchBar from "./SearchBar";
import ScrollToTopButton from "./ScrollToTopButton";

export default function TournamentTable({
  tournamentData,
}: TournamentDataProps) {
  let tableData;
  const t = useTranslations("Tournaments");
  const [searchQuery, setSearchQuery] = useState(""); // text from search bar
  const [filteredTournamentData, setFilteredTournamentData] =
    useState(tournamentData);

  useEffect(() => {
    setFilteredTournamentData(
      tournamentData.filter((t) => t.town.includes(searchQuery.toUpperCase()))
    );
  }, [searchQuery, tournamentData]);

  // TODO move this section into its own function
  if (filteredTournamentData.length === 0) {
    tableData = (
      <tr className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
        <td colSpan={4} className="p-3">
          {t("noneFound")}
        </td>
      </tr>
    );
  } else {
    tableData = filteredTournamentData.map((data) => (
      <tr
        className="bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900"
        key={data._id}
      >
        <td className="p-3">
          <a href={data.url} target="_blank">
            {data.date}
          </a>
        </td>
        <td className="p-3">
          <a href={data.url} target="_blank">
            {data.town}
          </a>
        </td>
        <td className="p-3">
          <a href={data.url} target="_blank">
            {data.tournament}
          </a>
        </td>
        <td className="p-3">
          <a href={data.url} target="_blank">
            {data.time_control}
          </a>
        </td>
      </tr>
    ));
  }

  return (
    <section
      className="tournament-table grid w-full auto-rows-max pb-20 lg:col-start-2 lg:col-end-3 lg:h-[calc(100vh-144px)] lg:overflow-y-scroll"
      id="tournament-table"
      data-test="tournament-table-div"
    >
      <div className="z-10 flex">
        <SearchBar
          tournamentFilter={searchQuery}
          setTournamentFilter={setSearchQuery}
        />
        <div>
          <ScrollToTopButton />
        </div>
      </div>
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
          </tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
    </section>
  );
}
