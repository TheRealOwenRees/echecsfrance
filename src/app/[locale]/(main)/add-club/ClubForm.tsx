"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import InfoMessage, { InfoMessageType } from "@/components/InfoMessage";
import LoadingMap from "@/components/LoadingMap";
import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
import { addClubSchema } from "@/schemas";
import { addClub } from "@/server/addClub";
import { errorLog } from "@/utils/logger";

type ClubFormValues = z.infer<typeof addClubSchema>;

const Map = dynamic(() => import("../components/MapCoordinateSelection"), {
  ssr: false,
  loading: LoadingMap,
});

const ClubForm = () => {
  const t = useTranslations("AddClub");

  const [responseMessage, setResponseMessage] = useState<{
    type: InfoMessageType;
    message: string;
  } | null>(null);

  const form = useForm<ClubFormValues>({
    resolver: zodResolver(addClubSchema),
    defaultValues: {
      club: {
        coordinates: [47.0844, 2.3964],
      },
    },
  });

  const onSubmit = async (data: ClubFormValues) => {
    try {
      await addClub(data);

      setResponseMessage({
        type: "success",
        message: t("success"),
      });

      form.reset();
    } catch (err: unknown) {
      errorLog(err);
      setResponseMessage({
        type: "error",
        message: t("failure"),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 items-start gap-6">
          <div className="col-span-4">
            <TextField
              name="club.name"
              control={form.control}
              label={t("clubNameLabel")}
              placeholder={t("clubNamePlaceholder")}
              required
            />
          </div>
          <div className="col-span-4">
            <TextField
              name="club.address"
              control={form.control}
              label={"Address:"}
              placeholder={t("addressPlaceholder")}
              required
            />
          </div>
          <div className="col-span-4">
            <TextField
              name="club.email"
              control={form.control}
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              required
            />
          </div>
          <div className="col-span-4">
            <TextField
              name="club.website"
              control={form.control}
              label={t("websiteLabel")}
              placeholder={t("websitePlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="name"
              control={form.control}
              label={t("yourNameLabel")}
              placeholder={t("yourNamePlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="email"
              control={form.control}
              label={t("yourEmailLabel")}
              placeholder={t("yourEmailPlaceholder")}
              required
            />
          </div>

          <div className="col-span-4 row-span-2 self-stretch sm:col-span-2">
            <TextAreaField
              className="h-full"
              childrenWrapperClassName="h-full"
              name="message"
              control={form.control}
              label={t("messageLabel")}
              placeholder={t("messagePlaceholder")}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="club.coordinates.0"
              control={form.control}
              label={t("latLabel")}
              type="number"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="club.coordinates.1"
              control={form.control}
              label={t("lngLabel")}
              type="number"
              required
            />
          </div>

          <section id="map" className="z-0 col-span-4 flex h-auto">
            <Map page="club" />
          </section>
        </div>

        <div className="flex gap-4">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? t("sending") : t("sendButton")}
          </Button>

          <Button onClick={() => form.reset()} type="button" intent="secondary">
            {t("clearForm")}
          </Button>
        </div>

        {responseMessage && (
          <InfoMessage
            message={responseMessage.message}
            type={responseMessage.type}
            onDismiss={() => setResponseMessage(null)}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default ClubForm;
