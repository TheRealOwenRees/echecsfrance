import { Dispatch, SetStateAction } from "react";

import { twMerge } from "tailwind-merge";

import { ResponseMessage } from "@/types";

const InfoMessage = ({
  responseMessage,
  className,
}: {
  responseMessage: ResponseMessage;
  className?: string;
}) => (
  <p
    className={twMerge(
      "italic",
      responseMessage.isSuccessful ? "text-green-600" : "text-red-600",
      className,
    )}
    data-test="info-message"
  >
    {responseMessage.message}
  </p>
);

export const clearMessage = (
  setResponseMessage: Dispatch<SetStateAction<ResponseMessage>>,
) => {
  setTimeout(() => {
    setResponseMessage({
      isSuccessful: false,
      message: "",
    });
  }, 10000);
};

export default InfoMessage;
