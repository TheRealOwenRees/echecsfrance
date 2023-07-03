import { TournamentDataProps, Tournament } from "@/types";
import L, { LatLngLiteral } from "leaflet";
import {
  LayerGroup,
  LayersControl,
  Marker,
  Popup,
  MarkerProps,
} from "react-leaflet";
import { useTranslations } from "next-intl";

const coordinateRandomisation = (lat: number, lng: number): LatLngLiteral => {
  const randomisation = () => Math.random() * (-0.01 - 0.01) + 0.01;
  return {
    lat: lat + randomisation(),
    lng: lng + randomisation(),
  };
};

type TournamentMarkerProps = {
  tournament: Tournament;
  colour: string;
} & Omit<MarkerProps, "position">;

export const CompetitionMarker = ({
  tournament,
  colour,
  ...markerProps
}: TournamentMarkerProps) => {
  const t = useTranslations("Competitions");

  const iconOptions = new L.Icon({
    iconUrl: `/images/leaflet/marker-icon-2x-${colour}.png`,
    shadowUrl: "/images/leaflet/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <Marker
      position={coordinateRandomisation(
        tournament.coordinates[0],
        tournament.coordinates[1]
      )}
      icon={iconOptions}
      {...markerProps}
    >
      <Popup>
        <p>
          {tournament.date}
          <br />
          <a href={tournament.url} target="_blank" rel="noopener noreferrer">
            {tournament.tournament}
          </a>
        </p>
        {t("approx")}
      </Popup>
    </Marker>
  );
};

export const createLayerGroups = (
  timeControl: string,
  colour: string,
  { tournamentData }: TournamentDataProps
) => {
  const filteredTournaments = tournamentData.filter(
    (t) => t.time_control === timeControl
  );

  const layerGroup = filteredTournaments.map((tournament) => {
    return (
      <CompetitionMarker
        key={tournament._id}
        tournament={tournament}
        colour={colour}
        riseOnHover
      />
    );
  });

  return (
    <LayersControl.Overlay checked name={timeControl}>
      <LayerGroup>{layerGroup}</LayerGroup>
    </LayersControl.Overlay>
  );
};
