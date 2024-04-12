import { useTranslations } from "next-intl";

import { Spinner } from "./Spinner";

const LoadingMap = () => {
  const t = useTranslations("Tournaments");
  return (
    <div className="mt-20 flex h-content justify-center bg-white pt-20 text-center text-gray-900 dark:bg-gray-800 dark:text-white">
      <Spinner />
    </div>
  );
};

export default LoadingMap;
