"use client";

import { TimeControl } from "@/types";

import { useMemo, useRef } from "react";
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

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "@/css/marker-cluster.css";
import "leaflet-defaulticon-compatibility";
import "leaflet.smooth_marker_bouncing";

import {
  mapBoundsAtom,
  debouncedHoveredListTournamentIdAtom,
  tournamentsAtom,
  classicAtom,
  rapidAtom,
  blitzAtom,
  oneHourKOAtom,
} from "@/app/atoms";

import Legend from "./Legend";
import { TournamentMarker } from "./TournamentMarker";
import TimeControlFilters from "./TimeControlFilters";
import { useCallback, useEffect } from "react";

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
  const map = useMapEvent("moveend", () => {
    // Set the map bounds atoms when the user pans/zooms
    setMapBounds(map.getBounds());
  });

  return null;
};

type TimeControlGroupProps = {
  timeControl: TimeControl;
  colour: string;
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

const TimeControlGroup = ({ timeControl, colour }: TimeControlGroupProps) => {
  const tournaments = useAtomValue(tournamentsAtom);
  const markerRefs = useRef<Record<string, L.Marker<any> | null>>({});
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const expandedClusterMarkerRef = useRef<L.MarkerCluster | null>(null);

  const filteredTournaments = useMemo(
    () => tournaments.filter((t) => t.timeControl === timeControl),
    [timeControl, tournaments]
  );

  const hoveredListTournamentId = useAtomValue(
    debouncedHoveredListTournamentIdAtom
  );

  const expandAndBounceIfNeeded = useCallback(() => {
    if (hoveredListTournamentId) {
      const markerRef = markerRefs.current[hoveredListTournamentId];
      if (markerRef) {
        if (clusterRef.current) {
          const visibleMarker = clusterRef.current.getVisibleParent(markerRef);

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

              marker.bounce();
            }
          }

          return true;
        }
      }
    }

    return false;
  }, [hoveredListTournamentId]);

  const onSpiderified = useCallback(
    (e: L.MarkerClusterSpiderfyEvent) => {
      // Once expanded, bounce the appropriate marker

      if (hoveredListTournamentId) {
        expandedClusterMarkerRef.current = e.cluster;
        const markerRef = markerRefs.current[
          hoveredListTournamentId
        ] as BouncingMarker;

        if (markerRef && e.markers.includes(markerRef)) {
          stopBouncingMarkers();
          markerRef.bounce();
        }
      }
    },
    [hoveredListTournamentId]
  );

  const onUnSpiderified = useCallback(
    (e: L.MarkerClusterSpiderfyEvent) => {
      if (expandedClusterMarkerRef.current === e.cluster)
        expandedClusterMarkerRef.current = null;

      // Once closed, we can expand the next group if needed
      expandAndBounceIfNeeded();
    },
    [expandAndBounceIfNeeded]
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

  const createClusterCustomIcon = useCallback(
    (cluster: any) => {
      let childCount = cluster.getChildCount();

      return new L.DivIcon({
        html: "<div><span>" + childCount + "</span></div>",
        className: `marker-cluster marker-cluster-${timeControl}`,
        iconSize: new L.Point(40, 40),
      });
    },
    [timeControl]
  );

  const markers = filteredTournaments.map((tournament) => {
    return (
      <TournamentMarker
        ref={(ref) => (markerRefs.current[tournament._id] = ref)}
        key={tournament._id}
        tournament={tournament}
        colour={colour}
      />
    );
  });

  const group = useMemo(
    () => (
      <LayerGroup>
        <MarkerClusterGroup
          ref={clusterRef}
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {markers}
        </MarkerClusterGroup>
      </LayerGroup>
    ),
    [createClusterCustomIcon, markers]
  );

  return group;
};

export default function TournamentMap() {
  const setMapBounds = useSetAtom(mapBoundsAtom);
  const hoveredListTournamentId = useAtomValue(
    debouncedHoveredListTournamentIdAtom
  );

  const classic = useAtomValue(classicAtom);
  const rapid = useAtomValue(rapidAtom);
  const blitz = useAtomValue(blitzAtom);
  const other = useAtomValue(oneHourKOAtom);

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

  return (
    <section id="tournament-map" className="flex h-screen flex-col pb-[144px]">
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

        {classic && (
          <TimeControlGroup timeControl={TimeControl.Classic} colour="green" />
        )}
        {rapid && (
          <TimeControlGroup timeControl={TimeControl.Rapid} colour="blue" />
        )}
        {blitz && (
          <TimeControlGroup timeControl={TimeControl.Blitz} colour="yellow" />
        )}
        {other && (
          <TimeControlGroup timeControl={TimeControl.KO} colour="red" />
        )}
      </MapContainer>

      <div className="flex items-center justify-center lg:hidden">
        <button
          className="p-3 text-teal-900 dark:text-white"
          onClick={onScrollToTable}
        >
          <FaAngleDoubleDown />
        </button>
      </div>
    </section>
  );
}
