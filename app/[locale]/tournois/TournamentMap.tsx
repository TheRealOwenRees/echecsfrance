"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import { useAtomValue, useSetAtom } from "jotai";
import L, { DomUtil, LatLngLiteral, Marker } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.smooth_marker_bouncing";
import "leaflet/dist/leaflet.css";
import { countBy, groupBy } from "lodash";
import { FaAngleDoubleDown } from "react-icons/fa";
import { LayerGroup, MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import MapEvents from "@/app/[locale]/components/MapEvents";
import {
  debouncedHoveredListTournamentIdAtom,
  filteredTournamentsByTimeControlAtom,
  mapBoundsAtom,
  normsOnlyAtom,
} from "@/app/atoms";
import { TimeControlColours } from "@/app/constants";
import { generatePieSVG } from "@/lib/pie";
import { TimeControl } from "@/types";

import Legend from "./Legend";
import TimeControlFilters from "./TimeControlFilters";
import { TournamentMarker, TournamentMarkerRef } from "./TournamentMarker";

// Declare a class type that adds in methods etc. defined by leaflet.smooth_marker_bouncing
// to keep Typescript happy
declare class BouncingMarker extends Marker {
  isBouncing(): boolean;
  bounce(): void;
  stopBouncing(): void;

  _icon: HTMLElement;
  _bouncingMotion?: {
    bouncingAnimationPlaying: boolean;
  };
}

const stopBouncingMarkers = () => {
  const markers =
    // @ts-ignore
    Marker.prototype._orchestration.getBouncingMarkers() as BouncingMarker[];

  markers.forEach((marker) => {
    if (marker.isBouncing()) {
      try {
        marker.stopBouncing();
        // The plugin keeps bouncing until the end of the animation.  We want to stop it immediately
        // An issue has been raised on the project (https://github.com/hosuaby/Leaflet.SmoothMarkerBouncing/issues/52), until then we have this hack.
        // We remove the class and reset some internal state

        DomUtil.removeClass(marker._icon, "bouncing");
        if (marker?._bouncingMotion?.bouncingAnimationPlaying === true)
          marker._bouncingMotion.bouncingAnimationPlaying = false;
      } catch {}
    }
  });
};

export default function TournamentMap() {
  const tournaments = useAtomValue(filteredTournamentsByTimeControlAtom);
  const normsOnly = useAtomValue(normsOnlyAtom);

  const setMapBounds = useSetAtom(mapBoundsAtom);
  const hoveredListTournamentId = useAtomValue(
    debouncedHoveredListTournamentIdAtom,
  );

  const markerRefs = useRef<Record<string, TournamentMarkerRef>>({});
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const expandedClusterMarkerRef = useRef<L.MarkerCluster | null>(null);

  const filteredTournaments = useMemo(
    () => tournaments.filter((t) => (normsOnly ? t.norm : true)),
    [normsOnly, tournaments],
  );

  const groupedTournaments = groupBy(filteredTournaments, (t) => t.groupId);

  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const onScrollToTable = () => {
    const tournamentTable = document.getElementById("tournament-table");
    tournamentTable?.scrollIntoView({ behavior: "smooth" });
  };

  const expandAndBounceIfNeeded = useCallback(() => {
    if (hoveredListTournamentId) {
      const tournament = filteredTournaments.find(
        (t) => t.id === hoveredListTournamentId,
      );

      if (tournament) {
        const markerRef = markerRefs.current[tournament.groupId];
        if (markerRef) {
          if (clusterRef.current) {
            const visibleMarker = clusterRef.current.getVisibleParent(
              markerRef.getMarker(),
            );
            if (!visibleMarker) return;

            // @ts-ignore
            if (visibleMarker.__proto__ === L.MarkerCluster.prototype) {
              // This is a cluster icon, we expand it.
              const clusterMarker = visibleMarker as L.MarkerCluster;

              if (
                expandedClusterMarkerRef.current &&
                expandedClusterMarkerRef.current !== clusterMarker
              ) {
                expandedClusterMarkerRef.current.unspiderfy();
              }

              clusterMarker.spiderfy();

              // Sometimes there marker that's still bouncing from the last time the group was expanded.
              // We stop it quickly.

              setTimeout(() => {
                stopBouncingMarkers();
              }, 50);
            } else {
              // This is a standard marker, we bounce it.
              const marker = visibleMarker as BouncingMarker;
              if (!marker.isBouncing()) {
                stopBouncingMarkers();

                markerRef.bounce();
              }
            }

            return true;
          }
        }
      }
    }

    stopBouncingMarkers();
    return false;
  }, [filteredTournaments, hoveredListTournamentId]);

  const onSpiderified = useCallback(
    (e: L.MarkerClusterSpiderfyEvent) => {
      // Once expanded, bounce the appropriate marker

      if (hoveredListTournamentId) {
        const tournament = filteredTournaments.find(
          (t) => t.id === hoveredListTournamentId,
        );
        if (!tournament) return;

        expandedClusterMarkerRef.current = e.cluster;
        const markerRef = markerRefs.current[tournament.groupId];

        if (markerRef && e.markers.includes(markerRef.getMarker())) {
          stopBouncingMarkers();
          markerRef.bounce();
        }
      }
    },
    [filteredTournaments, hoveredListTournamentId],
  );

  const onUnSpiderified = useCallback(
    (e: L.MarkerClusterSpiderfyEvent) => {
      if (expandedClusterMarkerRef.current === e.cluster)
        expandedClusterMarkerRef.current = null;

      // Once closed, we can expand the next group if needed
      expandAndBounceIfNeeded();
    },
    [expandAndBounceIfNeeded],
  );

  useEffect(() => {
    const ref = clusterRef.current;

    if (clusterRef.current) {
      clusterRef.current.on("spiderfied", onSpiderified);
      clusterRef.current.on("unspiderfied", onUnSpiderified);
    }

    return () => {
      if (ref) {
        ref.off("spiderfied", onSpiderified);
        ref.off("unspiderfied", onUnSpiderified);
      }
    };
  }, [onSpiderified, onUnSpiderified]);

  useEffect(() => {
    // Expand/contract as hoveredListTournamentId changes
    if (expandAndBounceIfNeeded()) return;

    if (expandedClusterMarkerRef.current)
      expandedClusterMarkerRef.current.unspiderfy();
  }, [expandAndBounceIfNeeded, hoveredListTournamentId]);

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

  const markers = useMemo(
    () =>
      Object.values(groupedTournaments).map((tournamentGroup) => {
        const { groupId } = tournamentGroup[0];
        return (
          <TournamentMarker
            ref={(ref) => {
              markerRefs.current[groupId] = ref!;
            }}
            key={groupId}
            tournamentGroup={tournamentGroup}
          />
        );
      }),
    [groupedTournaments],
  );

  return (
    <section id="tournament-map" className="flex h-content flex-col">
      <div className="p-3 lg:hidden">
        <TimeControlFilters />
      </div>

      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{
          flexGrow: 1,
        }}
        ref={(map) => {
          if (map) {
            setMapBounds(map.getBounds());
          }
        }}
      >
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Legend />
        <LayerGroup>
          <MarkerClusterGroup
            ref={clusterRef}
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={40}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom
          >
            {markers}
          </MarkerClusterGroup>
        </LayerGroup>
        $
      </MapContainer>

      <div className="flex items-center justify-center lg:hidden">
        <button
          className="p-3 text-primary-900 dark:text-white"
          onClick={onScrollToTable}
        >
          <FaAngleDoubleDown />
        </button>
      </div>
    </section>
  );
}
