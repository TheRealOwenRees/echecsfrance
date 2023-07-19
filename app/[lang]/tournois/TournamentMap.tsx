"use client";

import { TimeControl } from "@/types";

import { useMemo, useRef, useCallback, useEffect } from "react";
import L, { LatLngLiteral, Marker, DomUtil } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  MapContainer,
  TileLayer,
  LayerGroup,
  useMapEvent,
} from "react-leaflet";
import { FaAngleDoubleDown } from "react-icons/fa";
import { useAtomValue, useSetAtom } from "jotai";
import { countBy, groupBy } from "lodash";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet.smooth_marker_bouncing";

import {
  mapBoundsAtom,
  debouncedHoveredListTournamentIdAtom,
  filteredTournamentsByTimeControlAtom,
  normsOnlyAtom,
} from "@/app/atoms";
import { generatePieSVG } from "@/lib/pie";
import { TimeControlColours } from "@/app/constants";

import Legend from "./Legend";
import { TournamentMarker, TournamentMarkerRef } from "./TournamentMarker";
import TimeControlFilters from "./TimeControlFilters";

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

const MapEvents = () => {
  const setMapBounds = useSetAtom(mapBoundsAtom);

  const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
  const franceBounds = L.latLngBounds(
    L.latLng(42.08, -5.12),
    L.latLng(51.17, 9.53),
  );

  const map = useMapEvent("moveend", () => {
    // Set the map bounds atoms when the user pans/zooms
    setMapBounds(map.getBounds());
  });

  // viewport agnostic centering of France & max world bounds
  useEffect(() => {
    map.setView(franceBounds.getCenter(), map.getBoundsZoom(franceBounds));
    map.setMaxBounds(worldBounds);
    map.options.maxBoundsViscosity = 1.0; // Prevents going past bounds while dragging
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

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

  useEffect(() => {
    if (hoveredListTournamentId === null) {
      stopBouncingMarkers();
    }
  }, [hoveredListTournamentId]);

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
      if (!tournament) return false;

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
        const { groupId, timeControl } = tournamentGroup[0];

        const colours = {
          [TimeControl.Classic]: "green",
          [TimeControl.Rapid]: "blue",
          [TimeControl.Blitz]: "yellow",
          [TimeControl.Other]: "red",
        };

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
