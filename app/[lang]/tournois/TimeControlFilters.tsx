import { useAtom } from "jotai";

import { classicAtom, rapidAtom, blitzAtom, oneHourKOAtom } from "@/app/atoms";
import { useTranslations } from "next-intl";
import { TimeControl } from "@/types";

const TimeControlFilters = () => {
  const t = useTranslations("Tournaments");
  const classic = useAtom(classicAtom);
  const rapid = useAtom(rapidAtom);
  const blitz = useAtom(blitzAtom);
  const oneHourKO = useAtom(oneHourKOAtom);

  const checkboxes = [
    { title: t("timeControlEnum", { tc: TimeControl.Classic }), atom: classic },
    { title: t("timeControlEnum", { tc: TimeControl.Rapid }), atom: rapid },
    { title: t("timeControlEnum", { tc: TimeControl.Blitz }), atom: blitz },
    { title: t("timeControlEnum", { tc: TimeControl.KO }), atom: oneHourKO },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {checkboxes.map((cb, i) => (
        <div key={i} className="text-gray-900 dark:text-white">
          <label>
            <input
              type="checkbox"
              className="mr-2"
              checked={cb.atom[0]}
              onChange={() => cb.atom[1](!cb.atom[0])}
            />
            {cb.title}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TimeControlFilters;
