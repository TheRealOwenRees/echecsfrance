import { Dispatch, SetStateAction } from "react";

import { ResponseMessage } from "@/types";

const InfoMessage = ({
  responseMessage,
}: {
  responseMessage: ResponseMessage;
}) => (
  <p
    className={`${
      responseMessage.isSuccessful ? "text-green-600" : "text-red-600"
    } italic`}
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
