import React from "react";

import { Float } from "@headlessui-float/react";
import { Menu } from "@headlessui/react";
import { IoMdMore } from "react-icons/io";
import { twMerge } from "tailwind-merge";

export type DropdownMenuItem = {
  title: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
};

type DropdownMenuProps = {
  items: DropdownMenuItem[];
  buttonComponent?: React.ReactElement;
  containerClassName?: string;
};

export const DropdownMenu = ({
  items,
  buttonComponent,
  containerClassName,
}: DropdownMenuProps) => {
  return (
    <Menu as="div" className={twMerge("relative", containerClassName)}>
      <Float
        portal
        placement="bottom-end"
        offset={15}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {buttonComponent ?? (
          <Menu.Button>
            <IoMdMore />
          </Menu.Button>
        )}

        <Menu.Items className="z-20 flex w-auto items-start overflow-hidden rounded-md bg-neutral-200 focus:outline-none  dark:bg-neutral-600">
          <div className="flex flex-col px-1 py-1">
            {items.map(({ title, onClick, className, disabled }, i) => (
              <Menu.Item key={i}>
                <button
                  type="button"
                  className={twMerge(
                    "w-full whitespace-nowrap rounded-md px-2.5 py-2 text-left text-sm text-black dark:text-white",
                    !disabled && "hover:bg-white dark:hover:bg-neutral-700",
                    disabled && "text-neutral-500 dark:text-neutral-500",
                    className,
                  )}
                  disabled={disabled ?? false}
                  onClick={() => {
                    if (!disabled) onClick();
                  }}
                >
                  {title}
                </button>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  );
};
