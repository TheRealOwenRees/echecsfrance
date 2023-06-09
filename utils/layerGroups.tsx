import { TournamentDataProps } from "@/types";
import { LatLngLiteral } from "leaflet";

import L from "leaflet";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";

const coordinateRandomisation = (lat: number, lng: number): LatLngLiteral => {
  const randomisation = () => Math.random() * (-0.01 - 0.01) + 0.01;
  return {
    lat: lat + randomisation(),
    lng: lng + randomisation(),
  };
};

export const createLayerGroups = (
  timeControl: string,
  colour: string,
  { tournamentData }: TournamentDataProps
) => {
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

  const layerGroup = filteredTournaments.map((t) => {
    return (
      <Marker
        position={coordinateRandomisation(t.coordinates[0], t.coordinates[1])}
        key={t._id}
        icon={iconOptions}
      >
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
  });

  return (
    <LayersControl.Overlay checked name={timeControl}>
      <LayerGroup>{layerGroup}</LayerGroup>
    </LayersControl.Overlay>
  );
};
