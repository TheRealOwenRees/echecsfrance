"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import { clearMessage } from "@/components/InfoMessage";
import InfoMessage from "@/components/InfoMessage";
import LoadingMap from "@/components/LoadingMap";
import { DateField } from "@/components/form/DateField";
import { SelectField } from "@/components/form/SelectField";
import { SwitchField } from "@/components/form/SwitchField";
import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
import { addTournamentSchema } from "@/schemas";
import { addTournament } from "@/server/addTournament";
import { TimeControl } from "@/types";

type TournamentFormValues = z.infer<typeof addTournamentSchema>;

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: LoadingMap,
});

const TournamentForm = () => {
  const t = useTranslations("AddTournament");
  const at = useTranslations("App");

  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(addTournamentSchema),
    defaultValues: {
      tournament: {
        norm_tournament: false,
        coordinates: [47.0844, 2.3964],
      },
    },
  });

  const onSubmit = async (data: TournamentFormValues) => {
    try {
      await addTournament(data);
      setResponseMessage({
        isSuccessful: true,
        message: t("success"),
      });

      clearMessage(setResponseMessage);
      form.reset();
    } catch (err: unknown) {
      console.log(err);
      setResponseMessage({
        isSuccessful: false,
        message: t("failure"),
      });

      clearMessage(setResponseMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 items-start gap-6">
          <div className="col-span-4">
            <TextField
              name="tournament.tournament"
              control={form.control}
              label={t("tournamentNameLabel")}
              placeholder={t("tournamentNamePlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <DateField
              name="tournament.date"
              control={form.control}
              label={t("dateLabel")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="tournament.url"
              control={form.control}
              label={t("urlLabel")}
              placeholder={t("urlPlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <SelectField
              name="tournament.time_control"
              control={form.control}
              label={t("tcLabel")}
              options={[
                TimeControl.Classic,
                TimeControl.Rapid,
                TimeControl.Blitz,
              ].map((tc) => ({
                value: tc,
                label: at("timeControlEnum", { tc }),
              }))}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <SwitchField
              name="tournament.norm_tournament"
              control={form.control}
              label={t("normLabel")}
            />
          </div>
          <div className="col-span-4">
            <TextField
              name="tournament.address"
              control={form.control}
              label={t("addressLabel")}
              placeholder={t("addressPlaceholder")}
              required
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <TextField
              name="tournament.town"
              control={form.control}
              label={t("townLabel")}
              placeholder={t("townPlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="tournament.department"
              control={form.control}
              label={t("departmentLabel")}
              placeholder={t("departmentPlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="tournament.country"
              control={form.control}
              label={t("countryLabel")}
              placeholder={t("countryPlaceholder")}
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
              name="tournament.coordinates.0"
              control={form.control}
              label={t("latLabel")}
              type="number"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              name="tournament.coordinates.1"
              control={form.control}
              label={t("lngLabel")}
              type="number"
              required
            />
          </div>

          <section id="map" className="z-0 col-span-4 flex h-auto">
            <Map />
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
        <InfoMessage responseMessage={responseMessage} />
      </form>
    </FormProvider>
  );
};

export default TournamentForm;
