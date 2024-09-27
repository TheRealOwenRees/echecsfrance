"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, sortBy } from "lodash";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ErrorBox";
import { Spinner } from "@/components/Spinner";
import { TranslatedError } from "@/components/TranslatedError";
import { SelectField } from "@/components/form/SelectField";
import { TournamentSelectField } from "@/components/form/TournamentSelectField";
import { fetchTournamentResultsSchema } from "@/schemas";
import { fetchTournamentResults } from "@/server/fetchTournamentResults";
import { SearchedTournament } from "@/server/searchTournaments";
import { TimeControl } from "@/types";
import { Link } from "@/utils/navigation";

import { KFactor } from "./KFactor";
import { ManualEloForm } from "./ManualEloForm";
import { TournamentResults } from "./TournamentResults";

const kFactors = ["40", "20", "10"];

const formSchema = fetchTournamentResultsSchema.extend({
  tournamentId: z.string().optional(),
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
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );
  const [tournament, setTournament] = useState<SearchedTournament | null>(null);

  const tournamentId = searchParams.get("tId") ?? "";
  const kFactorParam = searchParams.get("k");
  const player = searchParams.get("player") ?? "";

  const kFactor =
    kFactorParam && kFactors.includes(kFactorParam) ? kFactorParam : "20";

  const hasTournamentId = !isEmpty(tournamentId.trim());

  const {
    data: allResults,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["fetchTournamentResults", { id: tournamentId?.trim() }],
    queryFn: async () => fetchTournamentResults({ id: tournamentId?.trim() }),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    enabled: hasTournamentId,
    retry: false,
  });

  const playerOptions = sortBy(
    (allResults?.data ?? []).map((player) => ({
      value: player.id,
      label: player.name,
    })),
    "label",
  );

  const form = useForm<FetchResultsFormValues>({
    resolver: zodResolver(fetchTournamentResultsSchema),
    defaultValues: {
      tournamentId: tournamentId ?? "",
      kFactor: kFactor ?? "20",
      player: player ?? "",
    },
  });

  const clearForm = useCallback(() => {
    current.delete("tId");
    current.delete("k");
    current.delete("player");

    form.setValue("tournamentId", "");
    form.setValue("kFactor", "20");
    form.setValue("player", "");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }, [current, form, pathname, router]);

  useEffect(() => {
    // We subscribe to form changes and update the URL parameters
    const subscription = form.watch((value, { name, type }) => {
      let update = false;
      if (type === "change") {
        if (
          name === "tournamentId" &&
          value.tournamentId !== tournamentId &&
          value.tournamentId
        ) {
          current.set("tId", value.tournamentId);
          update = true;
        } else if (
          name === "tournamentId" &&
          value.tournamentId !== tournamentId &&
          value.tournamentId === null
        ) {
          clearForm();
        } else if (
          name === "player" &&
          value.player !== player &&
          value.player
        ) {
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
  }, [
    clearForm,
    current,
    form,
    form.watch,
    kFactor,
    pathname,
    player,
    router,
    tournamentId,
  ]);

  useEffect(() => {
    // When the URL changes, we update the form values
    if (tournamentId !== form.getValues("tournamentId")) {
      form.setValue("tournamentId", tournamentId);
    }

    if (player !== form.getValues("player")) {
      form.setValue("player", player);
    }

    if (kFactor !== form.getValues("kFactor")) {
      form.setValue("kFactor", form.getValues("kFactor"));
    }
  }, [searchParams, form, player, kFactor, tournamentId]);

  const playerResults = allResults?.data?.find((p) => p.id === player);

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

        {hasTournamentId && !isFetching && !error && (
          <div className="mx-auto mb-8 flex justify-center">
            <button
              type="button"
              onClick={clearForm}
              className="rounded-lg border border-primary px-3 py-2 text-center text-sm text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:focus:ring-primary-800 sm:w-fit"
            >
              {t("enterManualResultsButton")}
            </button>
          </div>
        )}

        <FormProvider {...form}>
          <form className="space-y-8">
            <TournamentSelectField
              name="tournamentId"
              control={form.control}
              placeholder={t("searchTournamentPlaceholder")}
              noOptionsMessage={() => t("noTournamentsFound")}
              onInformChange={(tournaments) => {
                setTournament(tournaments?.[0]?.data ?? null);
              }}
            />

            {isFetching && (
              <div className="mt-8 flex justify-center">
                <Spinner />
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

        {hasTournamentId &&
          !isFetching &&
          player &&
          playerResults &&
          !error && (
            <TournamentResults
              playerId={player}
              kFactor={parseInt(kFactor)}
              results={allResults?.data ?? []}
              tournament={tournament}
            />
          )}

        {(!!error || allResults?.serverError) && (
          <ErrorBox
            error={<TranslatedError err={error ?? allResults?.serverError} />}
          />
        )}

        {((!hasTournamentId && !isFetching) || !!error) && (
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
