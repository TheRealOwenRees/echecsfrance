"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import InfoMessage from "@/components/InfoMessage";
import { clearMessage } from "@/components/InfoMessage";
import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
import { contactUsSchema } from "@/schemas";
import { trpc } from "@/utils/trpc";

type TournamentFormValues = z.infer<typeof contactUsSchema>;

const ContactForm = () => {
  const t = useTranslations("Contact");

  const contactUs = trpc.contactUs.useMutation();
  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(contactUsSchema),
  });

  const onSubmit = async (data: TournamentFormValues) => {
    try {
      await contactUs.mutateAsync(data);
      setResponseMessage({
        isSuccessful: true,
        message: t("success"),
      });

      clearMessage(setResponseMessage);
      form.reset();
    } catch (err: unknown) {
      console.log(err);
      setResponseMessage({
        isSuccessful: true,
        message: t("failure"),
      });

      clearMessage(setResponseMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TextField
          name="email"
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          required
        />

        <TextField
          name="subject"
          label={t("subjectLabel")}
          placeholder={t("subjectPlaceholder")}
          required
        />

        <TextAreaField
          name="message"
          rows={6}
          label={t("messageLabel")}
          placeholder={t("messagePlaceholder")}
          required
        />

        <button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
        >
          {form.formState.isSubmitting ? t("sending") : t("sendButton")}
        </button>

        <InfoMessage responseMessage={responseMessage} />
      </form>
    </FormProvider>
  );
};

export default ContactForm;
