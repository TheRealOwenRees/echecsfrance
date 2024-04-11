import * as React from "react";

import L, { LatLngLiteral } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { FeatureGroup, GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import { MapEvents } from "@/components/MapEvents";
import type { ZoneModel } from "@/server/models/zoneModel";

const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

export type ZoneThumbnailProps = {
  features: ZoneModel["features"];
  size: number;
};

export const ZoneThumbnail = ({ features, size }: ZoneThumbnailProps) => {
  return (
    <MapContainer
      center={center}
      zoom={5}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      style={{ height: size, width: size }}
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
