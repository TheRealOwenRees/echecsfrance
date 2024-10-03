import React from "react";

import { get } from "lodash";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "./Field";
import { Input, InputProps } from "./Input";

type TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<InputProps, "ref" | "name" | "size"> & {
      handleChanged?: (props: { name: string }) => void;
      startIcon?: React.ReactNode;
    }
>;

export const TextField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: TextFieldProps<TFieldValues, TFieldName>,
) => {
  const {
    name,
    control,
    type = "text",
    label,
    required,
    disabled,
    className,
    labelClassName,
    childrenWrapperClassName,
    hideErrorMessage = false,

    startIcon,
    handleChanged,

    ...rest
  } = props;
  const form = useFormContext<TFieldValues>();

  const {
    formState: { errors },
  } = form;

  const hasError = !!get(errors, name)?.message;

  const input = (value: string | number) => {
    return typeof value === "number"
      ? isNaN(value)
        ? ""
        : value.toString()
      : (value ?? "");
  };

  const output =
    type === "number"
      ? (e: React.ChangeEvent<HTMLInputElement>) => {
          const output = parseFloat(e.target.value);
          return isNaN(output) ? 0 : output;
        }
      : (e: React.ChangeEvent<HTMLInputElement>) => e.target.value;

  return (
    <Field
      {...{
        name,
        control,
        label,
        required,
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
            <Input
              type={type}
              {...form.register(name, {
                valueAsNumber: type === "number",
                required,
              })}
              hasError={hasError}
              required={required}
              disabled={disabled}
              startIcon={startIcon}
              className={twMerge(startIcon && "pl-10")}
              {...rest}
              onChange={(e) => {
                field.onChange(output(e));
              }}
              value={input(field.value)}
              onBlur={() => {
                if (handleChanged) handleChanged({ name });
              }}
            />
          )}
        />
      </div>
    </Field>
  );
};
