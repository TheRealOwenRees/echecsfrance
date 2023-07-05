"use client";

import { Tournament } from "@/types";
import { LatLngLiteral } from "leaflet";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  LayerGroup,
  useMapEvent,
} from "react-leaflet";
import { useAtomValue, useSetAtom } from "jotai";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { tournamentsAtom, mapBoundsAtom } from "@/app/atoms";

import Legend from "./Legend";
import { TournamentMarker } from "./TournamentMarker";

const MapEvents = () => {
  const setMapBounds = useSetAtom(mapBoundsAtom);
  const map = useMapEvent("moveend", () => {
    setMapBounds(map.getBounds());
  });

  return null;
};

export default function TournamentMap() {
  const tournaments = useAtomValue(tournamentsAtom);
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const createLayerGroups = (
    timeControl: string,
    colour: string,
    tournaments: Tournament[]
  ) => {
    const filteredTournaments = tournaments.filter(
      (t) => t.time_control === timeControl
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

    return (
      <LayersControl.Overlay checked name={timeControl}>
        <LayerGroup>{layerGroup}</LayerGroup>
      </LayersControl.Overlay>
    );
  };

  const classicalMarkers = createLayerGroups(
    "Cadence Lente",
    "green",
    tournaments
  );
  const rapidMarkers = createLayerGroups("Rapide", "blue", tournaments);
  const blitzMarkers = createLayerGroups("Blitz", "yellow", tournaments);
  const otherMarkers = createLayerGroups("1h KO", "red", tournaments);

  return (
    <section id="tournament-map" className="grid h-[calc(100vh-144px)]">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{
          height: "100%",
        }}
      >
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Legend />
        <LayersControl>
          {classicalMarkers}
          {rapidMarkers}
          {blitzMarkers}
          {otherMarkers}
        </LayersControl>
      </MapContainer>
    </section>
  );
}
