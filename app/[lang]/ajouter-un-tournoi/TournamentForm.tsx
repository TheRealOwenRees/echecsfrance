"use client";

import { useState } from "react";

import { useAtomValue } from "jotai";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import InfoMessage from "@/app/[lang]/components/InfoMessage";
import LoadingMap from "@/app/[lang]/components/LoadingMap";
import { franceCenterAtom } from "@/app/atoms";
import {
  handleClearTournamentForm,
  handleTournamentSubmit,
} from "@/handlers/formHandlers";
import useTournamentForm from "@/hooks/useTournamentForm";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: LoadingMap,
});

const TournamentForm = () => {
  const t = useTranslations("AddTournament");
  const center = useAtomValue(franceCenterAtom);
  const formRefs = useTournamentForm();

  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    isSuccessful: false,
    message: "",
  });

  return (
    <>
      <form
        onSubmit={(e) =>
          handleTournamentSubmit(
            e,
            t,
            setIsSending,
            setResponseMessage,
            formRefs,
          )
        }
        className="space-y-8"
      >
        <div className="grid grid-cols-4 items-start gap-6">
          <div className="col-span-4">
            <label
              htmlFor="tournament-name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("tournamentNameLabel")}
            </label>
            <input
              ref={formRefs.tournamentNameRef}
              type="text"
              id="tournament-name"
              className="item dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("tournamentNamePlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("dateLabel")}
            </label>
            <input
              ref={formRefs.dateRef}
              type="date"
              id="date"
              className="dark:shadow-sm-light block w-full content-center rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="url"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("urlLabel")}
            </label>
            <input
              ref={formRefs.urlRef}
              type="url"
              id="url"
              placeholder={t("urlPlaceholder")}
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="time-control"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("tcLabel")}
            </label>
            <select
              ref={formRefs.timeControlRef}
              id="time-control"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              defaultValue="Classical"
            >
              <option value="Classical">{t("tcOption1")}</option>
              <option value="Rapid">{t("tcOption2")}</option>
              <option value="Blitz">{t("tcOption3")}</option>
              <option value="Other">{t("tcOption4")}</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="norm"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("normLabel")}
            </label>
            <select
              ref={formRefs.normRef}
              id="norm"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              defaultValue="false"
            >
              <option value="false">{t("normNo")}</option>
              <option value="true">{t("normYes")}</option>
            </select>
          </div>
          <div className="col-span-4">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("addressLabel")}
            </label>
            <input
              ref={formRefs.addressRef}
              type="text"
              id="address"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("addressPlaceholder")}
              required
            />
          </div>
          <div className="col-span-4 sm:col-span-2">
            <label
              htmlFor="town"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("townLabel")}
            </label>
            <input
              ref={formRefs.townRef}
              type="text"
              id="town"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("townPlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("departmentLabel")}
            </label>
            <input
              ref={formRefs.departmentRef}
              type="text"
              id="department"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("departmentPlaceholder")}
              // required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("countryLabel")}
            </label>
            <input
              ref={formRefs.countryRef}
              type="text"
              id="country"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("countryPlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="your-name"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("yourNameLabel")}
            </label>
            <input
              ref={formRefs.yourNameRef}
              type="text"
              id="your-name"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("yourNamePlaceholder")}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="your-email"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("yourEmailLabel")}
            </label>
            <input
              ref={formRefs.yourEmailRef}
              type="email"
              id="your-email"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("yourEmailPlaceholder")}
              required
            />
          </div>
          <div className="col-span-4 row-span-2 sm:col-span-2">
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {t("messageLabel")}
            </label>
            <textarea
              ref={formRefs.messageRef}
              id="message"
              rows={6}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder={t("messagePlaceholder")}
              // required
            ></textarea>
          </div>
          <Map
            position={formRefs.position}
            setPosition={formRefs.setPosition}
            center={center}
          />
        </div>
        <button
          disabled={isSending}
          type="submit"
          className="rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
        >
          {isSending ? t("sending") : t("sendButton")}
        </button>
        <button
          onClick={() => handleClearTournamentForm(formRefs, center)}
          type="button"
          className="ml-4 rounded-lg bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-25 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
        >
          {t("clearForm")}
        </button>
        <InfoMessage responseMessage={responseMessage} />;
      </form>
    </>
  );
};

export default TournamentForm;
