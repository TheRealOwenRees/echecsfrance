"use client";

import { last } from "lodash";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import { getNewRating } from "@/utils/eloCalculator";
import { TournamentResultsData } from "@/utils/trpc";

type TournamentResultsProps = {
  results: TournamentResultsData;
  playerId: string;
  kFactor: number;
};

export const TournamentResults = ({
  results,
  playerId,
  kFactor,
}: TournamentResultsProps) => {
  const t = useTranslations("Elo");

  const playerResults = results?.find((p) => p.id === playerId);
  if (!playerResults) {
    return null;
  }

  type Deltas = {
    rating: number;
    deltas: {
      rating: number;
      delta: number | undefined;
      opponentName: string | null;
      opponentElo: number | null;
      result: number | null;
      lostByForfeit: boolean;
      wonByForfeit: boolean;
      estimated: boolean;
      national: boolean;
      colour: string;
    }[];
  };

  const currentElo = playerResults.elo;

  const calculations = !Number.isNaN(currentElo)
    ? (playerResults.results ?? []).reduce<Deltas>(
        (acc, game) => {
          const info = {
            opponentName: game.opponent,
            opponentElo: game.elo,
            lostByForfeit: game.lostByForfeit,
            wonByForfeit: game.wonByForfeit,
            estimated: game.estimated,
            national: game.national,
            colour: game.colour,
            result: game.result,
          };

          if (
            !game.wonByForfeit &&
            !game.lostByForfeit &&
            !game.estimated &&
            !game.national &&
            game.result !== null
          ) {
            const { delta } = getNewRating(
              currentElo!,
              game.elo!,
              game.result as 1 | 0 | 0.5,
              kFactor,
            );
            return {
              rating: acc.rating + delta,
              deltas: [
                ...acc.deltas,
                { rating: acc.rating + delta, delta, ...info },
              ],
            };
          }

          return {
            rating: acc.rating,
            deltas: [
              ...acc.deltas,
              { rating: acc.rating, delta: undefined, ...info },
            ],
          };
        },
        { rating: currentElo!, deltas: [] },
      )
    : { rating: currentElo!, deltas: [] };

  const deltas = calculations.deltas;
  const totalDelta = Math.round(
    deltas.reduce((acc, delta) => acc + (delta.delta ?? 0), 0),
  );

  const noChangeCount = (deltas ?? []).filter(
    ({ wonByForfeit, lostByForfeit, estimated, national }) =>
      wonByForfeit || lostByForfeit || estimated || national,
  ).length;

  if (playerResults.estimated || playerResults.national)
    return <div className="my-8 text-center text-error">{t("needRating")}</div>;

  return (
    <>
      <div className="my-8 text-gray-900 dark:text-neutral-400">
        {t("initialRating", { rating: Math.round(playerResults.elo) })}
      </div>

      <table className="mt-8 w-full">
        <tbody>
          {deltas.map((delta, i) => {
            const { estimated, national, lostByForfeit, wonByForfeit } = delta;
            const opponentElo = delta.opponentElo
              ? ` (${delta.opponentElo} ${
                  estimated ? "E" : national ? "N" : "F"
                })`
              : "";

            const opponentName = delta.opponentName ? (
              <span>
                <span className="whitespace-nowrap font-bold">
                  {delta.opponentName}
                </span>
                {opponentElo}
              </span>
            ) : (
              "-"
            );

            const playedWhite = delta.colour === "white";

            const whitePlayer = playedWhite ? playerResults.name : opponentName;
            const blackPlayer = !playedWhite
              ? playerResults.name
              : opponentName;
            const noChange =
              wonByForfeit || lostByForfeit || estimated || national;

            const forfeit = delta.opponentName === null;

            let result = "";
            if (wonByForfeit) {
              result = t("wonByForfeit");
            } else if (lostByForfeit) {
              result = t("lostByForfeit");
            } else if (delta.result === 0.5) {
              result = t("draw");
            } else if (
              (playedWhite && delta.result === 1) ||
              (!playedWhite && delta.result === 0)
            ) {
              result = t("whiteWin");
            } else result = t("blackWin");

            return (
              <tr key={i} className="text-gray-900 dark:text-neutral-400">
                {forfeit ? (
                  <td className="pb-2">{t("forfeit")}</td>
                ) : (
                  <td className="pb-2">
                    {whitePlayer}
                    {t("vs")}
                    {blackPlayer}
                  </td>
                )}
                <td className="whitespace-nowrap px-2 pb-2 text-center">
                  {!forfeit && result}
                </td>
                <td className="pb-2 text-right">
                  {noChange ? (
                    "-"
                  ) : (
                    <span
                      className={twMerge(
                        deltas[i].delta! > 0 && "text-success",
                        deltas[i].delta! < 0 && "text-error",
                      )}
                    >
                      {deltas[i]!.delta! >= 0 ? "+" : ""}
                      {deltas[i].delta!}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {noChangeCount > 0 && (
        <div className="mt-4 rounded border border-gray-500 p-4 text-center text-gray-500 dark:border-neutral-400 dark:text-neutral-400">
          {t("noChangeInfo", { noChangeCount })}
        </div>
      )}

      {deltas.length > 0 && (
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
    </>
  );
};
