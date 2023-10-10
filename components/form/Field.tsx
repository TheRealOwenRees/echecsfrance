import { ReactNode } from "react";

import { get } from "lodash";
import {
  Control,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

import { ErrorMessage } from "./ErrorMessage";
import { Label } from "./Label";

export type GenericFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  className?: string;
  labelClassName?: string;
  childrenWrapperClassName?: string;
  label?: React.ReactNode;
  hideErrorMessage?: boolean;
};

type FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> & {
    required?: boolean;
    children: ReactNode;
  }
>;

export const Field = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: FieldProps<TFieldValues, TFieldName>,
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used to restrict the `name` prop type
    control,
  } = props;

  const form = useFormContext<TFieldValues>();

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
