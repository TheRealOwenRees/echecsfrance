"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import TeamSelection from "@/app/[locale]/(main)/match/components/TeamSelection";
import { matchSchema } from "@/schemas";
import { Club } from "@/types";

type MatchFormValues = z.infer<typeof matchSchema>;

interface IProps {
  clubs: Club[];
}

const MatchForm = ({ clubs }: IProps) => {
  const form = useForm<MatchFormValues>({
    // resolver: zodResolver(addTournamentSchema),
    // defaultValues: {
    //   tournament: {
    //     norm_tournament: false,
    //     coordinates: [47.0844, 2.3964],
    //   },
    // },
  });

  const onSubmit = async (data: MatchFormValues) => {
    try {
      console.log(data);
      // await addTournament(data);
      // setResponseMessage({
      //   type: "success",
      //   message: t("success"),
      // });

      form.reset();
    } catch (err: unknown) {
      console.log(err);
      //
      // setResponseMessage({
      //   type: "error",
      //   message: t("failure"),
      // });
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
        <div className="grid grid-cols-4 items-start gap-6">
          <TeamSelection
            clubOptions={clubOptions}
            name="team1"
            label="Team 1"
          />
          <TeamSelection
            clubOptions={clubOptions}
            name="team2"
            label="Team 2"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};

export default MatchForm;
