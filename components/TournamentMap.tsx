"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngLiteral } from "leaflet";

export default function TournamentMap() {
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  return (
    <section id="tournament-map" className="w-full lg:col-start-1 lg:col-end-2">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "50vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </section>
  );
}
