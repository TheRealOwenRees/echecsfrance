import { Dispatch, FormEvent, SetStateAction } from "react";
import sendMail from "@/lib/sendMail";
import { errorLog } from "@/utils/logger";

export const handleEmailSubmit = async (
  e: FormEvent<HTMLFormElement>,
  values: Record<string, string>,
  setResponseMessage: Dispatch<
    SetStateAction<{ isSuccessful: boolean; message: string }>
  >,
  resetForm: () => void,
  setIsSending: Dispatch<SetStateAction<boolean>>
) => {
  e.preventDefault();
  setIsSending(true);

  const clearMessage = () => {
    setTimeout(() => {
      setResponseMessage({
        isSuccessful: false,
        message: "",
      });
    }, 10000);
  };

  try {
    const response = await sendMail(values);
    if (response.status === 250) {
      setResponseMessage({
        isSuccessful: true,
        message: "Thank you for your message.",
      });
      resetForm();
      clearMessage();
      setIsSending(false);
    }
  } catch (error) {
    errorLog(error);
    setResponseMessage({
      isSuccessful: false,
      message: "Oops something went wrong. Please try again.",
    });
    clearMessage();
    setIsSending(false);
  }
};
