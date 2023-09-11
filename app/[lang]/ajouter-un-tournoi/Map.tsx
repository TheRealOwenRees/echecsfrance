"use client";

import { ChangeEvent, useMemo, useRef } from "react";

import { useSetAtom } from "jotai";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import MapEvents from "@/app/[lang]/components/MapEvents";
import { mapBoundsAtom } from "@/app/atoms";
import { MapProps } from "@/types";

const Map = ({ position, setPosition, center }: MapProps) => {
  const t = useTranslations("Map");

  const latValue = position.lat.toFixed(4);
  const lngValue = position.lng.toFixed(4);

  const setMapBounds = useSetAtom(mapBoundsAtom);
  const markerRef = useRef<L.Marker | null>(null);

  const handleLatChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const newLat = Number(target.value);
    setPosition((prevPosition) => ({ ...prevPosition, lat: newLat }));
  };

  const handleLngChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const newLng = Number(target.value);
    setPosition((prevPosition) => ({ ...prevPosition, lng: newLng }));
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition],
  );

  return (
    <>
      <div className="col-span-2 sm:col-span-1">
        <label
          htmlFor="lat"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {t("latLabel")}
        </label>
        <input
          value={latValue}
          onChange={handleLatChange}
          type="number"
          id="lat"
          className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          required
        />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label
          htmlFor="lng"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {t("lngLabel")}
        </label>
        <input
          value={lngValue}
          onChange={handleLngChange}
          type="number"
          id="lng"
          className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
          required
        />
      </div>

      <section id="map" className="z-0 col-span-4 flex h-auto">
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
            position={position}
            draggable={true}
            ref={markerRef}
            eventHandlers={eventHandlers}
          />
        </MapContainer>
      </section>
    </>
  );
};

export default Map;
