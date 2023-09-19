"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Spinner } from "@/components/Spinner";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { fetchTournamentResultsSchema } from "@/schemas";
import { trpc } from "@/utils/trpc";

import { KFactor } from "./KFactor";
import { ManualEloForm } from "./ManualEloForm";
import { TournamentResults } from "./TournamentResults";

const formSchema = fetchTournamentResultsSchema.extend({
  player: z.string().optional(),
  kFactor: z.enum(["40", "30", "20", "15", "10"]),
});

type FetchResultsFormValues = z.infer<typeof formSchema>;

export default function Elo() {
  const t = useTranslations("Elo");
  type TranslationKey = Parameters<typeof t>[0];

  const [formInput, setFormInput] = useState<FetchResultsFormValues>({
    url: "",
    kFactor: "20",
  });

  const hasUrl = !isEmpty(formInput?.url.trim());

  const {
    data: allResults,
    isFetching,
    error,
  } = trpc.fetchTournamentResults.useQuery(
    {
      url: formInput?.url.trim(),
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 10 * 60 * 1000,
      enabled: hasUrl,
      retry: false,
    },
  );

  const playerOptions = (allResults ?? []).map((player) => ({
    value: player.id,
    label: player.name,
  }));

  const form = useForm<FetchResultsFormValues>({
    resolver: zodResolver(fetchTournamentResultsSchema),
    defaultValues: {
      kFactor: "20",
    },
  });

  const [player, kFactor] = form.watch(["player", "kFactor"]);
  const playerResults = allResults?.find((p) => p.id === player);

  const onSubmit = async (input: FetchResultsFormValues) => {
    setFormInput(input);
  };

  const clearForm = () => {
    form.setValue("url", "");
    setFormInput({ ...formInput, url: "" });
  };

  if (error) {
    console.error(error);
  }

  return (
    <section className="grid place-items-center bg-white pb-20 dark:bg-gray-800">
      <div className="max-w-xl px-4 py-8 lg:py-16">
        <h2
          className="mb-10 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("title")}
        </h2>
        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400">
          {t("info")}
        </p>

        {hasUrl && !isFetching && !error && (
          <div className="mx-auto mb-8 flex justify-center">
            <button
              type="button"
              onClick={clearForm}
              className="rounded-lg border border-primary px-3 py-2 text-center text-sm text-primary  hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:focus:ring-primary-800 sm:w-fit"
            >
              {t("enterManualResultsButton")}
            </button>
          </div>
        )}

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-end gap-4">
              <TextField
                name="url"
                label={t("resultsUrlLabel")}
                placeholder={t("resultsUrlLabel")}
              />
              <button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="rounded-lg border border-transparent bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
              >
                {t("fetchResultsButton")}
              </button>
            </div>

            {isFetching && (
              <div className="mt-8 flex justify-center">
                <Spinner />
              </div>
            )}

            {error && (
              <div className="mt-8 text-center text-error">
                {error.message.startsWith("ERR_")
                  ? t(error.message as TranslationKey)
                  : t.rich("unknownError", {
                      contact: (chunks) => (
                        <Link className="underline" href="/contactez-nous">
                          {chunks}
                        </Link>
                      ),
                    })}
              </div>
            )}

            {!isFetching && playerOptions.length > 0 && (
              <div>
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  <SelectField
                    name="player"
                    required
                    label={t("choosePlayerLabel")}
                    placeholder={t("choosePlayerPlaceholder")}
                    options={playerOptions}
                    isClearable={false}
                  />

                  <SelectField
                    name="kFactor"
                    label={t("kFactorLabel")}
                    options={["40", "20", "10"].map((k) => ({
                      value: k,
                      label: k,
                    }))}
                    isClearable={false}
                    required
                  />
                </div>

                <KFactor className="mt-2" />
              </div>
            )}
          </form>
        </FormProvider>

        {hasUrl && !isFetching && player && playerResults && !error && (
          <TournamentResults
            playerId={player}
            kFactor={parseInt(kFactor)}
            results={allResults ?? []}
          />
        )}

        {((!hasUrl && !isFetching) || !!error) && (
          <>
            <div className="relative my-8">
              <div className="absolute top-1/2 z-10 h-[1px] w-full bg-gray-500 dark:bg-gray-400" />
              <div className="relative z-20 mx-auto w-fit bg-white px-2 py-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {t("useManualLabel")}
              </div>
            </div>

            <ManualEloForm />
          </>
        )}
      </div>
    </section>
  );
}
