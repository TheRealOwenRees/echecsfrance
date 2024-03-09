"use client";

import { useCallback, useMemo } from "react";

import { useAtomValue } from "jotai";
import L, { LatLngLiteral } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.smooth_marker_bouncing";
import "leaflet/dist/leaflet.css";
import { countBy, groupBy } from "lodash";

import { clubsAtom } from "@/atoms";
import { Map, MapMarker } from "@/components/Map";

import { ClubMarker } from "./ClubMarker";

const ClubMap = () => {
  const clubs = useAtomValue(clubsAtom);

  const markers: MapMarker[] = useMemo(
    () =>
      clubs.map((club) => {
        return {
          markerId: club.id,
          tableIds: [club.id],
          component: <ClubMarker key={club.id} club={club} />,
        };
      }),
    [clubs],
  );

  return <Map markers={markers} />;
};

export default ClubMap;
