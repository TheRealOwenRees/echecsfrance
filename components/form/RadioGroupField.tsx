import React from "react";

import { RadioGroup } from "@headlessui/react";
import { get, isNil } from "lodash";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Field, FieldProps } from "./Field";

export type BaseOption<T = string, D = unknown> = {
  value: T;
  label: string | JSX.Element;
  disabled?: boolean;
  data?: D;
};

export type RadioGroupFieldProps<T = string, D = unknown> = FieldProps & {
  required?: boolean;
  options: BaseOption<T, D>[];
};

export const RadioGroupField = <T extends React.Key = string, D = unknown>({
  name,
  className,
  labelClassName,
  childrenWrapperClassName,
  label,
  hideErrorMessage,
  required,

  options,
}: RadioGroupFieldProps<T, D>) => {
  const t = useTranslations("App");
  const form = useFormContext();

  const {
    formState: { errors },
  } = form;

  const hasError = !!get(errors, name)?.message;

  const valueToOption = (value: T): BaseOption<T, D> =>
    options.find((o) => o.value === value) ?? { value, label: "" };

  return (
    <Field
      {...{
        name,
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
        control={form.control}
        render={({ field: { onChange, value } }) => {
          const optionValue = isNil(value) ? null : valueToOption(value);

          return (
            <RadioGroup
              value={value}
              onChange={onChange}
              className="flex w-full justify-stretch gap-2"
            >
              {options.map((option) => (
                <RadioGroup.Option
                  key={option.value}
                  value={option.value}
                  className={({ checked }) =>
                    twMerge(
                      "flex  flex-1 cursor-pointer items-center justify-center rounded-lg border px-5 py-3 text-center text-sm font-medium focus:outline-none",
                      "border-gray-300 bg-gray-50 text-gray-900",
                      "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
                      checked &&
                        "border-primary text-primary dark:border-primary dark:text-primary",
                    )
                  }
                  disabled={option.disabled}
                >
                  <RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          );
        }}
      />
    </Field>
  );
};
