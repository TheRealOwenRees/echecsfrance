"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { handleEmailSubmit } from "@/handlers/formSubmitHandlers";
import useContactForm from "@/hooks/useContactForm";

const ContactForm = () => {
  const t = useTranslations("Contact");
  const { values, handleChange, resetForm } = useContactForm();
  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const infoMessage = (
    <p
      className={`${
        responseMessage.isSuccessful ? "text-green-600" : "text-red-600"
      } italic`}
      data-test="info-message"
    >
      {responseMessage.message}
    </p>
  );

  return (
    <>
      <form
        onSubmit={(e) =>
          handleEmailSubmit(
            e,
            values,
            setResponseMessage,
            resetForm,
            setIsSending
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
            className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="nom@exemple.com"
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
            className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
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
            className="focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder={t("messagePlaceholder")}
            data-test="message-input"
            required
          ></textarea>
        </div>
        <button
          disabled={isSending}
          type="submit"
          className="hover:bg-primary-800 focus:ring-primary-300 dark:hover:bg-primary-700 dark:focus:ring-primary-800 rounded-lg bg-teal-600 px-5 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 disabled:opacity-25 dark:text-white sm:w-fit"
          data-test="submit-button"
        >
          {isSending ? t("sending") : t("sendButton")}
        </button>
        {infoMessage}
      </form>
    </>
  );
};

export default ContactForm;
