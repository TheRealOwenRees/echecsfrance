import React, { useRef } from "react";

import { getYear, isValid, parse } from "date-fns";
import fr from "date-fns/locale/fr";
import { get } from "lodash";
import { useLocale, useTranslations } from "next-intl";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "../Field";

import { InputDatePicker } from "./components";
import { DatePickerCustomHeader } from "./components/DatePickerCustomHeader";

registerLocale("fr", fr);

type DateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> & {
    maxDate?: Date;
    minDate?: Date;
    dateFormat?: string;
    className?: string;
    datePickerPopperClass?: string;
    required?: boolean;
  }
>;

export const DateField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  minDate,
  maxDate,
  dateFormat = "dd/MM/yyyy",
  className,
  datePickerPopperClass,

  name,
  control,
  required,
  ...otherFieldProps
}: DateFieldProps<TFieldValues, TFieldName>) => {
  const locale = useLocale();
  const at = useTranslations("App");
  const min = minDate ? minDate.getFullYear() : 1900;

  const inputRef = useRef(null);

  const form = useFormContext<TFieldValues>();
  const {
    formState: { errors },
  } = form;

  const hasError = name && !!get(errors, name)?.message;

  return (
    <Field name={name} control={control} {...otherFieldProps}>
      <div className={twMerge("relative flex w-full flex-col", className)}>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <DatePicker
              locale={locale}
              closeOnScroll={true}
              placeholderText={at("datePlaceholder")}
              portalId="calendar-portal"
              dateFormat={dateFormat}
              disabledKeyboardNavigation={true}
              formatWeekDay={(day: string) => day.slice(0, 3)}
              weekDayClassName={() =>
                "text-xs h-8 w-8 flex-1 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
              }
              dayClassName={() =>
                "text-xs h-8 w-8 flex-1 bg-gray-50 cursor-pointer hover:font-bold text-gray-900 dark:bg-gray-700 dark:text-white"
              }
              value={field.value}
              selected={field.value}
              onSelect={field.onChange}
              onChange={field.onChange}
              onChangeRaw={(e) => {
                // Called when the user types in the input
                if (e?.currentTarget && "value" in e.currentTarget) {
                  const value = e.currentTarget.value;
                  const date = parse(
                    value as string,
                    at("dateParseFormat"),
                    new Date(),
                  );
                  if (
                    isValid(date) &&
                    date.getFullYear() >= min &&
                    maxDate &&
                    getYear(maxDate) >= getYear(date)
                  ) {
                    field.onChange(date);
                  }
                }
              }}
              popperPlacement="bottom-start"
              popperClassName={twMerge(
                "z-50 mt-[12px] rounded border",
                "border-gray-300 bg-gray-50 text-gray-900",
                "dark:border-gray-600 dark:bg-gray-700 dark:text-white",

                datePickerPopperClass,
              )}
              showPopperArrow={false}
              calendarClassName={twMerge(
                "border-gray-300 bg-gray-50 text-gray-900",
                "dark:border-gray-600 dark:bg-gray-700 dark:text-white",
              )}
              minDate={minDate}
              showFullMonthYearPicker
              maxDate={maxDate}
              renderCustomHeader={(props) => (
                <DatePickerCustomHeader {...props} />
              )}
              customInput={
                <InputDatePicker
                  mask={at("dateMask")}
                  inputClass="p-0"
                  className="text-left"
                  ref={inputRef}
                  error={!!hasError}
                />
              }
            />
          )}
        />
      </div>
    </Field>
  );
};
