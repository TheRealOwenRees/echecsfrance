import React from "react";

import { flatMap, get, isArray, isNil, isObject } from "lodash";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { GroupBase, OnChangeValue } from "react-select";

import { BaseOption, Select, SelectProps } from "@/components/form/Select";
import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "./Field";

export type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<
      SelectProps<IsMulti, T, D>,
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
              hasError={hasError}
              {...selectProps}
            />
          );
        }}
      />
    </Field>
  );
};
