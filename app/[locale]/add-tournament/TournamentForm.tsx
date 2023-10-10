"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { clearMessage } from "@/components/InfoMessage";
import InfoMessage from "@/components/InfoMessage";
import LoadingMap from "@/components/LoadingMap";
import { DateField } from "@/components/form/DateField";
import { SelectField } from "@/components/form/SelectField";
import { SwitchField } from "@/components/form/SwitchField";
import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
import { addTournamentSchema } from "@/schemas";
import { TimeControl } from "@/types";
import { trpc } from "@/utils/trpc";

type TournamentFormValues = z.infer<typeof addTournamentSchema>;

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: LoadingMap,
});

const TournamentForm = () => {
  const t = useTranslations("AddTournament");
  const at = useTranslations("App");
  const addTournament = trpc.addTournament.useMutation();
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
      await addTournament.mutateAsync(data);
      setResponseMessage({
        isSuccessful: true,
        message: t("success"),
      });

      clearMessage(setResponseMessage);
      form.reset();
    } catch (err: unknown) {
      console.log(err);
      setResponseMessage({
        isSuccessful: true,
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
          <div className="col-span-4 row-span-2 sm:col-span-2">
            <TextAreaField
              name="message"
              control={form.control}
              label={t("messageLabel")}
              rows={6}
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
        <button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
        >
          {form.formState.isSubmitting ? t("sending") : t("sendButton")}
        </button>
        <button
          onClick={() => form.reset()}
          type="button"
          className="ml-4 rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
        >
          {t("clearForm")}
        </button>

        <InfoMessage responseMessage={responseMessage} />
      </form>
    </FormProvider>
  );
};

export default TournamentForm;
