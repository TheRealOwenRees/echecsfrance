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

type TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<React.HTMLProps<HTMLInputElement>, "ref" | "name"> & {
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
      : value ?? "";
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
            <div className="relative">
              {startIcon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {startIcon}
                </div>
              )}
              <input
                type={type}
                {...form.register(name, {
                  valueAsNumber: type === "number",
                  required,
                })}
                aria-required={required}
                aria-invalid={hasError}
                disabled={disabled}
                className={twMerge(
                  "flex w-full content-center rounded-lg border p-3 text-sm",
                  "border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500",
                  "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                  hasError && "!border-orange-700 focus:!border-orange-700",
                  disabled && "dark:bg-gray-50",
                  startIcon && "pl-10",
                )}
                {...rest}
                onChange={(e) => {
                  field.onChange(output(e));
                }}
                value={input(field.value)}
                onBlur={() => {
                  if (handleChanged) handleChanged({ name });
                }}
              />
            </div>
          )}
        />
      </div>
    </Field>
  );
};
