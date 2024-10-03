import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonVariants = cva(
  "flex items-center justify-center transition-all duration-200",
  {
    variants: {
      intent: {
        primary: [
          "text-center",
          "text-white",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "bg-primary-600",
          "hover:bg-primary-800",
          "disabled:opacity-25",
          "dark:text-white dark:hover:bg-primary-700",
        ],

        secondary: [
          "text-primary dark:text-white",
          "hover:text-white dark:hover:text-white",
          "hover:bg-primary hover:text-white",
          "border border-primary",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "disabled:opacity-25",
        ],

        tertiary: [
          "text-gray-900 dark:text-neutral-400",
          "hover:text-primary dark:hover:text-white",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "disabled:opacity-25",
        ],
      },
      size: {
        small: ["text-sm font-medium", "px-3 py-2", "sm:w-fit", "rounded-lg"],
        medium: ["text-sm font-medium", "px-5 py-3", "sm:w-fit", "rounded-lg"],
        compacted: ["rounded-none", "px-0 py-0"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type ButtonProps = React.ComponentProps<"button"> & ButtonVariants;

export const Button = ({
  className,
  intent,
  size,
  ...props
}: ButtonProps & { className?: string }) => (
  <button
    className={twMerge(buttonVariants({ intent, size, className }))}
    {...props}
  />
);
