import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import L from "leaflet";
import { TimeControl } from "@/types";

const Legend = () => {
  const t = useTranslations("Tournaments");
  const map = useMap();

  useEffect(() => {
    if (map) {
      // @ts-ignore
      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "map-legend");
        div.setAttribute(
          "style",
          "background: white; color: black; border: 2px solid grey; border-radius: 6px; padding: 10px;"
        );
        div.innerHTML = `<ul>
            <li><span style='background:#00ac39; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>${t(
              "timeControlEnum",
              { tc: TimeControl.Classic }
            )}</li>
            <li><span style='background:#0086c7; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>${t(
              "timeControlEnum",
              { tc: TimeControl.Rapid }
            )}</li>
            <li><span style='background:#cec348; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>${t(
              "timeControlEnum",
              { tc: TimeControl.Blitz }
            )}</li>
            <li><span style='background:#d10c3e; display: block; height: 16px; width: 30px; border: 1px solid #999; float: left; margin-right: 5px'></span>${t(
              "timeControlEnum",
              { tc: TimeControl.KO }
            )}</li>
            </ul>`;
        return div;
      };

      legend.addTo(map);
    }
  }, [map, t]);
  return null;
};

export default Legend;
