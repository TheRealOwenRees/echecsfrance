import isNil from "lodash/isNil";
import { useTranslations } from "next-intl";

import { Path } from "@/types";

type TranslatedErrorProps = {
  err: unknown;
};

export const TranslatedError = ({ err }: TranslatedErrorProps) => {
  const t = useTranslations("Errors");

  if (isNil(err)) {
    return null;
  }

  let error: string | undefined;

  if (typeof err === "string") {
    error = err;
  }

  if (isNil(error) && err instanceof Error) {
    error = err.message;
  }

  if (isNil(error)) {
    error = "ERR_UNEXPECTED";
  }

  if (error?.startsWith("ERR_")) {
    return t(error as Path<IntlMessages["Errors"]>);
  }

  return <span>{error}</span>;
};
