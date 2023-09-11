import { useEffect, useMemo } from "react";

import { useAtomValue } from "jotai";
import L from "leaflet";
import { useTranslations } from "next-intl";
import { useMap } from "react-leaflet";

import { filteredTournamentsByTimeControlAtom } from "@/app/atoms";
import { TimeControlColours } from "@/app/constants";
import { TimeControl } from "@/types";

const Legend = () => {
  const t = useTranslations("Tournaments");
  const map = useMap();
  const tournaments = useAtomValue(filteredTournamentsByTimeControlAtom);

  const timeControls = useMemo(
    () =>
      [
        TimeControl.Classic,
        TimeControl.Rapid,
        TimeControl.Blitz,
        TimeControl.Other,
      ].filter((tc) => tournaments.some((t) => t.timeControl === tc)),
    [tournaments],
  );

  useEffect(() => {
    if (map) {
      // @ts-ignore
      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "map-legend");
        div.setAttribute(
          "style",
          "background: white; color: black; border: 2px solid grey; border-radius: 6px; padding: 10px;",
        );

        div.innerHTML = `
          <ul>
            ${timeControls
              .map(
                (tc) => `
                  <li>
                    <span class="block h-4 w-7 border border-[#999] float-left mr-1" style="background: ${
                      TimeControlColours[tc]
                    }"></span>${t("timeControlEnum", { tc })}
                  </li>
                `,
              )
              .join("")}
          </ul>`;
        return div;
      };

      legend.addTo(map);
    }
  }, [map, t]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

export default Legend;
