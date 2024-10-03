import { VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const inputVariants = cva(
  [
    "flex w-full content-center border",
    "transition-all duration-200",
    "border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500",
    "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
  ],
  {
    variants: {
      state: {
        disabled: ["dark:bg-gray-50"],

        error: ["!border-orange-700 focus:!border-orange-700"],
      },
      size: {
        small: ["font-medium", "px-3 py-2", "rounded-lg"],
        medium: ["font-medium", "p-3", "rounded-lg"],
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  Omit<InputVariants, "state"> & {
    hasError?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

export const Input = ({
  className,
  hasError,
  startIcon,
  endIcon,

  size,

  disabled,
  required,
  ...rest
}: InputProps) => {
  return (
    <div className="relative">
      {startIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900 dark:text-white">
          {startIcon}
        </div>
      )}

      <input
        aria-required={required}
        aria-invalid={hasError}
        disabled={disabled}
        className={twMerge(
          inputVariants({
            size,
            state: hasError ? "error" : disabled ? "disabled" : undefined,
          }),
          startIcon && "pl-10",
          endIcon && "pr-10",
          className,
        )}
        {...rest}
      />

      {endIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-900 dark:text-white">
          {endIcon}
        </div>
      )}
    </div>
  );
};
