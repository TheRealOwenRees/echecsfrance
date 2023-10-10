import { twMerge } from "tailwind-merge";

import { Prettify } from "@/types";

type LabelProps = Prettify<
  React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > & {
    required?: boolean;
    className?: string;
    tooltip?: React.ReactNode;
  }
>;

export const Label = ({
  required,
  className,
  children,
  tooltip,
  ...labelProps
}: LabelProps) => {
  return (
    <label
      {...labelProps}
      className={twMerge(
        "flex items-center text-sm font-medium text-gray-900 dark:text-gray-300",
        required && "after:ml-0.5 after:content-['*']",
        className,
      )}
    >
      <div>{children}</div>
    </label>
  );
};
