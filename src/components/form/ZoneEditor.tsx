import * as React from "react";

import type { FeatureCollection } from "geojson";
import L, { LatLngLiteral } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { MapEvents } from "@/components/MapEvents";

const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

export type ZoneEditorProps = {
  value: FeatureCollection;
  onChange: (geoJson: FeatureCollection) => void;
};

export const ZoneEditor = ({ value, onChange }: ZoneEditorProps) => {
  const initialFeatures = React.useRef(value?.features);
  const featureGroup = React.useRef<L.FeatureGroup>();

  const setFeatureCollectionRef = (element: L.FeatureGroup) => {
    featureGroup.current = element;

    if (element?.getLayers().length === 0 && value) {
      L.geoJSON(value).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && featureGroup.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(featureGroup.current);
          } else {
            featureGroup.current?.addLayer(layer);
          }
        }
      });
    }
  };

  const handleChange = () => {
    const geoJson = featureGroup.current?.toGeoJSON();
    if (geoJson?.type === "FeatureCollection") {
      onChange(geoJson);
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "600px", flexGrow: 1 }}
    >
      <MapEvents
        bounds={
          (initialFeatures.current ?? []).length > 0
            ? L.geoJson(initialFeatures.current).getBounds()
            : undefined
        }
      />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup ref={setFeatureCollectionRef}>
        <EditControl
          position="topright"
          onEdited={handleChange}
          onCreated={handleChange}
          onDeleted={handleChange}
          draw={{
            rectangle: false,
            circle: false,
            polyline: false,
            polygon: true,
            marker: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default ZoneEditor;
