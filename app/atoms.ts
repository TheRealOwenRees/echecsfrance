import { Tournament } from '@/types';
import { atom } from 'jotai';
import { LatLngBounds } from 'leaflet';

import atomWithDebounce from "@/utils/atomWithDebounce";

export const tournamentsAtom = atom<Tournament[]>([]);
export const searchStringAtom = atom('');
export const mapBoundsAtom = atom<LatLngBounds | null>(null);
export const syncVisibleAtom = atom(true);

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
  const mapBounds = get(mapBoundsAtom);
  const syncVisible = get(syncVisibleAtom);

  // When searching, we search all the tournament, regardless of the map display
  if (searchString !== '')
    return tournaments.filter((t) => t.town.includes(searchString.toUpperCase()))

  // If we not syncing to the map, return all tournaments
  if (mapBounds === null || !syncVisible) return tournaments;

  // Filter by those in the current map bounds
  return tournaments.filter(tournament => mapBounds.contains({ lat: tournament.coordinates[0], lng: tournament.coordinates[1]}))
})
