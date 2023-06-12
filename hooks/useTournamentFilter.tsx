import { Tournament } from "@/types";
import { useState } from "react";

// TODO change 'any'
// TODO document this hook with TSDoc
const useTournamentDataFilter = (
  initialState: Tournament[]
): (any | ((searchQuery: string) => void))[] => {
  const [filtered, setFiltered] = useState(initialState);
  let state;
  const setState = (searchQuery: string) => {
    setFiltered(
      initialState.filter((t) => t.town.includes(searchQuery.toUpperCase()))
    );
  };

  if (filtered.length === 0) {
    state = (
      <tr className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
        <td colSpan={4} className="p-3">
          No tournaments found
        </td>
      </tr>
    );
  } else {
    state = filtered.map((t) => (
      <tr
        className="text-gray-900 bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-400 hover:text-black"
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
  return [state, setState];
};

export default useTournamentDataFilter;
