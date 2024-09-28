import { useTranslations } from "next-intl";

export default function Contact() {
  const t = useTranslations("Privacy");

  return (
    <section className="bg-white pb-20 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2
          className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("title")}
        </h2>

        <div className="prose mt-20 text-gray-500 dark:text-gray-400">
          <h2 className="dark:text-white">1. {t("introTitle")}</h2>
          <p>{t("introInfo")}</p>

          <h2 className="dark:text-white">2. {t("informationTitle")}</h2>
          <p>{t("informationInfo")}</p>

          <h2 className="dark:text-white">3. {t("useTitle")}</h2>
          <p>{t("useInfo")}</p>

          <h2 className="dark:text-white">4. {t("deleteTitle")}</h2>
          <p>{t("deleteInfo")}</p>

          <h2 className="dark:text-white">5. {t("shareTitle")}</h2>
          <p>{t("shareInfo")}</p>

          <h2 className="dark:text-white">6. {t("cookiesTitle")}</h2>
          <p>
            {t.rich("cookiesInfo", {
              link: (str) => (
                <a
                  href="https://tinyanalytics.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {str}
                </a>
              ),
            })}
          </p>

          <h2 className="dark:text-white">7. {t("changesTitle")}</h2>
          <p>{t("changesInfo")}</p>
        </div>
      </div>
    </section>
  );
}
