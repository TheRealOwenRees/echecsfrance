import { TimeControl, Tournament } from '@/types';
import { atom } from 'jotai';
import { LatLngBounds } from 'leaflet';

import atomWithDebounce from "@/utils/atomWithDebounce";

export const tournamentsAtom = atom<Tournament[]>([]);
export const mapBoundsAtom = atom<LatLngBounds | null>(null);
export const syncVisibleAtom = atom(true);

export const searchStringAtom = atom('');
export const classicAtom = atom(true);
export const rapidAtom = atom(true);
export const blitzAtom = atom(true);
export const otherAtom = atom(true);

export const {
  currentValueAtom: hoveredMapTournamentIdAtom,
  debouncedValueAtom: debouncedHoveredMapTournamentIdAtom,
} = atomWithDebounce<string | null>(null);

export const {
  debouncedValueAtom: debouncedHoveredListTournamentIdAtom,
} = atomWithDebounce<string | null>(null, 300, true);

export const filteredTournamentsByTimeControlAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);

  const classic = get(classicAtom);
  const rapid = get(rapidAtom);
  const blitz = get(blitzAtom);
  const other = get(otherAtom);

  return tournaments.filter(tournament =>
    (tournament.timeControl === TimeControl.Classic && classic) ||
    (tournament.timeControl === TimeControl.Rapid && rapid) ||
    (tournament.timeControl === TimeControl.Blitz && blitz) ||
    (tournament.timeControl === TimeControl.Other && other));
});

export const filteredTournamentsListAtom = atom((get) => {
  const tournaments = get(filteredTournamentsByTimeControlAtom);
  const mapBounds = get(mapBoundsAtom);
  const syncVisible = get(syncVisibleAtom);

  const searchString = get(searchStringAtom).trim();


  // When searching, we search all the tournament, regardless of the map display
  if (searchString !== '')
    return tournaments.filter((t) => t.town.includes(searchString.toUpperCase()))

  // If we not syncing to the map, return all tournaments
  if (mapBounds === null || !syncVisible) return tournaments;

  // Filter by those in the current map bounds
  return tournaments.filter(tournament => mapBounds.contains(tournament.latLng))
})
