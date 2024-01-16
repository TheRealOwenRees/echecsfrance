import { formatISO, setDefaultOptions } from "date-fns";
import { fr } from "date-fns/locale";
import { atom } from "jotai";
import { LatLngBounds } from "leaflet";

import { Club, TimeControl, Tournament } from "@/types";
import atomWithDebounce from "@/utils/atomWithDebounce";
import { normalizedContains } from "@/utils/string";

setDefaultOptions({ locale: fr });

export const burgerMenuIsOpenAtom = atom(false);
export const mapBoundsAtom = atom<LatLngBounds | null>(null);
export const syncVisibleAtom = atom(true);
export const searchStringAtom = atom("");

export const tournamentsAtom = atom<Tournament[]>([]);
export const normsOnlyAtom = atom(false);

export const classicAtom = atom(true);
export const rapidAtom = atom(true);
export const blitzAtom = atom(true);
export const otherAtom = atom(true);

export const clubsAtom = atom<Club[]>([]);

export const {
  currentValueAtom: hoveredMapIdAtom,
  debouncedValueAtom: debouncedHoveredMapIdAtom,
} = atomWithDebounce<string | null>(null);

export const { debouncedValueAtom: debouncedHoveredListIdAtom } =
  atomWithDebounce<string | null>(null, 1000, 100);

export const filteredTournamentsByTimeControlAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);

  const classic = get(classicAtom);
  const rapid = get(rapidAtom);
  const blitz = get(blitzAtom);
  const other = get(otherAtom);

  const dateRange = get(dateRangeAtom);
  const startDate = formatISO(dateRange[0].startDate);
  const endDate =
    dateRange[0].endDate !== undefined
      ? formatISO(dateRange[0].endDate)
      : undefined;

  return tournaments.filter(
    (tournament) =>
      tournament.isoDate >= startDate &&
      (endDate === undefined || tournament.isoDate <= endDate) &&
      !tournament.pending &&
      tournament.status === "scheduled" &&
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

export const filteredClubsListAtom = atom((get) => {
  const clubs = get(clubsAtom);
  const mapBounds = get(mapBoundsAtom);
  const syncVisible = get(syncVisibleAtom);
  const searchString = get(searchStringAtom).trim();

  // When searching, we search all the tournament, regardless of the map display
  if (searchString !== "") {
    return clubs.filter(
      (club) =>
        normalizedContains(club.name, searchString) ||
        (club.address && normalizedContains(club.address, searchString)),
    );
  }

  // If we not syncing to the map, return all clubs
  if (mapBounds === null || !syncVisible) return clubs;

  // Filter by those in the current map bounds
  return clubs.filter((club) => mapBounds.contains(club.latLng));
});

// Date picker atoms
export const datePickerIsOpenAtom = atom(false);

export const maxDateAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);
  const dateTimestamps = tournaments.map((t) => new Date(t.isoDate).getTime());
  return new Date(Math.max(...dateTimestamps));
});

export const dateRangeAtom = atom<any>([
  {
    startDate: new Date(),
    endDate: undefined,
    key: "selection",
  },
]);
