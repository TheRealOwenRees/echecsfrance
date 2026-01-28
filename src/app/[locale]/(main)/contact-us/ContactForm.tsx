"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/Button";
import InfoMessage from "@/components/InfoMessage";
import { InfoMessageType } from "@/components/InfoMessage";
import { TextAreaField } from "@/components/form/TextAreaField";
import { TextField } from "@/components/form/TextField";
import { contactUsSchema } from "@/schemas";
import { contactUs } from "@/server/contactUs";

type TournamentFormValues = z.infer<typeof contactUsSchema>;

const ContactForm = () => {
  const t = useTranslations("Contact");

  const [responseMessage, setResponseMessage] = useState<{
    type: InfoMessageType;
    message: string;
  } | null>(null);

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(contactUsSchema),
  });

  const onSubmit = async (data: TournamentFormValues) => {
    try {
      await contactUs(data);
      setResponseMessage({
        type: "success",
        message: t("success"),
      });

      form.reset();
    } catch (err: unknown) {
      console.log(err);
      setResponseMessage({
        type: "error",
        message: t("failure"),
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TextField
          name="email"
          control={form.control}
          label={t("emailLabel")}
          aria-label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          required
        />

        <TextField
          name="subject"
          control={form.control}
          label={t("subjectLabel")}
          aria-label={t("subjectLabel")}
          placeholder={t("subjectPlaceholder")}
          required
        />

        <TextAreaField
          name="message"
          control={form.control}
          rows={6}
          label={t("messageLabel")}
          aria-label={t("messageLabel")}
          placeholder={t("messagePlaceholder")}
          required
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? t("sending") : t("sendButton")}
        </Button>

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

export default ContactForm;
