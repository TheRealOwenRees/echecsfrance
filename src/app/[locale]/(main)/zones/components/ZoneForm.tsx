"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { InlineSwitchField } from "@/components/form/InlineSwitchField";
import { Label } from "@/components/form/Label";
import { TextField } from "@/components/form/TextField";
import { ZoneEditorField } from "@/components/form/ZoneEditorField";
import { zoneSchema } from "@/schemas";
import { TimeControl } from "@/types";

export type ZoneFormValues = z.infer<typeof zoneSchema>;

type ZoneFormProps = {
  zone?: ZoneFormValues;
  onSubmit: (data: ZoneFormValues) => Promise<void>;
  onCancel: () => void;
  submitTitle?: string;
  cancelTitle?: string;
};

export const ZoneForm = ({
  zone,
  onSubmit,
  onCancel,
  submitTitle,
  cancelTitle,
}: ZoneFormProps) => {
  const t = useTranslations("Zones");
  const at = useTranslations("App");

  // @ts-ignore - Type instantiation is excessively deep and possibly infinite
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: zone ?? {
      classicNotifications: false,
      rapidNotifications: false,
      blitzNotifications: false,
      features: {
        type: "FeatureCollection",
        features: [],
      },
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 items-start gap-6">
          <div className="col-span-3">
            <TextField
              name="name"
              control={form.control}
              label={t("zoneNameLabel")}
              placeholder={t("zoneNamePlaceholder")}
              required
            />
          </div>

          <div className="col-span-3">
            <div className="flex flex-col gap-4">
              <Label>{t("notificationsLabel")}</Label>
              <div className="font-light text-gray-500 dark:text-gray-400">
                {t("notificationsInfo")}
              </div>
            </div>
          </div>

          <InlineSwitchField
            name="classicNotifications"
            control={form.control}
            label={at("timeControlEnum", { tc: TimeControl.Classic })}
          />
          <InlineSwitchField
            name="rapidNotifications"
            control={form.control}
            label={at("timeControlEnum", { tc: TimeControl.Rapid })}
          />
          <InlineSwitchField
            name="blitzNotifications"
            control={form.control}
            label={at("timeControlEnum", { tc: TimeControl.Blitz })}
          />

          <section id="map" className="z-0 col-span-3 flex h-auto">
            <ZoneEditorField name="features" control={form.control} />
          </section>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-primary px-3 py-2 text-center text-xs text-primary  hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:focus:ring-primary-800 sm:w-fit"
          >
            {cancelTitle ?? at("cancelButton")}
          </button>

          <button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
          >
            {submitTitle ?? at("saveButton")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
