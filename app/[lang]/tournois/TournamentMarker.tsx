"use client";

import { forwardRef, useMemo, useRef } from "react";
import { TimeControl, Tournament } from "@/types";
import L from "leaflet";
import { Marker, Popup, MarkerProps } from "react-leaflet";
import { useTranslations } from "next-intl";
import { useSetAtom } from "jotai";
import { FaTrophy } from "react-icons/fa";
import { last } from "lodash";

import { debouncedHoveredMapTournamentGroupIdAtom } from "@/app/atoms";

type TournamentMarkerProps = {
  tournamentGroup: Tournament[];
  colour: string;
} & Omit<MarkerProps, "position">;

export const TournamentMarker = forwardRef<
  L.Marker<any> | null,
  TournamentMarkerProps
>(({ tournamentGroup, colour, ...markerProps }, ref) => {
  const t = useTranslations("Tournaments");

  const baseTournament = tournamentGroup[0];

  // We add shifts based on the time control, so that they don't hide each other
  const position = useRef({
    lat: baseTournament.latLng.lat,
    lng:
      baseTournament.latLng.lng +
      (baseTournament.timeControl === TimeControl.Rapid
        ? -0.01
        : baseTournament.timeControl === TimeControl.Blitz
        ? 0.01
        : baseTournament.timeControl === TimeControl.Other
        ? 0.02
        : 0),
  });

  const setHoveredMapTournamentGroupId = useSetAtom(
    debouncedHoveredMapTournamentGroupIdAtom,
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
    [colour],
  );

  const startDate = baseTournament.date;
  const endDate = last(tournamentGroup)!.date;

  return (
    <Marker
      ref={ref}
      position={position.current}
      icon={iconOptions}
      eventHandlers={{
        mouseover: () =>
          setHoveredMapTournamentGroupId(
            `${baseTournament.groupId}_${baseTournament.timeControl}`,
          ),
        mouseout: () => setHoveredMapTournamentGroupId(null),
      }}
      {...markerProps}
    >
      <Popup maxWidth={10000}>
        <div className="flex max-w-[calc(100vw-80px)] flex-col gap-3 lg:max-w-[calc(100vw/2-80px)]">
          <b>
            {baseTournament.date}
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
