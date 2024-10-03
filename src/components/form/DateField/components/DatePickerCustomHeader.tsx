import React from "react";

import { format } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { useLocale } from "next-intl";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/Button";

const chevronClasses = {
  chevronRoot: "h-4 w-4 dark:text-white",
  chevronClassDisabled: "!text-neutral-500",
};

export const DatePickerCustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => {
  const locale = useLocale();

  return (
    <div className="mb-2 flex !w-full items-center justify-between border-b border-neutral-500 px-6 pb-4">
      <Button
        intent="tertiary"
        size="compacted"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className={chevronClasses.chevronRoot}
      >
        <IoChevronBack
          className={twMerge(
            chevronClasses.chevronRoot,
            prevMonthButtonDisabled && chevronClasses.chevronClassDisabled,
          )}
        />
      </Button>
      {format(date, "LLLL yyyy", { locale: locale === "fr" ? fr : enGB })}
      <Button
        intent="tertiary"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={chevronClasses.chevronRoot}
      >
        <IoChevronForward
          className={twMerge(
            chevronClasses.chevronRoot,
            nextMonthButtonDisabled && chevronClasses.chevronClassDisabled,
          )}
        />
      </Button>
    </div>
  );
};
