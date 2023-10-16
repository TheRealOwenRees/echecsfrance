import React from "react";

import { flatMap, get, isArray, isNil, isObject } from "lodash";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import Select, {
  ClassNamesConfig,
  GroupBase,
  OnChangeValue,
  Props,
} from "react-select";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "./Field";

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
  groupHeading: () => "ml-3 mt-2 mb-1 text-textGray text-sm uppercase",
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

export type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<
      Props<BaseOption<T, D>, IsMulti, GroupBase<BaseOption<T, D>>>,
      "onChange" | "value" | "classNames" | "name"
    > & {
      required?: boolean;
      separators?: boolean;
    }
>;

export const SelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
>({
  name,
  control,
  className,
  labelClassName,
  childrenWrapperClassName,
  label,
  hideErrorMessage,
  required,

  placeholder,
  separators,
  options,
  ...selectProps
}: SelectFieldProps<TFieldValues, TFieldName, IsMulti, T, D>) => {
  const t = useTranslations("App");
  const form = useFormContext<TFieldValues>();

  const {
    formState: { errors },
  } = form;

  const hasError = !!get(errors, name)?.message;

  const isGroup = (
    option: BaseOption<T, D> | GroupBase<BaseOption<T, D>>,
  ): option is GroupBase<BaseOption<T, D>> =>
    isObject(option) && "options" in option;

  const flattenedOptions = flatMap(options, (option) => {
    return isGroup(option) ? option.options : option;
  });

  const valueToOption = (value: T): BaseOption<T, D> =>
    flattenedOptions.find((o) => o.value === value) ?? { value, label: "" };

  return (
    <Field
      {...{
        name,
        control,
        className,
        label,
        labelClassName,
        childrenWrapperClassName,
        hideErrorMessage,
        required,
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const onSelectChange = (
            newValue: OnChangeValue<BaseOption<T, D>, IsMulti>,
          ) => {
            if (isNil(newValue)) onChange(null);
            else if (isArray(newValue)) {
              onChange(newValue.map((option) => option.value));
            } else onChange((newValue as BaseOption<T, D>).value);
          };

          const optionValue = isNil(value)
            ? null
            : isArray(value)
            ? // @ts-ignore - this is too complex for TS to understand
              value.map(valueToOption)
            : valueToOption(value);

          return (
            <Select
              value={optionValue}
              onChange={onSelectChange}
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
              classNames={classNames<BaseOption<T, D>, IsMulti>(
                hasError,
                separators ?? false,
              )}
              {...selectProps}
            />
          );
        }}
      />
    </Field>
  );
};
