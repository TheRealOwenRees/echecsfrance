import { useState } from "react";

import { on } from "events";
import { useTranslations } from "next-intl";
import { FieldPath, FieldValues } from "react-hook-form";
import { FaExternalLinkAlt } from "react-icons/fa";

import { TimeControlColours } from "@/constants";
import { getTournamentDetails } from "@/server/getTournamentDetails";
import {
  SearchedTournament,
  searchTournaments,
} from "@/server/searchTournaments";

import { AsyncSelectField, AsyncSelectFieldProps } from "./AsyncSelectField";

type TournamentSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  AsyncSelectFieldProps<
    TFieldValues,
    TFieldName,
    false,
    string,
    SearchedTournament
  >,
  "loadOptions" | "loadOption" | "separators"
>;

export const TournamentSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  onInformChange,
  ...rest
}: TournamentSelectFieldProps<TFieldValues, TFieldName>) => {
  const at = useTranslations("App");
  const [selectedTournament, setSelectedTournament] =
    useState<SearchedTournament | null>(null);

  const loadOption = async (ffeId: string) => {
    const { data: tournament } = await getTournamentDetails({ ffeId });

    return !tournament
      ? undefined
      : {
          value: tournament.ffeId,
          label: tournament.tournament,
          data: tournament,
        };
  };

  const loadOptions = async (searchValue?: string) => {
    const { data: tournaments } = await searchTournaments({
      searchValue: searchValue ?? "",
    });

    return (tournaments ?? []).map((tournament) => ({
      value: tournament.ffeId,
      label: tournament.tournament,
      data: tournament,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <AsyncSelectField
        {...rest}
        isSearchable
        separators
        loadOption={loadOption}
        loadOptions={loadOptions}
        isClearable={true}
        onInformChange={(data) => {
          setSelectedTournament(data ? data[0].data ?? null : null);
          onInformChange?.(data);
        }}
        formatOptionLabel={(option, context) => {
          if (context.context === "value") return option.label;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs uppercase">
                <div className="flex-1">{option.data?.town}</div>
                <div
                  className="ml-2 rounded-sm px-1 py-0.5 align-middle text-[9px]/[11px]  uppercase text-white"
                  style={{
                    background: `${TimeControlColours[option.data!.timeControl]}`,
                  }}
                >
                  {at("timeControlEnum", { tc: option.data?.timeControl })}
                </div>
                <div className="text-xs">{option.data?.date}</div>
              </div>

              <div>{option.data?.tournament}</div>
            </div>
          );
        }}
      />
      {selectedTournament && (
        <a
          href={selectedTournament.url}
          target="_blank"
          className="inline-flex items-center justify-end gap-1 text-xs text-primary hover:text-primary-800"
        >
          {selectedTournament.url}
          <FaExternalLinkAlt />
        </a>
      )}
    </div>
  );
};
