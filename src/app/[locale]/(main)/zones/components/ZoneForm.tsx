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

type ZoneFormValues = z.infer<typeof zoneSchema>;

export const ZoneForm = () => {
  const t = useTranslations("Zones");
  const at = useTranslations("App");
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      classicNotifications: false,
      rapidNotifications: false,
      blitzNotifications: false,
      features: {
        type: "FeatureCollection",
        features: [],
      },
    },
  });

  const onSubmit = async (data: ZoneFormValues) => {
    try {
      console.log(data);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
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
          <button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
          >
            {t("saveButton")}
          </button>
        </form>
      </FormProvider>
    </div>
  );
};
