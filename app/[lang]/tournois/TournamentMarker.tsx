"use client";

import { forwardRef, useMemo, useImperativeHandle, useRef } from "react";
import { Tournament } from "@/types";
import L from "leaflet";
import { Marker, Popup, MarkerProps } from "react-leaflet";
import { useTranslations } from "next-intl";
import { useSetAtom } from "jotai";
import { FaTrophy } from "react-icons/fa";
import { last } from "lodash";

import type { BouncingMarker } from "@/leafletTypes";
import { debouncedHoveredMapTournamentGroupIdAtom } from "@/app/atoms";

export type TournamentMarkerRef = {
  getMarker: () => L.Marker<any>;
  bounce: () => void;
};

type TournamentMarkerProps = {
  tournamentGroup: Tournament[];
  colour: string;
} & Omit<MarkerProps, "position">;

export const TournamentMarker = forwardRef<
  TournamentMarkerRef,
  TournamentMarkerProps
>(({ tournamentGroup, colour, ...markerProps }, ref) => {
  const t = useTranslations("Tournaments");
  const markerRef = useRef<L.Marker<any> | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      getMarker: () => markerRef.current!,
      bounce: () => {
        const bouncingMarker = markerRef.current as BouncingMarker;
        bouncingMarker.setBouncingOptions({ contractHeight: 0 });
        bouncingMarker.bounce();
      },
    }),
    [],
  );

  const { date, latLng, groupId, timeControl } = tournamentGroup[0];

  const setHoveredMapTournamentGroupId = useSetAtom(
    debouncedHoveredMapTournamentGroupIdAtom,
  );

  const iconOptions = useMemo(
    () =>
      new L.Icon({
        iconUrl: `/images/leaflet/marker-icon-2x-${colour}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],

        timeControl,
      }),
    [colour, timeControl],
  );

  const startDate = date;
  const endDate = last(tournamentGroup)!.date;

  return (
    <Marker
      ref={markerRef}
      position={latLng}
      icon={iconOptions}
      eventHandlers={{
        mouseover: () => setHoveredMapTournamentGroupId(groupId),
        mouseout: () => setHoveredMapTournamentGroupId(null),
      }}
      {...markerProps}
    >
      <Popup maxWidth={10000}>
        <div className="flex max-w-[calc(100vw-80px)] flex-col gap-3 lg:max-w-[calc(100vw/2-80px)]">
          <b>
            {date}
            {endDate !== startDate && ` - ${endDate}`}
          </b>

          <div className="flex flex-col gap-0">
            {tournamentGroup.map((tournament) => (
              <a
                key={tournament.id}
                href={tournament.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tournament.tournament}
              </a>
            ))}
          </div>

          {tournamentGroup.some((t) => t.norm) && (
            <div className="flex items-center">
              <FaTrophy className="mr-3 h-4 w-4" />
              {t("norm")}
            </div>
          )}

          {t("approx")}
        </div>
      </Popup>
    </Marker>
  );
});

TournamentMarker.displayName = "TournamentMarker";
