"use client";

import { TournamentDataProps } from "@/types";
import { useEffect, useState } from "react";
import useTournamentDataFilter from "@/hooks/useTournamentFilter";
import SearchBar from "@/components/SearchBar";

export default function TournamentTable({
  tournamentData,
}: TournamentDataProps) {
  const [tournamentFilter, setTournamentFilter] = useState(""); // text from search bar
  const [filteredTournamentData, setFilteredTournamentData] =
    useTournamentDataFilter(tournamentData);

  useEffect(() => {
    setFilteredTournamentData(tournamentFilter);
  }, [tournamentFilter]);

  return (
    <section
      id="tournament-table"
      className="w-full lg:col-start-2 lg:col-end-3"
    >
      <SearchBar
        tournamentFilter={tournamentFilter}
        setTournamentFilter={setTournamentFilter}
      />
      <table className="table-fixed w-full text-center text-xs">
        <thead className="bg-gray-600 text-white">
          <tr className="">
            <th className="p-3">Date</th>
            <th className="p-3">Ville</th>
            <th className="p-3">Tournois</th>
            <th className="p-3">Cadence</th>
          </tr>
        </thead>
        <tbody>{filteredTournamentData}</tbody>
      </table>
    </section>
  );
}
