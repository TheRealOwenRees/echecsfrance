"use client";

import { useState } from "react";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import InfoMessage from "@/components/InfoMessage";
import { deleteAccount } from "@/server/deleteAccount";
import { useRouter } from "@/utils/navigation";

export default function Contact() {
  const t = useTranslations("DeleteAccount");
  const at = useTranslations("App");
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(false);

  const onDeleteAccount = async () => {
    try {
      setDeleting(true);

      const result = await deleteAccount();
      if (result?.validationErrors) {
        throw new Error("ERR_VALIDATION");
      } else if (result?.serverError) {
        throw new Error(result.serverError);
      }

      signOut({ redirect: false });

      setDeleted(true);
    } catch {
      setDeleting(false);
      setError(true);
    }
  };

  return (
    <section className="bg-white pb-20 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2
          className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("title")}
        </h2>

        {deleted ? (
          <InfoMessage
            className="text-center"
            responseMessage={{ isSuccessful: true, message: t("success") }}
          />
        ) : (
          <>
            <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
              {t("info")}
            </p>

            {error && (
              <InfoMessage
                className="mb-8 text-center"
                responseMessage={{ isSuccessful: false, message: t("failure") }}
              />
            )}

            <div className="flex items-center justify-center space-x-4 text-sm font-bold">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-primary px-5 py-3 text-center text-xs text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:focus:ring-primary-800 sm:w-fit"
              >
                {at("cancelButton")}
              </button>

              <button
                onClick={() => onDeleteAccount()}
                disabled={deleting}
                className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
              >
                {t("deleteButton")}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
