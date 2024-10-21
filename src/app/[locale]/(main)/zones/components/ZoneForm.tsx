"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import InfoMessage from "@/components/InfoMessage";
import { InlineSwitchField } from "@/components/form/InlineSwitchField";
import { Label } from "@/components/form/Label";
import { TextField } from "@/components/form/TextField";
import { ZoneEditorField } from "@/components/form/ZoneEditorField";
import { zoneSchema } from "@/schemas";
import { Zone } from "@/server/myZones";
import { TimeControl } from "@/types";

export type ZoneFormValues = z.infer<typeof zoneSchema>;

type ZoneFormProps = {
  zone?: Zone;
  onSubmit: (data: ZoneFormValues) => Promise<void>;
  onCancel: () => void;
  withInfo?: boolean;
  submitTitle?: string;
  cancelTitle?: string;
};

export const ZoneForm = ({
  zone,
  onSubmit,
  onCancel,
  withInfo,
  submitTitle,
  cancelTitle,
}: ZoneFormProps) => {
  const t = useTranslations("Zones");
  const at = useTranslations("App");

  // @ts-ignore - Type instantiation is excessively deep and possibly infinite
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: zone
      ? {
          name: zone.name,
          classicNotifications: zone.classicNotifications,
          rapidNotifications: zone.rapidNotifications,
          blitzNotifications: zone.blitzNotifications,
          otherNotifications: zone.otherNotifications,
          features: zone.features as ZoneFormValues["features"],
        }
      : {
          classicNotifications: false,
          rapidNotifications: false,
          blitzNotifications: false,
          otherNotifications: false,
          features: {
            type: "FeatureCollection",
            features: [],
          },
        },
  });

  const [cn, rn, bn, on] = form.watch([
    "classicNotifications",
    "rapidNotifications",
    "blitzNotifications",
    "otherNotifications",
  ]);

  const requestingNotifications = cn || rn || bn || on;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 items-start gap-6">
          <div className="col-span-4">
            <TextField
              name="name"
              control={form.control}
              label={t("zoneNameLabel")}
              placeholder={t("zoneNamePlaceholder")}
              required
            />
          </div>

          <div className="col-span-4">
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

          <InlineSwitchField
            name="otherNotifications"
            control={form.control}
            label={at("timeControlEnum", { tc: TimeControl.Other })}
          />

          {withInfo && requestingNotifications && (
            <div className="col-span-4">
              <InfoMessage
                type="info"
                message={t.rich("firstNotificationInfo", { br: () => <br /> })}
              />
            </div>
          )}

          <section id="map" className="z-0 col-span-4 flex h-auto">
            <ZoneEditorField name="features" control={form.control} />
          </section>
        </div>

        <div className="flex justify-end gap-4">
          <Button intent="secondary" onClick={onCancel}>
            {cancelTitle ?? at("cancelButton")}
          </Button>

          <Button disabled={form.formState.isSubmitting} type="submit">
            {submitTitle ?? at("saveButton")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
