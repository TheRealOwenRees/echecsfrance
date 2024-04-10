import React from "react";

import { FeatureCollection } from "geojson";
import dynamic from "next/dynamic";
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";

import { Prettify } from "@/types";

import LoadingMap from "../LoadingMap";

import { Field, GenericFieldProps } from "./Field";
import type { ZoneEditorProps } from "./ZoneEditor";

const ZoneEditor = dynamic(() => import("./ZoneEditor"), {
  ssr: false,
  loading: LoadingMap,
});

type ZoneEditorFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Prettify<
  GenericFieldProps<TFieldValues, TFieldName> &
    Omit<ZoneEditorProps, "value" | "onChange">
>;

export const ZoneEditorField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ZoneEditorFieldProps<TFieldValues, TFieldName>,
) => {
  const {
    name,
    control,
    label,
    className,
    labelClassName,

    childrenWrapperClassName,
    hideErrorMessage,

    ...rest
  } = props;

  const form = useFormContext<TFieldValues>();

  return (
    <Field
      {...{
        name,
        control,
        label,
        className,
        labelClassName,
      }}
    >
      <div className="flex w-full flex-col">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <ZoneEditor
              value={value ?? { type: "FeatureCollection", features: [] }}
              onChange={(geoJson: FeatureCollection) => onChange(geoJson)}
            />
          )}
        />
      </div>
    </Field>
  );
};
