import React from "react";

import { SwitchProps } from "@headlessui/react";
import { Controller, FieldPath, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Field, GenericFieldProps } from "@/components/form/Field";

import { InlineSwitch } from "./InlineSwitch";

type InlineSwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = GenericFieldProps<TFieldValues, TFieldName> &
  Omit<SwitchProps<"button">, "name">;

export const InlineSwitchField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: InlineSwitchFieldProps<TFieldValues, TFieldName>,
) => {
  const {
    name,
    control,
    label,
    disabled,
    className,
    labelClassName,
    childrenWrapperClassName,
    hideErrorMessage,

    ...rest
  } = props;

  return (
    <Field
      {...{
        name,
        control,
        type: "checkbox",
        disabled,
        className,
        labelClassName,
        childrenWrapperClassName,
        hideErrorMessage,
      }}
    >
      <div className="flex w-full flex-col">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <InlineSwitch
              checked={field.value || false}
              onChange={field.onChange}
              label={label}
              disabled={disabled}
              {...rest}
            />
          )}
        />
      </div>
    </Field>
  );
};
