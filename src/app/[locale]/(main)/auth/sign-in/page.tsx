"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { clearMessage } from "@/components/InfoMessage";
import InfoMessage from "@/components/InfoMessage";
import { TextField } from "@/components/form/TextField";

const signInSchema = z.object({
  email: z.string().email(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const t = useTranslations("SignIn");
  const locale = useLocale();

  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async ({ email }: SignInFormValues) => {
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: `/${locale}/tournaments`,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else if (result?.ok) {
        setResponseMessage({
          isSuccessful: true,
          message: t("checkEmail"),
        });

        form.reset();
      }
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
    <section className="grid place-items-center bg-white pb-20 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2
          className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("title")}
        </h2>
        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
          {t("info")}
        </p>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TextField
              name="email"
              control={form.control}
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              required
            />

            <button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
            >
              {t("signInButton")}
            </button>

            <InfoMessage
              className="text-center"
              responseMessage={responseMessage}
            />
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
