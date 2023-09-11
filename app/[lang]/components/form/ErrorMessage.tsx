import { useTranslations } from "next-intl";

type ErrorMessageProps = {
  errorMessage: string;
};

export const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  const t = useTranslations();

  type TranslationKey = Parameters<typeof t>[0];

  return errorMessage !== undefined ? (
    <div className="mt-2 font-medium text-orange-700">
      <p>
        {errorMessage.startsWith("FormValidation")
          ? t(errorMessage as TranslationKey)
          : errorMessage}
      </p>
    </div>
  ) : null;
};
