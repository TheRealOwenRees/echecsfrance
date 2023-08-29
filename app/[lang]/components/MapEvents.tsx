import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { mapBoundsAtom } from "@/app/atoms";
import L from "leaflet";
import { useMapEvent } from "react-leaflet";

const MapEvents = () => {
  const setMapBounds = useSetAtom(mapBoundsAtom);

  const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
  const franceBounds = L.latLngBounds(
    L.latLng(42.08, -5.12),
    L.latLng(51.17, 9.53),
  );

  const map = useMapEvent("moveend", () => {
    // Set the map bounds atoms when the user pans/zooms
    setMapBounds(map.getBounds());
  });

  // viewport agnostic centering of France & max world bounds
  useEffect(() => {
    map.setView(franceBounds.getCenter(), map.getBoundsZoom(franceBounds));
    map.setMaxBounds(worldBounds);
    map.options.maxBoundsViscosity = 1.0; // Prevents going past bounds while dragging
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default MapEvents;
