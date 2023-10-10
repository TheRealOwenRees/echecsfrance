"use client";

import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, sortBy } from "lodash";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const kFactors = ["40", "20", "10"];

const formSchema = fetchTournamentResultsSchema.extend({
  player: z.string().optional(),
  kFactor: z.string(),
});

type FetchResultsFormValues = z.infer<typeof formSchema>;

export default function Elo() {
  const t = useTranslations("Elo");
  type TranslationKey = Parameters<typeof t>[0];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  const url = searchParams.get("url") ?? "";
  const kFactorParam = searchParams.get("k");
  const player = searchParams.get("player") ?? "";

  const kFactor =
    kFactorParam && kFactors.includes(kFactorParam) ? kFactorParam : "20";

  const hasUrl = !isEmpty(url.trim());

  const {
    data: allResults,
    isFetching,
    error,
  } = trpc.fetchTournamentResults.useQuery(
    {
      url: url?.trim(),
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 10 * 60 * 1000,
      enabled: hasUrl,
      retry: false,
    },
  );

  const playerOptions = sortBy(
    (allResults ?? []).map((player) => ({
      value: player.id,
      label: player.name,
    })),
    "label",
  );

  const form = useForm<FetchResultsFormValues>({
    resolver: zodResolver(fetchTournamentResultsSchema),
    defaultValues: {
      url: url ?? "",
      kFactor: kFactor ?? "20",
      player: player ?? "",
    },
  });

  const onSubmit = async (input: FetchResultsFormValues) => {
    current.set("url", input.url);
    if (input.kFactor) current.set("k", input.kFactor);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Push the new URL
    router.push(`${pathname}${query}`);
  };

  const clearForm = () => {
    current.delete("url");
    current.delete("k");
    current.delete("player");

    form.setValue("url", "");
    form.setValue("kFactor", "20");
    form.setValue("player", "");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  useEffect(() => {
    // We subscribe to form changes and update the URL parameters
    const subscription = form.watch((value, { name, type }) => {
      let update = false;
      if (type === "change") {
        if (name === "player" && value.player !== player && value.player) {
          current.set("player", value.player);
          update = true;
        } else if (
          name === "kFactor" &&
          value.kFactor !== kFactor &&
          value.kFactor
        ) {
          current.set("k", value.kFactor);
          update = true;
        }

        if (update) {
          const search = current.toString();
          const query = search ? `?${search}` : "";
          router.replace(`${pathname}${query}`);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, kFactor, player]);

  useEffect(() => {
    // When the URL changes, we update the form values
    if (url !== form.getValues("url")) {
      form.setValue("url", url);
    }

    if (player !== form.getValues("player")) {
      form.setValue("player", player);
    }

    if (kFactor !== form.getValues("kFactor")) {
      form.setValue("kFactor", form.getValues("kFactor"));
    }
  }, [searchParams, form]);

  if (error) {
    console.error(error);
  }

  const playerResults = allResults?.find((p) => p.id === player);

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
                control={form.control}
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
                    control={form.control}
                    required
                    label={t("choosePlayerLabel")}
                    placeholder={t("choosePlayerPlaceholder")}
                    options={playerOptions}
                    isClearable={false}
                  />

                  <SelectField
                    name="kFactor"
                    control={form.control}
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
