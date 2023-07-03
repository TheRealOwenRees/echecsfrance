"use client";

import { TournamentDataProps } from "@/types";
import { LatLngLiteral } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useTranslations } from "next-intl";

import { MapContainer, TileLayer, LayersControl } from "react-leaflet";

import { createLayerGroups } from "@/utils/layerGroups";
import Legend from "@/components/Legend";

export default function TournamentMap({ tournamentData }: TournamentDataProps) {
  const t = useTranslations("App");
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const classicalMarkers = createLayerGroups(t("tcClassic"), "green", {
    tournamentData,
  });
  const rapidMarkers = createLayerGroups(t("tcRapid"), "blue", {
    tournamentData,
  });
  const blitzMarkers = createLayerGroups(t("tcBlitz"), "yellow", {
    tournamentData,
  });
  const otherMarkers = createLayerGroups(t("tcKO"), "red", { tournamentData });

  return (
    <section
      id="tournament-map"
      className="grid h-[calc(100vh-153px)] md:h-[calc(100vh-83px)] lg:h-[calc(100vh-173px)]"
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
