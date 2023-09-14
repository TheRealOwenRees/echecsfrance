import React from "react";

import { Switch, SwitchProps } from "@headlessui/react";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Field, FieldProps } from "./Field";

export const SwitchField = (props: FieldProps & SwitchProps<"button">) => {
  const {
    name,
    label,
    disabled,
    className,
    labelClassName,

    childrenWrapperClassName,
    hideErrorMessage,

    ...rest
  } = props;
  const form = useFormContext();

  return (
    <Field
      {...{
        name,
        type: "checkbox",
        label,
        disabled,
        className,
        labelClassName,
      }}
    >
      <div className="flex w-full flex-col">
        <Controller
          control={form.control}
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
                <span className="ui-checked:translate-x-[19px] ui-not-checked:translate-x-[3px] inline-block h-[14px] w-[14px] transform rounded-full bg-white transition-transform" />
              </Switch>
            </div>
          )}
        />
      </div>
    </Field>
  );
};
