"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { TextField } from "@/components/form/TextField";
import { fetchTournamentResultsSchema } from "@/schemas";
import { trpc } from "@/utils/trpc";

type FetchResultsFormValues = z.infer<typeof fetchTournamentResultsSchema>;

export const FetchResultsForm = () => {
  const t = useTranslations("Elo");
  const fetchResults = trpc.fetchTournamentResults.useMutation();

  const form = useForm<FetchResultsFormValues>({
    resolver: zodResolver(fetchTournamentResultsSchema),
  });

  const onSubmit = async (input: FetchResultsFormValues) => {
    try {
      const result = await fetchResults.mutateAsync(input);
      console.log(result);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-end gap-4">
          <TextField
            name="url"
            label={t("resultsUrlLabel")}
            placeholder={t("resultsUrlLabel")}
            required
          />
          <button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="rounded-lg border border-transparent bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
          >
            {t("fetchResultsButton")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
