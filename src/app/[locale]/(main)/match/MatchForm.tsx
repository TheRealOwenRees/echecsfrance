"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import Calendar from "@/app/[locale]/(main)/components/Calendar";
import TeamSelection from "@/app/[locale]/(main)/match/components/TeamSelection";
import { Button } from "@/components/Button";
import InfoMessage, { InfoMessageType } from "@/components/InfoMessage";
import { TextField } from "@/components/form/TextField";
import { Player } from "@/interfaces";
import { matchSchema } from "@/schemas";
import { generateFeuilleDeMatch } from "@/server/generateFeuilleDeMatch";
import { Club } from "@/types";

export type MatchFormValues = z.infer<typeof matchSchema>;

type BoardPlayer = Partial<Pick<Player, "elo" | "name" | "nrFFE">>;

interface IProps {
  clubs: Club[];
}

const MatchForm = ({ clubs }: IProps) => {
  const [responseMessage, setResponseMessage] = useState<{
    type: InfoMessageType;
    message: string;
  } | null>(null);

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
  });

  // check 100 point ELO rule
  const checkPlayerOrder = (
    team1Players: BoardPlayer[],
    team2Players: BoardPlayer[],
  ) => {
    function checkOrder(elos: number[]) {
      for (let i = 0; i < elos.length - 1; i++) {
        if (elos[i] < elos[i + 1]) {
          if (elos[i + 1] - elos[i] > 100) {
            return false;
          }
        }
      }
      return true;
    }

    const team1Elos = team1Players
      .filter((player) => player.elo !== "")
      .map((player) => Number(player.elo?.split(" ")[0]));

    const team2Elos = team2Players
      .filter((player) => player.elo !== "")
      .map((player) => Number(player.elo?.split(" ")[0]));

    return !(!checkOrder(team1Elos) || !checkOrder(team2Elos));
  };

  const onSubmit = async (data: MatchFormValues) => {
    try {
      if (!checkPlayerOrder(data.team1_players, data.team2_players)) {
        const confirmResult = confirm(
          "ELO ordering is not correct, please check your players.\nClick 'OK' to continue or 'Cancel' to abort.",
        );

        if (!confirmResult) return false;
      }

      const result = await generateFeuilleDeMatch(data);

      if (result?.data?.pdfBase64) {
        const byteCharacters = atob(result.data.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }

      setResponseMessage({
        type: "success",
        message: "generated feuille de match",
      });
    } catch (err: unknown) {
      console.log(err);

      if (err instanceof Error) {
        setResponseMessage({
          type: "error",
          message: err.message,
        });
      } else {
        setResponseMessage({
          type: "error",
          message: "error creating feuille de match",
        });
      }
    }
  };

  const clubOptions = clubs.map((club) => ({
    value: club.name,
    label: club.name,
    url: club.url,
  }));

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 items-start gap-6">
          <div className="col-span-1">
            <Calendar name="date" control={form.control} label="Date" />
          </div>
          <div className="col-span-3">
            <TextField
              name="lieu"
              control={form.control}
              label="Lieu"
              required
            />
          </div>
          <div className="col-span-3">
            <TextField
              name="competition"
              control={form.control}
              label="Competition"
              required
            />
          </div>
          <div className="col-span-1">
            <TextField
              name="ronde"
              control={form.control}
              label="Ronde"
              type="number"
              required
            />
          </div>

          <TeamSelection
            clubOptions={clubOptions}
            name="team1"
            label="Team 1"
            className="col-span-2 space-y-4"
          />
          <TeamSelection
            clubOptions={clubOptions}
            name="team2"
            label="Team 2"
            className="col-span-2 space-y-4"
          />
        </div>

        <div className="flex gap-4">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Generating" : "Generate"}
          </Button>

          <Button
            onClick={() => {
              form.reset();
            }}
            type="button"
            intent="secondary"
          >
            {"Clear"}
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

export default MatchForm;
