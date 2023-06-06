"use client";

// Types
import { TournamentDataProps } from "@/types";
import { LatLngLiteral } from "leaflet";

// Leaflet + icon fixes
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";

import { createLayerGroups } from "@/utils/layerGroups";
import { useEffect } from "react";

export default function TournamentMap({ tournamentData }: TournamentDataProps) {
  const center: LatLngLiteral = { lat: 47.0844, lng: 2.3964 };

  const classicalMarkers = createLayerGroups("Cadence Lente", "green", {
    tournamentData,
  });
  const rapidMarkers = createLayerGroups("Rapide", "blue", { tournamentData });
  const blitzMarkers = createLayerGroups("Blitz", "yellow", { tournamentData });
  const otherMarkers = createLayerGroups("1h KO", "red", { tournamentData });

  // TODO move into its own hook
  function Legend() {
    const map = useMap();

    useEffect(() => {
      if (map) {
        const legend = L.control({ position: "bottomleft" });

        legend.onAdd = () => {
          const div = L.DomUtil.create("div", "map-legend");
          div.style =
            "background: white; color: black; border: 2px solid grey; border-radius: 6px; padding: 10px;";
          div.innerHTML = `<ul>
            <li><span style='background:#00ac39; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>Cadence Lente</li>
            <li><span style='background:#0086c7; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>Rapide</li>
            <li><span style='background:#cec348; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>Blitz</li>
            <li><span style='background:#d10c3e; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>1h KO</li>
            </ul>`;
          return div;
        };

        legend.addTo(map);
      }
    }, [map]);
    return null;
  }

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
