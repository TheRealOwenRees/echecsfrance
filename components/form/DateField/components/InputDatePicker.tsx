import React, { forwardRef } from "react";

import InputMask from "react-input-mask";
import { twMerge } from "tailwind-merge";

interface InputProps {
  error?: boolean;
  className?: string;
  inputContainerClass?: string;
  inputClass?: string;
  mask?: string | (string | RegExp)[];
}

type AllProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "ref"
> &
  InputProps;

export const InputDatePicker = forwardRef<HTMLInputElement, AllProps>(
  (
    {
      error,
      className,
      children,
      inputContainerClass,
      inputClass,
      mask,

      ...props
    },
    inputRef,
  ) => {
    return (
      <div
        className={twMerge(
          "flex w-full content-center rounded-lg border p-3 text-sm",
          "border-gray-300 bg-gray-50 text-gray-900 shadow-sm",
          "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ",
          !error &&
            "focus-within:border-primary-500 focus-within:ring-primary-500 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500",
          error && "!border-orange-700 focus:!border-orange-700",
          inputContainerClass,
        )}
      >
        <InputMask
          inputRef={inputRef}
          mask={mask ?? ""}
          className={twMerge(
            "w-full border-none bg-transparent text-sm outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0",
            "text-gray-900 dark:text-white",
            inputClass,
          )}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              e.stopPropagation();
            }
          }}
          {...props}
        />
      </div>
    );
  },
);

InputDatePicker.displayName = "InputDatePicker";
