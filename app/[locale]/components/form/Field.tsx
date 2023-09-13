import { ReactNode } from "react";

import { get } from "lodash";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { ErrorMessage } from "./ErrorMessage";
import { Label } from "./Label";

export type FieldProps = {
  name: string;
  className?: string;
  labelClassName?: string;
  childrenWrapperClassName?: string;
  label?: React.ReactNode;
  hideErrorMessage?: boolean;
};

export const Field = (
  props: Omit<FieldProps, "name"> & {
    required?: boolean;
    name?: string;
    children: ReactNode;
  },
) => {
  const {
    name,
    className,
    labelClassName,
    childrenWrapperClassName,
    label,
    children,
    required,
    hideErrorMessage = false,
  } = props;

  const form = useFormContext();

  const {
    formState: { errors },
  } = form;

  const hasError = name && !!get(errors, name)?.message;

  return (
    <div className={twMerge("flex w-full flex-col items-start", className)}>
      {label ? (
        <Label htmlFor={name} required={required} className={labelClassName}>
          {label}
        </Label>
      ) : null}

      <div
        className={twMerge(
          "flex w-full",
          label && "mt-2",
          childrenWrapperClassName,
        )}
      >
        {children}
      </div>

      {hideErrorMessage || !hasError ? null : (
        <ErrorMessage errorMessage={String(get(errors, name)?.message)} />
      )}
    </div>
  );
};
