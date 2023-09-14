"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { de } from "date-fns/locale";
import { isEmpty, isNil, isNumber } from "lodash";
import { useTranslations } from "next-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { IoAdd, IoCloseOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";

const getNewRating = (
  rating: number,
  opponentRating: number,
  result: 1 | 0 | 0.5,
  kFactor: number,
) => {
  const myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - rating) / 400));
  const delta =
    Math.round((kFactor * (result - myChanceToWin) + Number.EPSILON) * 100) /
    100;

  return {
    delta,
    newRating: Math.round((rating + delta + Number.EPSILON) * 100) / 100,
  };
};

const resultsSchema = z.object({
  currentElo: z.number().int().positive(),
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

export default function Elo() {
  const t = useTranslations("Elo");

  const form = useForm<EloFormValues>({
    resolver: zodResolver(resultsSchema),
    defaultValues: {
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

  const onSubmit = async (data: EloFormValues) => {};

  const [currentElo, kFactor, games] = form.watch([
    "currentElo",
    "kFactor",
    "games",
  ]);

  type Deltas = {
    rating: number;
    deltas: { rating: number; delta: number | undefined }[];
  };

  const calculations = !Number.isNaN(currentElo)
    ? (games ?? []).reduce<Deltas>(
        (acc, game) => {
          if (!Number.isNaN(game?.opponentElo) && game?.result) {
            const result =
              game?.result === "win" ? 1 : game?.result === "loss" ? 0 : 0.5;

            const { delta, newRating } = getNewRating(
              acc.rating,
              game.opponentElo!,
              result,
              parseInt(kFactor!, 10),
            );

            return {
              rating: newRating,
              deltas: [...acc.deltas, { rating: newRating, delta }],
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

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              <TextField
                name="currentElo"
                label={t("currentEloLabel")}
                placeholder={t("currentEloPlaceholder")}
                type="number"
                required
              />

              <SelectField
                name="kFactor"
                label={t("kFactorLabel")}
                options={["40", "20", "10"].map((k) => ({
                  value: k,
                  label: k,
                }))}
                required
              />
            </div>

            <h3 className="my-4 text-lg text-gray-900 dark:text-white">
              {t("resultsTitle")}
            </h3>

            <div className="flex w-full flex-col gap-6 sm:gap-2">
              {gameFields.map((game, i) => {
                return (
                  <div key={i} className="flex w-full flex-col">
                    <div key={i} className="flex w-full items-center space-x-2">
                      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                        <TextField
                          name={`games.${i}.opponentElo`}
                          placeholder={t("opponentEloPlaceholder")}
                          type="number"
                          required
                        />

                        <div className="flex items-center space-x-2">
                          <SelectField
                            name={`games.${i}.result`}
                            placeholder={t("gameResultPlaceholder")}
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
                        {Math.round(deltas[i]!.rating)} (
                        <span
                          className={twMerge(
                            deltas[i].delta! > 0 && "text-success",
                            deltas[i].delta! < 0 && "text-error",
                          )}
                        >
                          {deltas[i]!.delta! >= 0 ? "+" : ""} {deltas[i].delta!}
                        </span>
                        )
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
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

        <div></div>
      </div>
    </section>
  );
}
