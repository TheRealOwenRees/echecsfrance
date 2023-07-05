"use client";

import { TimeControl, Tournament } from "@/types";
import { LatLngLiteral } from "leaflet";
import {
  MapContainer,
  TileLayer,
  LayerGroup,
  useMapEvent,
} from "react-leaflet";
import { useAtomValue, useSetAtom } from "jotai";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import {
  filteredTournamentsByTimeControlAtom,
  mapBoundsAtom,
} from "@/app/atoms";

import Legend from "./Legend";
import { TournamentMarker } from "./TournamentMarker";
import TimeControlFilters from "./TimeControlFilters";

const MapEvents = () => {
  const setMapBounds = useSetAtom(mapBoundsAtom);
  const map = useMapEvent("moveend", () => {
    setMapBounds(map.getBounds());
  });

  return null;
};

export default function TournamentMap() {
  const tournaments = useAtomValue(filteredTournamentsByTimeControlAtom);
  const setMapBounds = useSetAtom(mapBoundsAtom);
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const createLayerGroups = (
    timeControl: TimeControl,
    colour: string,
    tournaments: Tournament[]
  ) => {
    const filteredTournaments = tournaments.filter(
      (t) => t.timeControl === timeControl
    );

    const layerGroup = filteredTournaments.map((tournament) => {
      return (
        <TournamentMarker
          key={tournament._id}
          tournament={tournament}
          colour={colour}
        />
      );
    });

    return <LayerGroup>{layerGroup}</LayerGroup>;
  };

  const classicalMarkers = createLayerGroups(
    TimeControl.Classic,
    "green",
    tournaments
  );
  const rapidMarkers = createLayerGroups(
    TimeControl.Rapid,
    "blue",
    tournaments
  );
  const blitzMarkers = createLayerGroups(
    TimeControl.Blitz,
    "yellow",
    tournaments
  );
  const otherMarkers = createLayerGroups(TimeControl.KO, "red", tournaments);

  return (
    <section
      id="tournament-map"
      className="flex h-[calc(100vh-144px)] flex-col"
    >
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

        {classicalMarkers}
        {rapidMarkers}
        {blitzMarkers}
        {otherMarkers}
      </MapContainer>
    </section>
  );
}
