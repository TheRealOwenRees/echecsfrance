"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname as useRawPathname } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { InfoMessageType } from "@/components/InfoMessage";
import InfoMessage from "@/components/InfoMessage";
import { TextField } from "@/components/form/TextField";

import { Button } from "./Button";

const signInSchema = z.object({
  email: z.string().email(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

type SignInFormProps = {
  callbackPath?: string;
};

export const SignInForm = ({ callbackPath }: SignInFormProps) => {
  const t = useTranslations("SignIn");

  // We use the version from next/navigation to get the raw pathname in the current locale
  const path = useRawPathname();

  const [responseMessage, setResponseMessage] = useState<{
    type: InfoMessageType;
    message: string;
  } | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    // Clear the response message when the email field changes
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        if (name === "email" && responseMessage !== null) {
          setResponseMessage(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, responseMessage]);

  const onSubmit = async ({ email }: SignInFormValues) => {
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: callbackPath ?? path,
      });

      if (result?.error) {
        throw new Error(result.error);
      } else if (result?.ok) {
        setResponseMessage({
          type: "success",
          message: t("checkEmail"),
        });

        form.reset();
      }
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          name="email"
          type="email"
          control={form.control}
          label={t("emailLabel")}
          placeholder={t("emailPlaceholder")}
          required
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          {t("signInButton")}
        </Button>

        {responseMessage && (
          <InfoMessage
            message={responseMessage.message}
            type={responseMessage.type}
          />
        )}
      </form>
    </FormProvider>
  );
};
