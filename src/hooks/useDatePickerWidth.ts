import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

import { DatePickerDirection } from "@/types";

const useDatePickerWidth = ({
  datePickerRef,
  setDateDirectionState,
}: {
  datePickerRef: RefObject<HTMLDivElement | null>;
  setDateDirectionState: Dispatch<SetStateAction<DatePickerDirection>>;
}) => {
  useEffect(() => {
    const updateDatePickerDirection = () => {
      const datePickerWidth = datePickerRef.current?.offsetWidth ?? 0;
      const isLg = datePickerWidth >= 680;
      // oxlint-disable-next-line no-unused-expressions
      isLg ? setDateDirectionState("horizontal") : setDateDirectionState("vertical");
    };
    updateDatePickerDirection();

    window.addEventListener("resize", updateDatePickerDirection);

    return () => {
      window.removeEventListener("resize", updateDatePickerDirection);
    };
  }, [datePickerRef, setDateDirectionState]);
};

export default useDatePickerWidth;
