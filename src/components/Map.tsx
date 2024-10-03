"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import React from "react";

import { useAtomValue, useSetAtom } from "jotai";
import L, { BouncingMarker, DomUtil, LatLngLiteral, Marker } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.smooth_marker_bouncing";
import "leaflet/dist/leaflet.css";
import { FaAngleDoubleDown } from "react-icons/fa";
import { LayerGroup, MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { debouncedHoveredListIdAtom, mapBoundsAtom } from "@/atoms";
import { MapEvents } from "@/components/MapEvents";

import { Button } from "./Button";

export type MarkerRef = {
  getMarker: () => L.Marker<any>;
  bounce: () => void;
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

export type MapMarker = {
  markerId: string;
  tableIds: string[];
  component: React.ReactElement;
};

type MapProps = {
  filters?: React.ReactNode;
  legend?: React.ReactNode;
  markers: MapMarker[];
  iconCreateFunction?: L.MarkerClusterGroupOptions["iconCreateFunction"];
};

export const Map = ({
  filters,
  legend,
  markers: markers,
  iconCreateFunction,
}: MapProps) => {
  const setMapBounds = useSetAtom(mapBoundsAtom);

  const hoveredListTournamentId = useAtomValue(debouncedHoveredListIdAtom);

  const markerRefs = useRef<Record<string, MarkerRef>>({});
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const expandedClusterMarkerRef = useRef<L.MarkerCluster | null>(null);

  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const onScrollToTable = () => {
    const tournamentTable = document.getElementById("listing");
    tournamentTable?.scrollIntoView({ behavior: "smooth" });
  };

  const expandAndBounceIfNeeded = useCallback(() => {
    if (hoveredListTournamentId) {
      const marker = markers.find((m) =>
        m.tableIds.includes(hoveredListTournamentId),
      );

      if (marker) {
        const markerRef = markerRefs.current[marker.markerId];
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
  }, [markers, hoveredListTournamentId]);

  const onSpiderified = useCallback(
    (e: L.MarkerClusterSpiderfyEvent) => {
      // Once expanded, bounce the appropriate marker

      if (hoveredListTournamentId) {
        const marker = markers.find((m) =>
          m.tableIds.includes(hoveredListTournamentId),
        );
        if (!marker) return;

        expandedClusterMarkerRef.current = e.cluster;
        const markerRef = markerRefs.current[marker.markerId];

        if (markerRef && e.markers.includes(markerRef.getMarker())) {
          stopBouncingMarkers();
          markerRef.bounce();
        }
      }
    },
    [markers, hoveredListTournamentId],
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

  const referencedMarkers = useMemo(
    () =>
      markers.map((marker) =>
        React.cloneElement(marker.component, {
          ref: (ref: MarkerRef) => {
            markerRefs.current[marker.markerId] = ref;
          },
        }),
      ),
    [markers],
  );

  return (
    <section id="tournament-map" className="flex h-content flex-col">
      {filters && <div className="p-3 lg:hidden">{filters}</div>}

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
        <MapEvents updateMapBoundsAtom />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {legend}
        <LayerGroup>
          <MarkerClusterGroup
            ref={clusterRef}
            chunkedLoading
            iconCreateFunction={iconCreateFunction}
            maxClusterRadius={40}
            showCoverageOnHover={false}
            spiderfyOnMaxZoom
          >
            {referencedMarkers}
          </MarkerClusterGroup>
        </LayerGroup>
      </MapContainer>

      <div className="flex items-center justify-center lg:hidden">
        <Button
          intent="tertiary"
          size="compacted"
          className="p-3"
          onClick={onScrollToTable}
        >
          <FaAngleDoubleDown />
        </Button>
      </div>
    </section>
  );
};
