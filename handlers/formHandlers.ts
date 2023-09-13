import { Dispatch, FormEvent, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { clearMessage } from "@/app/[locale]/components/InfoMessage";
import sendMail from "@/lib/sendMail";
import { ResponseMessage } from "@/types";
import { errorLog } from "@/utils/logger";

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
