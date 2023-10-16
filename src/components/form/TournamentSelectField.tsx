import { useTranslations } from "next-intl";
import { FieldPath, FieldValues } from "react-hook-form";

import { TimeControlColours } from "@/constants";
import { SearchedTournament, trpc } from "@/utils/trpc";

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
  ...rest
}: TournamentSelectFieldProps<TFieldValues, TFieldName>) => {
  const at = useTranslations("App");
  const client = trpc.useContext();

  const loadOption = async (ffeId: string) => {
    const tournament = await client.getTournamentDetails.fetch({ ffeId });

    return !tournament
      ? undefined
      : {
          value: tournament.ffeId,
          label: tournament.tournament,
          data: tournament,
        };
  };

  const loadOptions = async (searchValue?: string) => {
    const tournaments = await client.searchTournaments.fetch({
      searchValue: searchValue ?? "",
    });

    return (tournaments ?? []).map((tournament) => ({
      value: tournament.ffeId,
      label: tournament.tournament,
      data: tournament,
    }));
  };

  return (
    <AsyncSelectField
      {...rest}
      isSearchable
      separators
      loadOption={loadOption}
      loadOptions={loadOptions}
      isClearable={true}
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
  );
};
