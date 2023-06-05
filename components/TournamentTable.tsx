"use client";

import { TournamentDataProps } from "@/types";
import { useEffect, useState } from "react";

export default function TournamentTable({
  tournamentData,
}: TournamentDataProps) {
  // TODO put most of this is a custom hook
  const [tournamentFilter, setTournamentFilter] = useState(""); // text from search bar
  const [filteredTournamentData, setFilteredTournamentData] =
    useState(tournamentData);

  useEffect(() => {
    setFilteredTournamentData(
      tournamentData.filter((t) =>
        t.town.includes(tournamentFilter.toUpperCase())
      )
    );
  }, [tournamentFilter]);

  const tournaments = filteredTournamentData.map((t) => (
    <tr
      className="border-b border-gray-700 border-opacity-20 bg-gray-800 text-white transition duration-300 ease-in-out hover:bg-gray-400 hover:text-black"
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

  return (
    <section
      id="tournament-table"
      className="w-full lg:col-start-2 lg:col-end-3"
    >
      <div className="p-3 bg-gray-800">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
            value={tournamentFilter}
            onChange={(e) => setTournamentFilter(e.target.value)}
          />
        </div>
      </div>
      <table className="w-full text-center text-xs">
        <thead className="bg-gray-600 text-white">
          <tr className="">
            <th className="p-3">Date</th>
            <th className="p-3">Ville</th>
            <th className="p-3">Tournois</th>
            <th className="p-3">Cadence</th>
          </tr>
        </thead>
        <tbody>{tournaments}</tbody>
      </table>
    </section>
  );
}
