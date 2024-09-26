"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { clearMessage } from "@/components/InfoMessage";
import InfoMessage from "@/components/InfoMessage";
import { TextField } from "@/components/form/TextField";
import { usePathname } from "@/utils/navigation";

const signInSchema = z.object({
  email: z.string().email(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

type SignInFormProps = {
  callbackPath?: string;
};

export const SignInForm = ({ callbackPath }: SignInFormProps) => {
  const t = useTranslations("SignIn");
  const locale = useLocale();
  const path = usePathname();

  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    // Clear the response message when the email field changes
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        if (name === "email" && responseMessage.message === "") {
          setResponseMessage({ isSuccessful: true, message: "" });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, responseMessage.message]);

  const onSubmit = async ({ email }: SignInFormValues) => {
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: callbackPath ?? `/${locale}/${path}`,
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
        isSuccessful: false,
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
  );
};
