"use client";

import { useAtom, useAtomValue } from "jotai";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { dateRangeAtom, maxDateAtom } from "@/atoms";
import { DatePickerDirection } from "@/types";

const DatePicker = ({
  datePickerDirection,
}: {
  datePickerDirection: DatePickerDirection;
}) => {
  const [dateRange, setDateRange] = useAtom(dateRangeAtom);
  const maxDate = useAtomValue(maxDateAtom);

  return (
    <DateRange
      onChange={(item) => setDateRange([item.selection])}
      minDate={new Date()}
      maxDate={maxDate}
      months={2}
      moveRangeOnFirstSelection={true}
      preventSnapRefocus={true}
      ranges={dateRange}
      direction={datePickerDirection}
    />
  );
};

export default DatePicker;
