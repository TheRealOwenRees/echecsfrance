import React from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
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

export const DropdownMenu = ({ items, buttonComponent, containerClassName }: DropdownMenuProps) => {
  return (
    <Menu as="div" className={twMerge("relative", containerClassName)}>
      {buttonComponent ?? (
        <MenuButton>
          <IoMdMore />
        </MenuButton>
      )}

      <MenuItems
        anchor={{ to: "bottom end", gap: 15 }}
        portal
        transition
        className="z-20 flex w-auto items-start overflow-hidden rounded-md bg-neutral-200 transition ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none dark:bg-neutral-600"
      >
        <div className="flex flex-col px-1 py-1">
          {items.map(({ title, onClick, className, disabled }, i) => (
            <MenuItem key={i}>
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
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
