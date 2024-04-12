import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { SingleValue } from "react-select";

import { regionFilterAtom } from "@/atoms";
import { BaseOption, Select, SelectProps } from "@/components/form/Select";
import { useZones } from "@/hooks/useZones";
import { Zone } from "@/server/myZones";

type RegionSelectProps = Omit<SelectProps, "options" | "value" | "onChange">;

export const RegionSelect = (selectProps: RegionSelectProps) => {
  const t = useTranslations("Tournaments");
  const [regionFilter, setRegionFilter] = useAtom(regionFilterAtom);
  const { zones } = useZones();

  const zoneFilterOptions: BaseOption<string, Zone | null>[] = [
    {
      value: "map",
      label: t("syncWithMapOption"),
      data: null,
    },
    {
      value: "all",
      label: t("ignoreMapOption"),
      data: null,
    },

    ...zones.map((zone) => ({
      value: zone.id,
      label: zone.name,
      data: zone,
    })),
  ];

  const onChange = (option: SingleValue<BaseOption<string, Zone | null>>) => {
    if (!option) return;

    if (option.value === "map" || option.value === "all")
      setRegionFilter(option.value);
    else setRegionFilter(option.data!);
  };

  return (
    <Select
      options={zoneFilterOptions}
      value={zoneFilterOptions.find((o) =>
        regionFilter === "all" || regionFilter === "map"
          ? o.value === regionFilter
          : o.value === regionFilter.id,
      )}
      onChange={(v) =>
        onChange(v as SingleValue<BaseOption<string, Zone | null>>)
      }
      {...selectProps}
    />
  );
};
