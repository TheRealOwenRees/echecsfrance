"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
} from "react-leaflet";

import { LatLngLiteral } from "leaflet";
import { TournamentDataProps } from "@/types";

export default function TournamentMap({ tournamentData }: TournamentDataProps) {
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  // TODO consider putting in page.tsx so that it is SSR
  // TODO  move to own hook/util
  // TODO wrap in useEffect on initial load []
  function layerGroups(timeControl: string, colour: string) {
    const filteredTournaments = tournamentData.filter(
      (t) => t.time_control === timeControl
    );

    const iconOptions = new L.Icon({
      iconUrl: `images/leaflet/marker-icon-2x-${colour}.png`,
      shadowUrl: "images/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    return (
      <LayersControl.Overlay checked name={timeControl}>
        <LayerGroup>
          {filteredTournaments.map((t) => {
            const coordinates = {
              lat: t.coordinates[0] + Math.random() * (-0.01 - 0.01) + 0.01,
              lng: t.coordinates[1] + Math.random() * (-0.01 - 0.01) + 0.01,
            };

            return (
              <Marker position={coordinates} key={t._id} icon={iconOptions}>
                <Popup>
                  <p>
                    {t.date}
                    <br />
                    <a href={t.url} target="_blank" rel="noopener noreferrer">
                      {t.tournament}
                    </a>
                  </p>
                  géolocalisation approximative
                </Popup>
              </Marker>
            );
          })}
        </LayerGroup>
      </LayersControl.Overlay>
    );
  }

  const classicalMarkers = layerGroups("Cadence Lente", "green");
  const rapidMarkers = layerGroups("Rapide", "blue");
  const blitzMarkers = layerGroups("Blitz", "yellow");
  const otherMarkers = layerGroups("1h KO", "red");

  return (
    <section id="tournament-map" className="w-full lg:col-start-1 lg:col-end-2">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
