import { useEffect, useTransition } from "react";

import { useSetAtom } from "jotai";
import L from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet/dist/leaflet.css";
import { useLocale, useTranslations } from "next-intl";
import { useMap, useMapEvent } from "react-leaflet";

import { mapBoundsAtom } from "@/atoms";

// Add Leaflet.GestureHandling for improved desktop and mobile touch gestures
L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
const franceBounds = L.latLngBounds(
  L.latLng(42.08, -5.12),
  L.latLng(51.17, 9.53),
);

type MapEventsProps = {
  bounds?: L.LatLngBounds;
  updateMapBoundsAtom?: boolean;
};

export const MapEvents = ({
  bounds = franceBounds,
  updateMapBoundsAtom = false,
}: MapEventsProps) => {
  const locale = useLocale();
  const t = useTranslations("Map");
  const map = useMap();
  const setMapBounds = useSetAtom(mapBoundsAtom);
  const [isPending, startTransition] = useTransition();

  useMapEvent("moveend", () => {
    if (!updateMapBoundsAtom) return;

    // Set the map bounds atoms when the user pans/zooms
    startTransition(() => {
      setMapBounds(map.getBounds());
    });
  });

  // Viewport agnostic centering of France & max world bounds
  useEffect(() => {
    const zoom = map.getBoundsZoom(bounds);
    map.setView(bounds.getCenter(), zoom === Infinity ? 10 : zoom);
    map.setMaxBounds(worldBounds);
    map.options.maxBoundsViscosity = 1.0; // Prevents going past bounds while dragging

    map.addHandler("gestureHandling", GestureHandling);

    // @ts-expect-error Typescript does not see additional handler here
    map.gestureHandling.enable();
  }, [map]);

  useEffect(() => {
    console.log("setting map language", locale);
    // @ts-expect-error Typescript does not see additional handler here
    map.options.gestureHandlingOptions.text = {
      touch: t("touch"),
      scroll: t("scroll"),
      scrollMac: t("scrollMac"),
    };

    // We need to toggle the handler to update the text on prod.  No idea why.

    // @ts-expect-error Typescript does not see additional handler here
    map.gestureHandling.disable();

    // @ts-expect-error Typescript does not see additional handler here
    map.gestureHandling.enable();
  }, [map, locale]);

  return null;
};
