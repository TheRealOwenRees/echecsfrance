"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

import { useSetAtom } from "jotai";
import L from "leaflet";
import { Marker, MarkerProps, Popup } from "react-leaflet";

import { debouncedHoveredMapIdAtom } from "@/atoms";
import type { MarkerRef } from "@/components/Map";
import { TimeControlColours } from "@/constants";
import type { BouncingMarker } from "@/leafletTypes";
import { Club } from "@/types";

type ClubMarkerProps = {
  club: Club;
} & Omit<MarkerProps, "position">;

export const ClubMarker = forwardRef<MarkerRef, ClubMarkerProps>(
  ({ club, ...markerProps }, ref) => {
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

    const { id, latLng } = club;

    const setHoveredMapId = useSetAtom(debouncedHoveredMapIdAtom);

    const iconOptions = useMemo(
      () =>
        new L.DivIcon({
          html: `
          <svg x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
            <g><circle fill="#FFFFFF" cx="182" cy="180" r="70" /></g>
            <g><path stroke="#666666" stroke-width="10" fill="${TimeControlColours.Classic}" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9 C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/></g>
          </svg>
        `,
          className: "",
          iconSize: [24, 40],
          iconAnchor: [12, 40],
          popupAnchor: [1, -40],
        }),
      [],
    );

    return (
      <Marker
        ref={markerRef}
        position={latLng}
        icon={iconOptions}
        eventHandlers={{
          mouseover: () => setHoveredMapId(id),
          mouseout: () => setHoveredMapId(null),
        }}
        {...markerProps}
      >
        <Popup maxWidth={10000}>
          <div className="flex max-w-[calc(100vw-80px)] flex-col gap-3 lg:max-w-[calc(100vw/2-80px)]">
            <div className="flex flex-col gap-0">
              <div>{club.name}</div>
              {club.address && <div>{club.address}</div>}
              {club.website && (
                <div>
                  <a
                    href={club.website}
                    className="text-primary hover:text-primary-800"
                    target="_blank"
                  >
                    {club.website}
                  </a>
                </div>
              )}
              {club.url && (
                <div>
                  <a
                    href={club.url}
                    className="text-primary hover:text-primary-800"
                    target="_blank"
                  >
                    {club.url}
                  </a>
                </div>
              )}
              {club.email && (
                <div>
                  <a
                    href={`mailto:${club.email}`}
                    className="text-primary hover:text-primary-800"
                  >
                    {club.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  },
);

ClubMarker.displayName = "ClubMarker";
