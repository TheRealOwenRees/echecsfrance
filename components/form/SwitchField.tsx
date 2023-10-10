import React from "react";

import { Switch, SwitchProps } from "@headlessui/react";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "./Field";

type SwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<SwitchProps<"button">, "name">
>;

export const SwitchField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: SwitchFieldProps<TFieldValues, TFieldName>,
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
  const form = useFormContext<TFieldValues>();

  return (
    <Field
      {...{
        name,
        control,
        type: "checkbox",
        label,
        disabled,
        className,
        labelClassName,
      }}
    >
      <div className="flex w-full flex-col">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div className="flex h-[40px] items-center">
              <Switch
                checked={field.value}
                onChange={field.onChange}
                className={twMerge(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                  "ui-not-checked:bg-neutral-300 ui-not-checked:hover:bg-neutral-400",
                  "ui-not-checked:dark:bg-neutral-500 ui-not-checked:dark:hover:bg-neutral-600",
                  "ui-checked:bg-primary-500 ui-checked:hover:bg-primary-600",
                )}
                {...rest}
              >
                <span className="inline-block h-[14px] w-[14px] transform rounded-full bg-white transition-transform ui-checked:translate-x-[19px] ui-not-checked:translate-x-[3px]" />
              </Switch>
            </div>
          )}
        />
      </div>
    </Field>
  );
};
