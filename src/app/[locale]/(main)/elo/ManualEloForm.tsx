"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, isNil, last } from "lodash";
import { useTranslations } from "next-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { IoAdd, IoCloseOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { RadioGroupField } from "@/components/form/RadioGroupField";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import useFormPersist from "@/hooks/useFormPersist";
import { getNewRating } from "@/utils/eloCalculator";

import { KFactor } from "./KFactor";

const resultsSchema = z.object({
  currentElo: z.number().int().positive().nullish(),
  kFactor: z.enum(["40", "30", "20", "15", "10"]),
  games: z.array(
    z.object({
      opponentElo: z.number().int().positive(),
      result: z.enum(["win", "draw", "loss"]),
    }),
  ),
});

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type EloFormValues = DeepPartial<z.infer<typeof resultsSchema>>;

export const ManualEloForm = () => {
  const t = useTranslations("Elo");

  const form = useForm<EloFormValues>({
    resolver: zodResolver(resultsSchema),
    defaultValues: {
      currentElo: null,
      kFactor: "20",
      games: [{}],
    },
  });

  const {
    fields: gameFields,
    append: appendGame,
    remove: removeGame,
  } = useFieldArray({
    control: form.control,
    name: "games",
  });

  useFormPersist("manualElo", {
    watch: form.watch,
    setValue: form.setValue,
    storage: window.localStorage,
  });

  const onSubmit = async (data: EloFormValues) => {};

  const [currentElo, kFactor, games] = form.watch([
    "currentElo",
    "kFactor",
    "games",
  ]);

  const isDefault =
    isEmpty(currentElo) &&
    kFactor === "20" &&
    games?.length === 1 &&
    (isEmpty(games[0]) ||
      (isEmpty(games[0]?.opponentElo) && isEmpty(games[0]?.result)));

  type Deltas = {
    rating: number;
    deltas: { rating: number; delta: number | undefined }[];
  };

  const calculations = !Number.isNaN(currentElo)
    ? (games ?? []).reduce<Deltas>(
        (acc, game) => {
          if (
            !isNil(game?.opponentElo) &&
            !Number.isNaN(game?.opponentElo) &&
            game?.result
          ) {
            const result =
              game?.result === "win" ? 1 : game?.result === "loss" ? 0 : 0.5;

            const { delta } = getNewRating(
              currentElo!,
              game.opponentElo!,
              result,
              parseInt(kFactor!, 10),
            );
            return {
              rating: acc.rating + delta,
              deltas: [...acc.deltas, { rating: acc.rating + delta, delta }],
            };
          }

          return {
            rating: acc.rating,
            deltas: [...acc.deltas, { rating: acc.rating, delta: undefined }],
          };
        },
        { rating: currentElo!, deltas: [] },
      )
    : { rating: currentElo!, deltas: [] };

  const deltas = calculations.deltas;
  const hasDeltas = deltas.some((d) => d.delta !== undefined);
  const totalDelta = Math.round(
    deltas.reduce((acc, delta) => acc + (delta.delta ?? 0), 0),
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="currentElo"
            control={form.control}
            label={t("currentEloLabel")}
            placeholder={t("currentEloPlaceholder")}
            type="number"
            required
          />

          <SelectField
            name="kFactor"
            control={form.control}
            label={t("yourKFactorLabel")}
            options={["40", "20", "10"].map((k) => ({
              value: k,
              label: k,
            }))}
            isClearable={false}
            required
          />
        </div>

        <KFactor className="mt-2" />

        <h3 className="my-4 text-lg text-gray-900 dark:text-white">
          {t("resultsTitle")}
        </h3>

        <div className="flex w-full flex-col gap-6 sm:gap-2">
          {gameFields.map((game, i) => {
            return (
              <div key={game.id} className="flex w-full flex-col">
                <div className="flex w-full items-center space-x-2">
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      name={`games.${i}.opponentElo`}
                      control={form.control}
                      placeholder={t("opponentEloPlaceholder")}
                      type="number"
                      required
                    />

                    <div className="flex items-center space-x-2">
                      <RadioGroupField
                        name={`games.${i}.result`}
                        control={form.control}
                        options={["win", "draw", "loss"].map((result) => ({
                          value: result,
                          label: t("gameResult", { result }),
                        }))}
                        required
                      />
                      {gameFields.length > 1 && (
                        <button
                          className="hidden h-8 w-8 items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-600 dark:hover:bg-neutral-700 sm:flex"
                          type="button"
                          onClick={() => removeGame(i)}
                        >
                          <IoCloseOutline className="h-6 w-6 text-gray-900 transition-all duration-200 hover:text-primary dark:text-neutral-400 hover:dark:text-white" />
                        </button>
                      )}
                    </div>
                  </div>

                  {gameFields.length > 1 && (
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-600 dark:hover:bg-neutral-700 sm:hidden"
                      type="button"
                      onClick={() => removeGame(i)}
                    >
                      <IoCloseOutline className="h-6 w-6 text-gray-900 transition-all duration-200 hover:text-primary dark:text-neutral-400 hover:dark:text-white" />
                    </button>
                  )}
                </div>

                {deltas[i]?.delta !== undefined && (
                  <div
                    className={twMerge(
                      "mt-2 flex justify-end text-gray-900 dark:text-neutral-400",
                      gameFields.length > 1 && "mr-10",
                      i === deltas.length - 1 && "font-bold",
                    )}
                  >
                    <span
                      className={twMerge(
                        deltas[i].delta! > 0 && "text-success",
                        deltas[i].delta! < 0 && "text-error",
                      )}
                    >
                      {deltas[i]!.delta! >= 0 ? "+" : ""}
                      {deltas[i].delta!}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {hasDeltas && (
          <div className="mt-8 text-right text-lg font-bold text-gray-900 dark:text-neutral-400">
            {t.rich("finalRating", {
              rating: Math.round(last(deltas)!.rating),
              delta: () => (
                <span
                  className={twMerge(
                    totalDelta! > 0 && "text-success",
                    totalDelta! < 0 && "text-error",
                  )}
                >
                  {totalDelta >= 0 ? "+" : ""}
                  {totalDelta}
                </span>
              ),
            })}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          {!isDefault && (
            <button
              onClick={() => {
                form.reset();
              }}
              type="button"
              className="px-5 py-3 text-center text-sm font-medium text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:text-primary-700 dark:focus:ring-primary-800 sm:w-fit"
            >
              {t("clearButton")}
            </button>
          )}
          <button
            onClick={() => {
              appendGame({});
            }}
            type="button"
            className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
          >
            <IoAdd className="mr-2 inline-block h-5 w-5" />
            {t("addGameButton")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
