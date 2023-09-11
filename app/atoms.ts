import { atom } from "jotai";
import { LatLngBounds, LatLngLiteral } from "leaflet";

import { TimeControl, Tournament } from "@/types";
import atomWithDebounce from "@/utils/atomWithDebounce";
import { normalizedContains } from "@/utils/string";

export const tournamentsAtom = atom<Tournament[]>([]);
export const mapBoundsAtom = atom<LatLngBounds | null>(null);
export const syncVisibleAtom = atom(true);
export const normsOnlyAtom = atom(false);

export const searchStringAtom = atom("");
export const classicAtom = atom(true);
export const rapidAtom = atom(true);
export const blitzAtom = atom(true);
export const otherAtom = atom(true);

export const franceCenterAtom = atom<LatLngLiteral>({
  lat: 47.0844,
  lng: 2.3964,
});

export const {
  currentValueAtom: hoveredMapTournamentGroupIdAtom,
  debouncedValueAtom: debouncedHoveredMapTournamentGroupIdAtom,
} = atomWithDebounce<string | null>(null);

export const { debouncedValueAtom: debouncedHoveredListTournamentIdAtom } =
  atomWithDebounce<string | null>(null, 1000, 100);

export const filteredTournamentsByTimeControlAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);

  const classic = get(classicAtom);
  const rapid = get(rapidAtom);
  const blitz = get(blitzAtom);
  const other = get(otherAtom);

  return tournaments.filter(
    (tournament) =>
      !tournament.pending &&
      ((tournament.timeControl === TimeControl.Classic && classic) ||
        (tournament.timeControl === TimeControl.Rapid && rapid) ||
        (tournament.timeControl === TimeControl.Blitz && blitz) ||
        (tournament.timeControl === TimeControl.Other && other)),
  );
});

export const filteredTournamentsListAtom = atom((get) => {
  const tournaments = get(filteredTournamentsByTimeControlAtom);
  const mapBounds = get(mapBoundsAtom);
  const syncVisible = get(syncVisibleAtom);
  const normsOnly = get(normsOnlyAtom);
  const searchString = get(searchStringAtom).trim();

  const filteredByNorm = normsOnly
    ? tournaments.filter((t) => t.norm)
    : tournaments;

  // When searching, we search all the tournament, regardless of the map display
  if (searchString !== "") {
    return filteredByNorm.filter(
      (t) =>
        normalizedContains(t.town, searchString) ||
        normalizedContains(t.tournament, searchString),
    );
  }

  // If we not syncing to the map, return all tournaments
  if (mapBounds === null || !syncVisible) return filteredByNorm;

  // Filter by those in the current map bounds
  return filteredByNorm.filter((tournament) =>
    mapBounds.contains(tournament.latLng),
  );
});
