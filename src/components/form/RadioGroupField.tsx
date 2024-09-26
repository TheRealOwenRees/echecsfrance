import React from "react";

import { RadioGroup } from "@headlessui/react";
import { isNil } from "lodash";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "./Field";

export type BaseOption<T = string, D = unknown> = {
  value: T;
  label: string | JSX.Element;
  disabled?: boolean;
  data?: D;
};

export type RadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T = string,
  D = unknown,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> & {
    required?: boolean;
    options: BaseOption<T, D>[];
  }
>;

export const RadioGroupField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  T extends React.Key = string,
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

  options,
}: RadioGroupFieldProps<TFieldValues, TFieldName, T, D>) => {
  const t = useTranslations("App");
  const form = useFormContext<TFieldValues>();

  const {
    formState: { errors },
  } = form;

  const valueToOption = (value: T): BaseOption<T, D> =>
    options.find((o) => o.value === value) ?? { value, label: "" };

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
                      "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-5 py-3 text-center font-medium focus:outline-none",
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
