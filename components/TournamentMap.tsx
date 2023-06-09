"use client";

import { TournamentDataProps } from "@/types";
import { LatLngLiteral } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";

import { createLayerGroups } from "@/utils/layerGroups";
import Legend from "@/components/Legend";

export default function TournamentMap({ tournamentData }: TournamentDataProps) {
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const classicalMarkers = createLayerGroups("Cadence Lente", "green", {
    tournamentData,
  });
  const rapidMarkers = createLayerGroups("Rapide", "blue", { tournamentData });
  const blitzMarkers = createLayerGroups("Blitz", "yellow", { tournamentData });
  const otherMarkers = createLayerGroups("1h KO", "red", { tournamentData });

  return (
    <section
      id="tournament-map"
      className="grid h-[calc(100vh-108px)] md:h-[calc(100vh-76px)]"
    >
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{
          height: "100%",
        }}
      >
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
