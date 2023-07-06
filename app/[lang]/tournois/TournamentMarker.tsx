"use client";

import { forwardRef, useMemo, useRef } from "react";
import { TimeControl, Tournament } from "@/types";
import L from "leaflet";
import { Marker, Popup, MarkerProps } from "react-leaflet";
import { useTranslations } from "next-intl";
import { useSetAtom } from "jotai";

import { debouncedHoveredMapTournamentIdAtom } from "@/app/atoms";

type TournamentMarkerProps = {
  tournament: Tournament;
  colour: string;
} & Omit<MarkerProps, "position">;

export const TournamentMarker = forwardRef<
  L.Marker<any> | null,
  TournamentMarkerProps
>(({ tournament, colour, ...markerProps }, ref) => {
  const t = useTranslations("Tournaments");

  // We add shifts based on the time control, so that they don't hide each other
  const position = useRef({
    lat: tournament.latLng.lat,
    lng:
      tournament.latLng.lng +
      (tournament.timeControl === TimeControl.Rapid
        ? -0.01
        : tournament.timeControl === TimeControl.Blitz
        ? 0.01
        : tournament.timeControl === TimeControl.KO
        ? 0.02
        : 0),
  });

  const setHoveredMapTournamentId = useSetAtom(
    debouncedHoveredMapTournamentIdAtom
  );

  const iconOptions = useMemo(
    () =>
      new L.Icon({
        iconUrl: `/images/leaflet/marker-icon-2x-${colour}.png`,
        shadowUrl: "/images/leaflet/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    [colour]
  );

  return (
    <Marker
      ref={ref}
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
});

TournamentMarker.displayName = "TournamentMarker";
