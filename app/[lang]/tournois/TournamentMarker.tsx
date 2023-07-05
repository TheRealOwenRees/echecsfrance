"use client";

import { useEffect, useMemo, useRef } from "react";
import { Tournament } from "@/types";
import L, { LatLngLiteral, DomUtil } from "leaflet";
import { Marker, Popup, MarkerProps } from "react-leaflet";
import { useTranslations } from "next-intl";
import { useAtomValue, useSetAtom } from "jotai";
import "leaflet.smooth_marker_bouncing";

import {
  debouncedHoveredListTournamentIdAtom,
  debouncedHoveredMapTournamentIdAtom,
} from "@/app/atoms";

const coordinateRandomisation = (latLng: LatLngLiteral): LatLngLiteral => {
  const randomisation = () => Math.random() * (-0.01 - 0.01) + 0.01;
  return {
    lat: latLng.lat + randomisation(),
    lng: latLng.lng + randomisation(),
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
  const position = useRef(coordinateRandomisation(tournament.latLng));

  const hoveredListTournamentId = useAtomValue(
    debouncedHoveredListTournamentIdAtom
  );
  const setHoveredMapTournamentId = useSetAtom(
    debouncedHoveredMapTournamentIdAtom
  );

  useEffect(() => {
    if (!markerRef.current) return;
    if (hoveredListTournamentId === tournament._id) {
      // @ts-ignore (the various bounce commands come from leaflet.smooth_marker_bouncing and aren't defined by the Typescript definitions)
      markerRef.current.setBouncingOptions({ exclusive: true });

      // @ts-ignore
      markerRef.current.bounce();
    } else {
      // @ts-ignore
      if (markerRef.current.isBouncing()) {
        // @ts-ignore
        markerRef.current.stopBouncing();

        // The plugin keeps bouncing until the end of the animation.  We want to stop it immediately
        // An issue has been raised on the project (https://github.com/hosuaby/Leaflet.SmoothMarkerBouncing/issues/52), until then we have this hack.
        // We remove the class and reset some internal state
        // @ts-ignore
        DomUtil.removeClass(markerRef.current._icon, "bouncing");

        if (
          // @ts-ignore
          markerRef.current?._bouncingMotion?.bouncingAnimationPlaying === true
        )
          // @ts-ignore
          markerRef.current._bouncingMotion.bouncingAnimationPlaying = false;
      }
    }
  }, [hoveredListTournamentId, tournament._id]);

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
