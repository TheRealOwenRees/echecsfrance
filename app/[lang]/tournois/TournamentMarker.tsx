"use client";

import { useEffect, useRef } from "react";
import { Tournament } from "@/types";
import L, { LatLngLiteral } from "leaflet";
import { Marker, Popup, MarkerProps } from "react-leaflet";
import { useTranslations } from "next-intl";
import { useAtomValue, useSetAtom } from "jotai";
import "leaflet.smooth_marker_bouncing";

import {
  debouncedHoveredListTournamentIdAtom,
  debouncedHoveredMapTournamentIdAtom,
} from "@/app/atoms";

const coordinateRandomisation = (lat: number, lng: number): LatLngLiteral => {
  const randomisation = () => Math.random() * (-0.01 - 0.01) + 0.01;
  return {
    lat: lat + randomisation(),
    lng: lng + randomisation(),
  };
};

type TournamentMarkerProps = {
  tournament: Tournament;
  colour: string;
} & Omit<MarkerProps, "position">;

export const TournamentMarker = ({
  tournament,
  colour,
  ...markerProps
}: TournamentMarkerProps) => {
  const t = useTranslations("Tournaments");
  const markerRef = useRef<L.Marker<any> | null>(null);
  const position = useRef(
    coordinateRandomisation(
      tournament.coordinates[0],
      tournament.coordinates[1]
    )
  );

  const hoveredListTournamentId = useAtomValue(
    debouncedHoveredListTournamentIdAtom
  );
  const setHoveredMapTournamentId = useSetAtom(
    debouncedHoveredMapTournamentIdAtom
  );

  useEffect(() => {
    if (!markerRef.current) return;
    if (hoveredListTournamentId === tournament._id) {
      // @ts-ignore (bounce comes from leaflet.smooth_marker_bouncing and isn't defined by the Typescript class)
      markerRef.current.bounce();
    } else {
      // @ts-ignore
      markerRef.current.stopBouncing();
    }
  }, [hoveredListTournamentId, tournament._id]);

  const iconOptions = new L.Icon({
    iconUrl: `/images/leaflet/marker-icon-2x-${colour}.png`,
    shadowUrl: "/images/leaflet/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Marker
      ref={markerRef}
      position={position.current}
      icon={iconOptions}
      eventHandlers={{
        mouseover: () => setHoveredMapTournamentId(tournament._id),
        mouseout: () => setHoveredMapTournamentId(null),
      }}
      {...markerProps}
    >
      <Popup>
        <p>
          {tournament.date}
          <br />
          <a href={tournament.url} target="_blank" rel="noopener noreferrer">
            {tournament.tournament}
          </a>
        </p>
        {t("approx")}
      </Popup>
    </Marker>
  );
};
