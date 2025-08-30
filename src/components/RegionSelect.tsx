import { useState } from "react";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { IoAdd } from "react-icons/io5";
import { GroupBase, OnChangeValue, OptionsOrGroups } from "react-select";

import { isFeature, regionFilterAtom } from "@/atoms";
import { RegionSelectModal } from "@/components/RegionSelectModal";
import { BaseOption, Select, SelectProps } from "@/components/form/Select";
import { useZones } from "@/hooks/useZones";
import { Zone } from "@/server/myZones";
import { useRouter } from "@/utils/routing";

type RegionSelectProps = Omit<
  SelectProps<false, string, Zone | null>,
  "options" | "value" | "onChange"
> & {
  syncTitle: string;
};

type RegionOption = BaseOption<string, Zone | null>;
type GroupedOption = GroupBase<RegionOption>;

export const RegionSelect = ({
  syncTitle,
  ...selectProps
}: RegionSelectProps) => {
  const t = useTranslations("Zones");
  const router = useRouter();
  const [regionFilter, setRegionFilter] = useAtom(regionFilterAtom);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const { zones } = useZones();

  const zoneFilterOptions: OptionsOrGroups<RegionOption, GroupedOption> = [
    {
      value: "map",
      label: syncTitle,
      data: null,
    },
    {
      value: "region",
      label: t("RegionFilter.regionSelectValue"),
      data: null,
    },
    {
      value: "all",
      label: t("ignoreMapOption"),
      data: null,
    },

    {
      label: t("yourZonesSelectGroupHeader"),
      options: [
        ...zones.map((zone) => ({
          value: zone.id,
          label: zone.name,
          data: zone,
        })),

        {
          value: "create",
          label: t("createZoneSelectOption"),
          data: null,
        },
      ],
    },
  ];

  const onChange = (
    option: OnChangeValue<BaseOption<string, Zone | null>, false>,
  ) => {
    if (!option) return;

    if (option.value === "create") {
      router.push("/zones/create");
      return;
    }

    if (option.value === "region") {
      setIsRegionModalOpen(true);
      return;
    }

    if (option.value === "map" || option.value === "all") {
      setRegionFilter(option.value);
    } else {
      setRegionFilter(option.data!);
    }
  };

  const formatGroupLabel = (data: GroupedOption) => (
    <div className="relative -translate-y-1/2 border-b-2 border-primary-500 text-xs font-bold uppercase text-primary-500">
      <div className="relative top-1/2 inline-block translate-y-1/2 bg-gray-50 pr-2 dark:bg-gray-700">
        {data.label}
      </div>
    </div>
  );

  const formatOptionLabel = (option: RegionOption) => {
    if (option.value === "create")
      return (
        <div className="flex items-center gap-1 italic">
          <IoAdd />
          {option.label}
        </div>
      );

    return option.label;
  };

  const allOptions = zoneFilterOptions.flatMap((groupOrOption) =>
    "options" in groupOrOption ? groupOrOption.options : groupOrOption,
  );

  const getValue = () => {
    if (
      regionFilter === "all" ||
      regionFilter === "map" ||
      regionFilter === "region"
    ) {
      return allOptions.find((o) => o.value === regionFilter);
    }

    if (isFeature(regionFilter) && regionFilter.properties) {
      // Display the region name from properties.nom when it's a Feature
      return {
        value: "region",
        label: regionFilter.properties.nom,
        data: null,
      };
    }

    return allOptions.find((o) => o.value === regionFilter.id);
  };

  return (
    <>
      <Select
        options={zoneFilterOptions}
        value={getValue()}
        isMulti={false}
        formatGroupLabel={formatGroupLabel}
        formatOptionLabel={formatOptionLabel}
        onChange={onChange}
        {...selectProps}
      />

      <RegionSelectModal
        isRegionModalOpen={isRegionModalOpen}
        setIsRegionModalOpen={setIsRegionModalOpen}
      />
    </>
  );
};
