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
import { inputVariants } from "./Input";

type TextAreaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<React.HTMLProps<HTMLTextAreaElement>, "ref" | "name"> & {
      handleChanged?: (props: { name: string }) => void;
      startIcon?: React.ReactNode;
      required?: boolean;
    }
>;

export const TextAreaField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: TextAreaFieldProps<TFieldValues, TFieldName>,
) => {
  const {
    name,
    control,
    label,
    className,
    labelClassName,
    childrenWrapperClassName,
    hideErrorMessage = false,

    startIcon,
    handleChanged,
    required,

    disabled,
    ...rest
  } = props;
  const form = useFormContext<TFieldValues>();

  const {
    formState: { errors },
  } = form;

  const hasError = !!get(errors, name)?.message;

  return (
    <Field
      {...{
        name,
        control,
        label,
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
            <textarea
              {...form.register(name, {
                required,
              })}
              aria-required={required}
              aria-invalid={hasError}
              disabled={disabled}
              className={twMerge(
                inputVariants({
                  state: hasError ? "error" : disabled ? "disabled" : undefined,
                }),
                className,
              )}
              {...rest}
              onChange={(e) => {
                field.onChange(e);
              }}
              value={field.value}
            />
          )}
        />
      </div>
    </Field>
  );
};
