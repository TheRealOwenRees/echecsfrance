import sendMail from "@/lib/sendMail";
import { Dispatch, FormEvent, SetStateAction } from "react";

export const handleEmailSubmit = async (
  e: FormEvent<HTMLFormElement>,
  values: Record<string, string>,
  setResponseMessage: Dispatch<
    SetStateAction<{ isSuccessful: boolean; message: string }>
  >
) => {
  e.preventDefault();
  try {
    const response = await sendMail(values);
    if (response.status === 250) {
      setResponseMessage({
        isSuccessful: true,
        message: "Thank you for your message.",
      });
    }
  } catch (error) {
    console.log(error);
    setResponseMessage({
      isSuccessful: false,
      message: "Oops something went wrong. Please try again.",
    });
  }
};
