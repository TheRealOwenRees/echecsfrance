import { useTranslations } from "next-intl";

import ContactForm from "./ContactForm";

export default function Contact() {
  const t = useTranslations("Contact");

  return (
    <section className="bg-white pb-20 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2
          className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("title")}
        </h2>
        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
          {t("info")}
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
