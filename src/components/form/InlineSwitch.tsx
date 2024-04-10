import React from "react";

import { Switch, SwitchProps } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

export const InlineSwitch = (
  props: {
    label?: React.ReactNode;
    tooltip?: string;
    tooltipId?: string;
  } & SwitchProps<"button">,
) => {
  const {
    label,
    tooltip,
    tooltipId,
    disabled,

    ...rest
  } = props;

  return (
    <Switch.Group>
      <div className="flex w-fit items-center">
        <Switch
          className={twMerge(
            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
            "ui-not-checked:bg-neutral-300 ui-not-checked:hover:bg-neutral-400",
            "ui-not-checked:dark:bg-neutral-500 ui-not-checked:dark:hover:bg-neutral-600",
            "ui-checked:bg-primary-500 ui-checked:hover:bg-primary-600",
          )}
          disabled={disabled}
          {...rest}
        >
          <span className="inline-block h-[14px] w-[14px] translate-x-[3px] transform rounded-full bg-white transition-transform ui-checked:translate-x-[19px]" />
        </Switch>
        {label && (
          <>
            <Switch.Label className="ml-2 text-gray-900 dark:text-gray-300">
              <div className="flex items-center">{label}</div>
            </Switch.Label>
          </>
        )}
      </div>
    </Switch.Group>
  );
};
