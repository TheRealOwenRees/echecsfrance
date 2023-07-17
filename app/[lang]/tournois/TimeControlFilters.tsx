import { useAtom, useAtomValue } from "jotai";

import {
  classicAtom,
  rapidAtom,
  blitzAtom,
  otherAtom,
  tournamentsAtom,
} from "@/app/atoms";
import { useTranslations } from "next-intl";
import { TimeControl } from "@/types";

const TimeControlFilters = () => {
  const t = useTranslations("Tournaments");
  const tournaments = useAtomValue(tournamentsAtom);

  const classic = useAtom(classicAtom);
  const rapid = useAtom(rapidAtom);
  const blitz = useAtom(blitzAtom);
  const other = useAtom(otherAtom);

  const checkboxes = [
    { tc: TimeControl.Classic, atom: classic },
    { tc: TimeControl.Rapid, atom: rapid },
    { tc: TimeControl.Blitz, atom: blitz },
    { tc: TimeControl.Other, atom: other },
  ].filter(({ tc }) => tournaments.some((t) => t.timeControl === tc));

  return (
    <div className="flex flex-wrap gap-3">
      {checkboxes.map(({ tc, atom }, i) => (
        <div key={i} className="text-gray-900 dark:text-white">
          <label>
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
              checked={atom[0]}
              onChange={() => atom[1](!atom[0])}
            />
            {t("timeControlEnum", { tc })}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TimeControlFilters;
