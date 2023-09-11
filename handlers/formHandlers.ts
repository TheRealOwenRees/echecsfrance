import { Dispatch, FormEvent, SetStateAction } from "react";

import { LatLngLiteral } from "leaflet";
import { useTranslations } from "next-intl";

import { clearMessage } from "@/app/[lang]/components/InfoMessage";
import discordWebhook from "@/lib/discordWebhook";
import sendMail from "@/lib/sendMail";
import tournamentFormToDB from "@/lib/tournamentFormToDB";
import { ResponseMessage, TournamentFormProps } from "@/types";
import { errorLog } from "@/utils/logger";

export const handleClearTournamentForm = (
  formRefs: TournamentFormProps,
  center: LatLngLiteral,
) => {
  Object.values(formRefs).forEach((ref) => {
    if (ref.current) ref.current.value = "";
  });
  formRefs.setPosition(center);
};

export const handleTournamentSubmit = async (
  e: FormEvent<HTMLFormElement>,
  t: ReturnType<typeof useTranslations>,
  setIsSending: Dispatch<SetStateAction<boolean>>,
  setResponseMessage: Dispatch<SetStateAction<ResponseMessage>>,
  formRefs: TournamentFormProps,
) => {
  e.preventDefault();
  setIsSending(true);

  try {
    await discordWebhook(formRefs); // send Discord notification
    await tournamentFormToDB(formRefs); // write to DB
    setIsSending(false);
    setResponseMessage({
      isSuccessful: true,
      message: t("success"),
    });
    clearMessage(setResponseMessage);
  } catch (error) {
    errorLog(error);
    setResponseMessage({
      isSuccessful: false,
      message: t("failure"),
    });
    clearMessage(setResponseMessage);
  } finally {
    setIsSending(false);
  }
};

export const handleEmailSubmit = async (
  e: FormEvent<HTMLFormElement>,
  t: ReturnType<typeof useTranslations>,
  setIsSending: Dispatch<SetStateAction<boolean>>,
  setResponseMessage: Dispatch<SetStateAction<ResponseMessage>>,
  values: Record<string, string>,
  resetForm: () => void,
) => {
  e.preventDefault();
  setIsSending(true);

  try {
    const response = await sendMail(values);
    if (response.status === 250) {
      setResponseMessage({
        isSuccessful: true,
        message: t("success"),
      });

      resetForm();
      clearMessage(setResponseMessage);
      setIsSending(false);
    }
  } catch (error) {
    errorLog(error);
    setResponseMessage({
      isSuccessful: false,
      message: t("failure"),
    });
    clearMessage(setResponseMessage);
    setIsSending(false);
  }
};
