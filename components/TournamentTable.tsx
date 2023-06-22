"use client";

import { TournamentDataProps } from "@/types";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function TournamentTable({
  tournamentData,
}: TournamentDataProps) {
  let tableData;
  const [searchQuery, setSearchQuery] = useState(""); // text from search bar
  const [filteredTournamentData, setFilteredTournamentData] =
    useState(tournamentData);

  useEffect(() => {
    setFilteredTournamentData(
      tournamentData.filter((t) => t.town.includes(searchQuery.toUpperCase()))
    );
  }, [searchQuery]);

  // TODO move this section into its own function
  if (filteredTournamentData.length === 0) {
    tableData = (
      <tr className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
        <td colSpan={4} className="p-3">
          No tournaments found
        </td>
      </tr>
    );
  } else {
    tableData = filteredTournamentData.map((t) => (
      <tr
        className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-900"
        key={t._id}
      >
        <td className="p-3">
          <a href={t.url} target="_blank">
            {t.date}
          </a>
        </td>
        <td className="p-3">
          <a href={t.url} target="_blank">
            {t.town}
          </a>
        </td>
        <td className="p-3">
          <a href={t.url} target="_blank">
            {t.tournament}
          </a>
        </td>
        <td className="p-3">
          <a href={t.url} target="_blank">
            {t.time_control}
          </a>
        </td>
      </tr>
    ));
  }

  return (
    <section
      className="tournament-table w-full grid auto-rows-max pb-20 lg:h-[calc(100vh-173px)] lg:col-start-2 lg:col-end-3 lg:overflow-y-scroll"
      id="tournament-table"
      data-test="tournament-table-div"
    >
      <div className="flex z-10">
        <SearchBar
          tournamentFilter={searchQuery}
          setTournamentFilter={setSearchQuery}
        />
        <div>
          <ScrollToTopButton />
        </div>
      </div>
      <table
        className="relative table-fixed w-full text-center text-xs"
        data-test="tournament-table"
      >
        <thead>
          <tr>
            <th className="sticky top-0 p-3 bg-teal-600 text-white dark:bg-gray-600">
              Date
            </th>
            <th className="sticky top-0 p-3 bg-teal-600 text-white dark:bg-gray-600">
              Ville
            </th>
            <th className="sticky top-0 p-3 bg-teal-600 text-white dark:bg-gray-600">
              Tournois
            </th>
            <th className="sticky top-0 p-3 bg-teal-600 text-white dark:bg-gray-600">
              Cadence
            </th>
          </tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
    </section>
  );
}
