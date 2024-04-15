import * as React from "react";

import L, { LatLngLiteral } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { twMerge } from "tailwind-merge";

import { MapEvents } from "@/components/MapEvents";
import { Zone } from "@/server/myZones";

const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

export type ZoneThumbnailProps = {
  features: Zone["features"];
  className?: string;
};

export const ZoneThumbnail = ({ features, className }: ZoneThumbnailProps) => {
  return (
    <MapContainer
      center={center}
      zoom={5}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      className={twMerge("h-[200px] w-auto md:w-[200px]", className)}
      attributionControl={false}
    >
      <MapEvents bounds={L.geoJson(features).getBounds()} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoJSON data={features} />
    </MapContainer>
  );
};

export default ZoneThumbnail;
