import React from "react";

import { useTranslations } from "next-intl";
import ReactSelect, { ClassNamesConfig, GroupBase, Props } from "react-select";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

export type BaseOption<T = string, D = unknown> = {
  value: T;
  label: string | JSX.Element;
  disabled?: boolean;
  data?: D;
};

export const classNames = <Option, IsMulti extends boolean = false>(
  hasError: boolean,
  separators: boolean,
): ClassNamesConfig<Option, IsMulti, GroupBase<Option>> => ({
  container: () => "w-full",
  valueContainer: () => "text-gray-900 dark:text-white",
  indicatorsContainer: () => "flex items-center self-stretch shrink-0",
  clearIndicator: () => "flex items-center pr-2 text-gray-900 dark:text-white",
  dropdownIndicator: () =>
    "pointer-events-none flex items-center pr-2 text-gray-900 dark:text-white",
  indicatorSeparator: () => "w-px text-gray-900 dark:text-white",
  control: (state) =>
    twMerge(
      "group flex w-full items-center justify-between rounded-lg border p-3 text-sm",
      "border-gray-300 bg-gray-50  text-gray-900 shadow-sm focus-within:border-primary-500 focus-within:ring-primary-500",
      "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500",

      hasError && "ring-1 ring-error",
      state.isDisabled && "cursor-not-allowed",
      state.isFocused && "border-primary ring ring-primary ring-opacity-50",
    ),
  multiValue: () => "bg-fieldGray border rounded-lg flex space-x-1 pl-1 m-1",
  multiValueLabel: () => "",
  multiValueRemove: () => "items-center px-1 hover:text-primary",
  placeholder: () =>
    "block truncate pr-2 placeholder-gray dark:placeholder-gray-400",
  menu: () =>
    twMerge(
      "!z-30 mt-2 rounded-lg border border-gray-200 bg-white p-1",
      "border-gray-300 bg-gray-50  text-gray-900",
      "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
    ),
  groupHeading: () => "mx-3 mt-2 mb-1 text-textGray text-sm uppercase",
  option: ({ isFocused, isDisabled }) =>
    twMerge(
      "px-3 py-2 hover:cursor-pointer",
      separators && "border-b border-gray-200",
      isDisabled && "opacity-50",
      isFocused && "hover:bg-primary-500 hover:text-white",
    ),
  noOptionsMessage: () =>
    "text-textGray p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm",
});

export type SelectProps<
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
> = Prettify<
  Omit<
    Props<BaseOption<T, D>, IsMulti, GroupBase<BaseOption<T, D>>>,
    "classNames"
  > & {
    required?: boolean;
    separators?: boolean;
    hasError?: boolean;
    classNameOverrides?: ClassNamesConfig<
      BaseOption<T, D>,
      IsMulti,
      GroupBase<BaseOption<T, D>>
    >;
  }
>;

export const Select = <
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
>({
  className,
  required,

  placeholder,
  separators,
  hasError,
  options,
  classNameOverrides,
  ...selectProps
}: SelectProps<IsMulti, T, D>) => {
  const t = useTranslations("App");
  return (
    <ReactSelect
      options={options}
      noOptionsMessage={() => t("noOptionsMessage")}
      placeholder={placeholder ?? t("selectPlaceholder")}
      unstyled
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
        }),
      }}
      classNames={{
        ...classNames<BaseOption<T, D>, IsMulti>(
          hasError ?? false,
          separators ?? false,
        ),
        ...(classNameOverrides ?? {}),
      }}
      {...selectProps}
    />
  );
};
