import { useAtom, useAtomValue } from "jotai";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import {
  DurationFilter as DurationFilterValue,
  durationFilterAtom,
  tournamentsAtom,
} from "@/atoms";

const DurationFilter = () => {
  const t = useTranslations("Tournaments");
  const tournaments = useAtomValue(tournamentsAtom);
  const [durationFilter, setDurationFilter] = useAtom(durationFilterAtom);

  const show3Plus = tournaments.some((tt) => tt.durationDays >= 3);

  const options: { value: DurationFilterValue; label: string }[] = [
    { value: "any", label: t("durationAny") },
    { value: "1", label: t("duration1Day") },
    { value: "2", label: t("duration2Days") },
    ...(show3Plus ? [{ value: "3+" as const, label: t("duration3PlusDays") }] : []),
  ];

  return (
    <div className="flex flex-wrap items-center gap-1">
      {options.map(({ value, label }) => {
        const isActive = durationFilter === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setDurationFilter(value)}
            className={twMerge(
              "rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none",
              isActive
                ? "border-primary bg-primary text-white"
                : "border-gray-400 text-gray-600 hover:border-primary hover:text-primary dark:border-gray-600 dark:text-gray-300 dark:hover:text-primary",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default DurationFilter;
