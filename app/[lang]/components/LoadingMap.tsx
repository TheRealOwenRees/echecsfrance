import { useTranslations } from "next-intl";

const LoadingMap = () => {
  const t = useTranslations("Tournaments");
  return (
    <div className="grid h-content place-self-center bg-white text-center text-gray-900 dark:bg-gray-800 dark:text-white">
      <p>{t("loading")}</p>
    </div>
  );
};

export default LoadingMap;
