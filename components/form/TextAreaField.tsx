import React from "react";

import { get } from "lodash";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Field, FieldProps } from "./Field";

export const TextAreaField = (
  props: FieldProps &
    React.HTMLProps<HTMLTextAreaElement> & {
      handleChanged?: (props: { name: string }) => void;
      startIcon?: React.ReactNode;
    },
) => {
  const {
    name,
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
  const form = useFormContext();

  const {
    formState: { errors },
  } = form;

  const hasError = !!get(errors, name)?.message;

  return (
    <Field
      {...{
        name,
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
          control={form.control}
          name={name}
          render={({ field }) => (
            <div className="relative">
              {startIcon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {startIcon}
                </div>
              )}
              <textarea
                {...form.register(name, {
                  required,
                })}
                aria-required={required}
                aria-invalid={hasError}
                disabled={disabled}
                className={twMerge(
                  "flex w-full content-center rounded-lg border p-3 text-sm",
                  "border-gray-300 bg-gray-50  text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500",
                  "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                  hasError && "!border-orange-700 focus:!border-orange-700",
                  disabled && "dark:bg-gray-50",
                )}
                {...rest}
                onChange={(e) => {
                  field.onChange(e);
                }}
                value={field.value}
              />
            </div>
          )}
        />
      </div>
    </Field>
  );
};
