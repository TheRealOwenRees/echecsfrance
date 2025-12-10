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
import { matchSchema } from "@/schemas";
import { generateFeuilleDeMatch } from "@/server/generateFeuilleDeMatch";
import { Club } from "@/types";

export type MatchFormValues = z.infer<typeof matchSchema>;

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

  const onSubmit = async (data: MatchFormValues) => {
    try {
      await generateFeuilleDeMatch(data);

      // // Destructure the result from the safe action
      // const result = await generateFeuilleDeMatch(data);
      //
      // if (result?.data?.pdfBase64) {
      //   // 1. Convert Base64 to Blob
      //   const byteCharacters = atob(result.data.pdfBase64);
      //   const byteNumbers = new Array(byteCharacters.length);
      //   for (let i = 0; i < byteCharacters.length; i++) {
      //     byteNumbers[i] = byteCharacters.charCodeAt(i);
      //   }
      //   const byteArray = new Uint8Array(byteNumbers);
      //   const blob = new Blob([byteArray], { type: "application/pdf" });
      //
      //   // 2. Create URL
      //   const url = URL.createObjectURL(blob);
      //
      //   // 3. Open in new tab
      //   window.open(url, "_blank");
      // }

      setResponseMessage({
        type: "success",
        message: "generated feuille de match",
      });

      // form.reset(); // do not reset the form
    } catch (err: unknown) {
      console.log(err);

      setResponseMessage({
        type: "error",
        message: "error creating feuille de match",
      });
    }
  };

  const clubOptions = clubs.map((club) => ({
    value: club.name,
    label: club.name,
    url: club.url,
  }));

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 space-y-8">
        <div className="grid grid-cols-6 items-start gap-6">
          <div className="col-span-1">
            <Calendar name="date" control={form.control} label="Date" />
          </div>
          <div className="col-span-2">
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
          <div className="col-span-2">
            <TextField
              name="lieu"
              control={form.control}
              label="Lieu"
              required
            />
          </div>
          <TeamSelection
            clubOptions={clubOptions}
            name="team1"
            label="Team 1"
            className="col-span-3 space-y-4"
          />
          <TeamSelection
            clubOptions={clubOptions}
            name="team2"
            label="Team 2"
            className="col-span-3 space-y-4"
          />
        </div>

        <div className="flex gap-4">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Generating" : "Generate"}
          </Button>

          <Button onClick={() => form.reset()} type="button" intent="secondary">
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
