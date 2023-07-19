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
import { TimeControlColours } from "@/app/constants";

export type TournamentMarkerRef = {
  getMarker: () => L.Marker<any>;
  bounce: () => void;
};

type TournamentMarkerProps = {
  tournamentGroup: Tournament[];
} & Omit<MarkerProps, "position">;

export const TournamentMarker = forwardRef<
  TournamentMarkerRef,
  TournamentMarkerProps
>(({ tournamentGroup, ...markerProps }, ref) => {
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
      new L.DivIcon({
        html: `
          <svg x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
            <g><path stroke="#666666" stroke-width="10" fill="${TimeControlColours[timeControl]}" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9 C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/></g>
          </svg>
        `,
        className: timeControl,
        iconSize: [24, 40],
        iconAnchor: [12, 40],
        popupAnchor: [1, -40],
      }),
    [timeControl],
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
