"use client";

import { useCallback, useMemo } from "react";

import { useAtomValue } from "jotai";
import L, { LatLngLiteral } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.smooth_marker_bouncing";
import "leaflet/dist/leaflet.css";
import { countBy, groupBy } from "lodash";

import {
  filteredTournamentsByTimeControlAndZoneAtom,
  normsOnlyAtom,
} from "@/atoms";
import { Map, MapMarker } from "@/components/Map";
import { TimeControlColours } from "@/constants";
import { TimeControl } from "@/types";
import { generatePieSVG } from "@/utils/pie";

import Legend from "./Legend";
import TimeControlFilters from "./TimeControlFilters";
import { TournamentMarker } from "./TournamentMarker";

const TournamentMap = () => {
  const tournaments = useAtomValue(filteredTournamentsByTimeControlAndZoneAtom);
  const normsOnly = useAtomValue(normsOnlyAtom);

  const filteredTournaments = useMemo(
    () => tournaments.filter((t) => (normsOnly ? t.norm : true)),
    [normsOnly, tournaments],
  );

  const groupedTournaments = groupBy(filteredTournaments, (t) => t.groupId);

  const createClusterCustomIcon = useCallback((cluster: any) => {
    const childCount = cluster.getChildCount();
    const children = cluster.getAllChildMarkers();

    // We added the time control as the class name when creating the marker
    const timeControlCounts = countBy(
      children,
      (child: any) => child.options.icon.options.className,
    );

    const html = `
      <div>
        ${generatePieSVG(
          "absolute w-[30px]",
          15,
          [
            TimeControl.Classic,
            TimeControl.Rapid,
            TimeControl.Blitz,
            TimeControl.Other,
          ].map((tc) => ({
            value: timeControlCounts[tc] ?? 0,
            colour: TimeControlColours[tc],
          })),
        )}
        <span class="text-white font-semibold relative z-[300]">${childCount}</span>
      </div>
    `;

    return new L.DivIcon({
      html,
      className: "marker-cluster bg-gray-600/20",
      iconSize: new L.Point(40, 40),
    });
  }, []);

  const markers: MapMarker[] = useMemo(
    () =>
      Object.values(groupedTournaments).map((tournamentGroup) => {
        const { groupId } = tournamentGroup[0];
        return {
          markerId: groupId,
          tableIds: tournamentGroup.map((t) => t.id),
          component: (
            <TournamentMarker key={groupId} tournamentGroup={tournamentGroup} />
          ),
        };
      }),
    [groupedTournaments],
  );

  return (
    <Map
      markers={markers}
      legend={<Legend />}
      filters={<TimeControlFilters />}
      iconCreateFunction={createClusterCustomIcon}
    />
  );
};

export default TournamentMap;
