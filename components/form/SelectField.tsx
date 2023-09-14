import { Fragment, useRef } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import {
  IoChevronDown,
  IoCloseOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { Field, FieldProps } from "./Field";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  selectedLabel?: React.ReactNode;
  disabled?: boolean;
};

type SelectFieldProps = FieldProps & {
  required?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  options: SelectOption[];
  searchable?: boolean;
  listboxClassName?: string;
  dropdownClassName?: string;
  searchValue?: string;
  onChangeSearchValue?: (value: string) => void;
  onOptionSelected?: (option: SelectOption) => void;
};

export const SelectField = ({
  name,
  label,
  className,
  labelClassName,
  childrenWrapperClassName,
  hideErrorMessage = false,

  required,
  placeholder,
  noOptionsMessage,
  options,
  searchable,
  searchValue = "",
  onChangeSearchValue,
  onOptionSelected,
  listboxClassName,
  dropdownClassName,
}: SelectFieldProps) => {
  const at = useTranslations("App");
  const form = useFormContext();

  // We need to keep track of the selected option to be able to continue to
  // display it when the user searches for something else
  const curOption = useRef<SelectOption | null>(null);

  return (
    <Field
      {...{
        name,
        label,
        required,
        className,
        labelClassName,
        childrenWrapperClassName,
        hideErrorMessage,
      }}
    >
      <div className="flex w-full flex-col">
        <Controller
          control={form.control}
          name={name}
          render={({ field: { onChange, value, name } }) => {
            const selectedOption =
              curOption.current?.value === value
                ? curOption.current
                : options.find((option) => option.value === value);

            return (
              <Listbox
                value={value ?? null}
                name={name}
                onChange={(value) => {
                  curOption.current =
                    options.find((option) => option.value === value) ?? null;
                  onChangeSearchValue?.("");
                  onChange(value);
                  onOptionSelected?.(curOption.current!);
                }}
              >
                {({ open }) => (
                  <div className="relative w-full">
                    <Listbox.Button
                      className={twMerge(
                        "group flex w-full items-center justify-between rounded-lg border p-3 text-sm",
                        "border-gray-300 bg-gray-50  text-gray-900 shadow-sm focus-within:border-primary-500 focus-within:ring-primary-500",
                        "dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500",
                        listboxClassName,
                      )}
                    >
                      <span className="block truncate pr-2 text-gray-900 dark:text-white">
                        {selectedOption?.selectedLabel ??
                          selectedOption?.label ??
                          placeholder ??
                          at("selectPlaceholder")}
                      </span>
                      <span className="pointer-events-none flex items-center pr-2">
                        <IoChevronDown
                          className="h-3 w-3 text-gray-900 dark:text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      show={open}
                      leave="transition ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div
                        className={twMerge(
                          "absolute z-10 mt-1 flex w-full flex-col overflow-y-hidden rounded border py-3 text-white focus:outline-none [&>ul]:outline-none",
                          "border-gray-300 bg-gray-50  text-gray-900",
                          "dark:border-gray-600 dark:bg-gray-700 dark:text-white",

                          dropdownClassName,
                        )}
                      >
                        <Listbox.Options className="flex max-h-[180px] flex-1 flex-col justify-stretch">
                          {searchable && (
                            <div className="mx-3 mb-4 flex h-[40px] w-auto flex-1 items-center justify-between rounded border px-4 dark:border-neutral-500 dark:bg-neutral-600 focus-within:dark:border-neutral-200">
                              <IoSearchOutline
                                width="16px"
                                className="h-4 w-4 flex-shrink-0 text-gray-900 dark:text-white"
                              />
                              <input
                                className="w-full flex-1 border-none bg-transparent ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                value={searchValue}
                                onChange={
                                  onChangeSearchValue
                                    ? (e) => onChangeSearchValue(e.target.value)
                                    : undefined
                                }
                                placeholder={at("searchPlaceholder")}
                                type="search"
                              />
                              {searchValue.trim() !== "" && (
                                <button
                                  className="flex h-4 w-4 flex-shrink-0 items-center justify-center"
                                  type="button"
                                  onClick={() => onChangeSearchValue?.("")}
                                >
                                  <IoCloseOutline className="h-4 w-4 text-gray-900 transition-all duration-200 dark:text-white" />
                                </button>
                              )}
                            </div>
                          )}

                          {options.length === 0 ? (
                            <div className="w-full text-center">
                              {noOptionsMessage ?? at("noOptionsMessage")}
                            </div>
                          ) : (
                            <div className="flex-1 overflow-scroll">
                              {options.map((option) => (
                                <Listbox.Option
                                  key={option.value}
                                  value={option.value}
                                  disabled={option.disabled}
                                  className={twMerge(
                                    "w-full px-3 py-2 text-left",
                                    !option.disabled &&
                                      "hover:bg-primary-500 hover:text-white",
                                    option.disabled && "opacity-50",
                                  )}
                                >
                                  {option.label}
                                </Listbox.Option>
                              ))}
                            </div>
                          )}
                        </Listbox.Options>
                      </div>
                    </Transition>
                  </div>
                )}
              </Listbox>
            );
          }}
        />
      </div>
    </Field>
  );
};
