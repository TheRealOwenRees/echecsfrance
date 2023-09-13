"use client";

import { useMemo, useRef } from "react";

import { useSetAtom } from "jotai";
import L, { LatLngLiteral } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { useFormContext, useWatch } from "react-hook-form";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import MapEvents from "@/app/[locale]/components/MapEvents";
import { mapBoundsAtom } from "@/app/atoms";

const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

const Map = () => {
  const { control, setValue } = useFormContext();

  const latValue = useWatch({ control, name: "tournament.coordinates.0" });
  const lngValue = useWatch({ control, name: "tournament.coordinates.1" });

  const setMapBounds = useSetAtom(mapBoundsAtom);
  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          setValue(
            "tournament.coordinates.0",
            Math.round((position.lat + Number.EPSILON) * 10000) / 10000,
          );
          setValue(
            "tournament.coordinates.1",
            Math.round((position.lng + Number.EPSILON) * 10000) / 10000,
          );
        }
      },
    }),
    [setValue],
  );

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom={false}
      style={{ height: "600px", flexGrow: 1 }}
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
      <Marker
        position={{ lat: latValue, lng: lngValue }}
        draggable={true}
        ref={markerRef}
        eventHandlers={eventHandlers}
      />
    </MapContainer>
  );
};

export default Map;
