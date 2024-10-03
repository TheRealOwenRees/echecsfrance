import React, { useEffect, useRef, useState } from "react";

import { get, isArray, isNil } from "lodash";
import { useTranslations } from "next-intl";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { ActionMeta, GroupBase, OnChangeValue, Props } from "react-select";
import AsyncSelect from "react-select/async";

import { Prettify } from "@/types";

import { Field, GenericFieldProps } from "./Field";
import { BaseOption, createSelectClassNamesFn } from "./Select";

export type AsyncSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<
      Props<BaseOption<T, D>, IsMulti, GroupBase<BaseOption<T, D>>>,
      "options" | "onChange" | "value" | "classNames"
    > & {
      required?: boolean;
      loadOption: (id: T) => Promise<BaseOption<T, D> | undefined>;
      loadOptions: (searchString?: string) => Promise<BaseOption<T, D>[]>;
      onInformChange?: (data: BaseOption<T, D>[] | null) => void;
      separators?: boolean;
      size?: "small" | "medium";
    }
>;

export const AsyncSelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  IsMulti extends boolean = false,
  T = string,
  D = unknown,
>({
  name,
  control,
  className,
  label,
  hideErrorMessage,
  required,
  size,

  loadOption,
  loadOptions,
  onInformChange,

  placeholder,
  separators,

  ...selectProps
}: AsyncSelectFieldProps<TFieldValues, TFieldName, IsMulti, T, D>) => {
  const t = useTranslations("App");
  const [loadingValues, setLoadingValues] = useState(false);
  const [loadedInitialValues, setLoadedInitialValues] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const valueOptions = useRef<BaseOption<T, D>[]>([]);
  const searchOptions = useRef<BaseOption<T, D>[]>([]);
  const form = useFormContext();
  const value = useWatch({ control: form.control, name });

  // Fetch the option(s) for the current value(s) when mounted
  useEffect(() => {
    const doLoad = async () => {
      try {
        const values = !value ? [] : isArray(value) ? value : [value];

        const unFetchedValues = values.filter(
          (v) =>
            valueOptions.current.find((o) => o.value === value) === undefined,
        );

        if (unFetchedValues.length > 0) {
          setLoadingValues(true);
          const options = await Promise.all(
            unFetchedValues.map((v: T) => {
              return loadOption(v);
            }),
          );

          valueOptions.current = [
            ...valueOptions.current,
            ...options.filter((vo): vo is BaseOption<T, D> => vo !== undefined),
          ];

          setLoadingValues(false);

          onInformChange?.(
            values.map(
              (v) => valueOptions.current.find((o) => o.value === v)!,
            ) as BaseOption<T, D>[],
          );

          // This forced a state update, which enures that the select is updated once the query has finished
          setLoadedInitialValues(true);
        }
      } catch (e) {
        console.log(e);
        setLoadingValues(false);
      }
    };

    doLoad();
  }, [value, setLoadingValues, loadOption, onInformChange]);

  const {
    formState: { errors },
  } = form;

  const hasError = !!get(errors, name)?.message;

  const valueToOption = (value: T) =>
    [...valueOptions.current, ...searchOptions.current].find(
      (o) => o.value === value,
    ) ?? { value, label: "" };

  const fetchOptions = async (searchString?: string) => {
    setLoadingOptions(true);
    const options = await loadOptions(searchString);
    searchOptions.current = options;
    setLoadingOptions(false);
    return options;
  };

  const classNames = createSelectClassNamesFn<BaseOption<T, D>, IsMulti>({
    size,
  });

  return (
    <Field {...{ name, control, className, label, hideErrorMessage, required }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const onSelectChange = (
            newValue: OnChangeValue<BaseOption<T, D>, IsMulti>,
            actionMeta: ActionMeta<BaseOption<T, D>>,
          ) => {
            if (isNil(newValue) || actionMeta.action === "clear") {
              onChange(null);
              onInformChange?.(null);
              valueOptions.current = [];
            } else if (isArray(newValue)) {
              onChange(newValue.map((option) => option.value));
              onInformChange?.(newValue);
              valueOptions.current = newValue;
            } else {
              onChange((newValue as BaseOption<T, D>).value);
              onInformChange?.([newValue as BaseOption<T, D>]);
              valueOptions.current = [newValue as BaseOption<T, D>];
            }
          };

          const optionValue =
            isNil(value) || value === ""
              ? null
              : isArray(value)
                ? // @ts-ignore - this is too complex for TS to understand
                  value.map(valueToOption)
                : valueToOption(value);

          return (
            <AsyncSelect<BaseOption<T, D>, IsMulti>
              isClearable
              value={optionValue}
              onChange={onSelectChange}
              loadOptions={fetchOptions}
              defaultOptions
              isLoading={loadingOptions || loadingValues}
              noOptionsMessage={() => t("noOptionsMessage")}
              placeholder={placeholder ?? t("selectPlaceholder")}
              unstyled
              styles={{
                input: (base) => ({
                  ...base,
                  "input:focus": {
                    boxShadow: "none",
                  },
                }),
              }}
              classNames={classNames(hasError, separators ?? false)}
              {...selectProps}
            />
          );
        }}
      />
    </Field>
  );
};
