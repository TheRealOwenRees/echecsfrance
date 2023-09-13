"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import InfoMessage from "@/app/[locale]/components/InfoMessage";
import { handleEmailSubmit } from "@/handlers/formHandlers";
import useContactForm from "@/hooks/useContactForm";

const ContactForm = () => {
  const t = useTranslations("Contact");
  const { values, handleChange, resetForm } = useContactForm();
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  return (
    <>
      <form
        onSubmit={(e) =>
          handleEmailSubmit(
            e,
            t,
            setIsSending,
            setResponseMessage,
            values,
            resetForm,
          )
        }
        className="space-y-8"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {t("emailLabel")}
          </label>
          <input
            value={values.email}
            onChange={handleChange}
            type="email"
            id="email"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder={t("emailPlaceholder")}
            required
            data-test="email-input"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {t("subjectLabel")}
          </label>
          <input
            value={values.subject}
            onChange={handleChange}
            type="text"
            id="subject"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder={t("subjectPlaceholder")}
            required
            data-test="subject-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {t("messageLabel")}
          </label>
          <textarea
            value={values.message}
            onChange={handleChange}
            id="message"
            rows={6}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder={t("messagePlaceholder")}
            data-test="message-input"
            required
          ></textarea>
        </div>
        <button
          disabled={isSending}
          type="submit"
          className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
          data-test="submit-button"
        >
          {isSending ? t("sending") : t("sendButton")}
        </button>
        <InfoMessage responseMessage={responseMessage} />
      </form>
    </>
  );
};

export default ContactForm;
