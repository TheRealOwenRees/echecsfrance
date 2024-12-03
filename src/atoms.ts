import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import {
  endOfDay,
  isAfter,
  isBefore,
  parse,
  setDefaultOptions,
  startOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { FeatureCollection } from "geojson";
import { atom } from "jotai";
import { LatLngBounds } from "leaflet";

import { Club, TimeControl, Tournament } from "@/types";
import atomWithDebounce from "@/utils/atomWithDebounce";
import { normalizedContains } from "@/utils/string";

setDefaultOptions({ locale: fr });

type RegionFilter =
  | "all"
  | "map"
  | {
      id: string;
      name: string;
      features: FeatureCollection;
    };

export const burgerMenuIsOpenAtom = atom(false);
export const mapBoundsAtom = atom<LatLngBounds | null>(null);
export const regionFilterAtom = atom<RegionFilter>("map");
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

export const filteredTournamentsByTimeControlAndZoneAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);
  const regionFilter = get(regionFilterAtom);

  const classic = get(classicAtom);
  const rapid = get(rapidAtom);
  const blitz = get(blitzAtom);
  const other = get(otherAtom);

  const dateRange = get(dateRangeAtom);
  const { startDate, endDate } = dateRange[0];

  const filterByTimeControl = tournaments.filter((tournament) => {
    const tournamentDate = startOfDay(
      parse(tournament.date, "dd/MM/yyyy", new Date()),
    );

    return (
      !isBefore(tournamentDate, startDate) &&
      (endDate === undefined || !isAfter(tournamentDate, endDate)) &&
      !tournament.pending &&
      tournament.status === "scheduled" &&
      ((tournament.timeControl === TimeControl.Classic && classic) ||
        (tournament.timeControl === TimeControl.Rapid && rapid) ||
        (tournament.timeControl === TimeControl.Blitz && blitz) ||
        (tournament.timeControl === TimeControl.Other && other))
    );
  });

  if (regionFilter === "all" || regionFilter === "map")
    return filterByTimeControl;

  return filterByTimeControl.filter((tournament) => {
    return regionFilter.features?.features?.some(
      (feature) =>
        feature.geometry.type === "Polygon" &&
        booleanPointInPolygon(
          [tournament.latLng.lng, tournament.latLng.lat],
          feature.geometry,
        ),
    );
  });
});

export const filteredTournamentsListAtom = atom((get) => {
  const tournaments = get(filteredTournamentsByTimeControlAndZoneAtom);
  const mapBounds = get(mapBoundsAtom);
  const regionFilter = get(regionFilterAtom);
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
  if (mapBounds === null || regionFilter !== "map") return filteredByNorm;

  // Filter by the map bounds
  return filteredByNorm.filter((tournament) =>
    mapBounds.contains(tournament.latLng),
  );
});

export const filteredClubsByZoneAtom = atom((get) => {
  const clubs = get(clubsAtom);
  const regionFilter = get(regionFilterAtom);

  if (regionFilter === "all" || regionFilter === "map") return clubs;

  return clubs.filter((club) => {
    return regionFilter.features?.features?.some(
      (feature) =>
        feature.geometry.type === "Polygon" &&
        booleanPointInPolygon(
          [club.latLng.lng, club.latLng.lat],
          feature.geometry,
        ),
    );
  });
});

export const filteredClubsListAtom = atom((get) => {
  const filteredByZone = get(filteredClubsByZoneAtom);
  const mapBounds = get(mapBoundsAtom);
  const regionFilter = get(regionFilterAtom);
  const searchString = get(searchStringAtom).trim();

  // When searching, we search all the tournament, regardless of the map display
  if (searchString !== "") {
    return filteredByZone.filter(
      (club) =>
        normalizedContains(club.name, searchString) ||
        (club.address && normalizedContains(club.address, searchString)),
    );
  }

  // If we not syncing to the map, return all clubs
  if (mapBounds === null || regionFilter !== "map") return filteredByZone;

  // Filter by the map bounds
  return filteredByZone.filter((club) => mapBounds.contains(club.latLng));
});

// Date picker atoms
export const datePickerIsOpenAtom = atom(false);

export const maxDateAtom = atom((get) => {
  const tournaments = get(tournamentsAtom);
  const dateTimestamps = tournaments.map((t) =>
    endOfDay(parse(t.date, "dd/MM/yyyy", new Date())).getTime(),
  );

  return new Date(Math.max(...dateTimestamps));
});

export const dateRangeAtom = atom<any>([
  {
    startDate: new Date(),
    endDate: undefined,
    key: "selection",
  },
]);
