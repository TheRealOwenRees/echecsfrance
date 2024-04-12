"use client";

import { ReactNode } from "react";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { SignInForm } from "@/components/SignInForm";
import { Spinner } from "@/components/Spinner";

export default function ZonesLayout({ children }: { children: ReactNode }) {
  const { data: sessionData, status } = useSession();
  const t = useTranslations("Zones");

  if (status === "loading")
    return (
      <div className="mt-20 flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
      {!sessionData ? (
        <div>
          <h2
            className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            data-test="header2"
          >
            {t("title")}
          </h2>

          <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
            {t("logonRequired")}
          </p>

          <SignInForm />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
