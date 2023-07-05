import { Tournament } from '@/types';
import { atom } from 'jotai';

import atomWithDebounce from "@/utils/atomWithDebounce";

export const tournamentsAtom = atom<Tournament[]>([]);
export const searchStringAtom = atom('');

export const {
  currentValueAtom: hoveredMapTournamentIdAtom,
  debouncedValueAtom: debouncedHoveredMapTournamentIdAtom,
} = atomWithDebounce<string | null>(null);

export const {
  debouncedValueAtom: debouncedHoveredListTournamentIdAtom,
} = atomWithDebounce<string | null>(null);

export const filteredTournamentsAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);
  const searchString = get(searchStringAtom).trim();

  if (searchString === '') return tournaments;
  return tournaments.filter((t) => t.town.includes(searchString.toUpperCase()))
})
