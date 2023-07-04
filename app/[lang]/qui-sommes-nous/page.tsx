import Link from "next-intl/link";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");

  return (
    <header className="mb-16 grid place-items-center bg-white dark:bg-gray-800">
      <div className="h-full max-w-5xl bg-white px-4 pt-8 lg:pt-16 dark:bg-gray-800">
        <h2
          className="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("title")}
        </h2>
        <p className="mb-4 text-center font-light text-gray-500 dark:text-gray-400 md:text-xl">
          {t("p1")}
        </p>
        <p className="mb-4 text-center font-light text-gray-500 dark:text-gray-400 md:text-xl">
          {t.rich("p2", {
            homeLink: (chunks) => (
              <Link href="/" className="text-teal-600">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p className="mb-4 text-center font-light text-gray-500 dark:text-gray-400 md:text-xl">
          {t("p3")}
        </p>
        <h3
          className="mb-4 mt-8 text-center text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("thanksTitle")}
        </h3>
        <ul className="mb-4 text-center text-teal-600">
          <li>
            <Link href="https://github.com/timothyarmes" target="_blank">
              timothyarmes
            </Link>
          </li>
          <li>
            <Link href="https://github.com/AlvaroNW" target="_blank">
              AlvaroNW
            </Link>
          </li>
          <li>
            <Link href="https://github.com/Florifourchette" target="_blank">
              Florifourchette
            </Link>
          </li>
        </ul>
        <h3
          className="mb-4 mt-8 text-center text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          data-test="header2"
        >
          {t("techTitle")}
        </h3>
        <p className="mb-4 text-center font-light text-gray-500 dark:text-gray-400 md:text-xl">
          {t.rich("techInfo", {
            homeLink: (chunks) => (
              <Link href="/" className="text-teal-600">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <ul className="mb-4 flex justify-around text-teal-600">
          <li>
            <Link href="https://nextjs.org/" target="_blank">
              NextJS
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank">
              Typescript
            </Link>
          </li>
          <li>
            <Link href="https://tailwindcss.com/" target="_blank">
              Tailwind
            </Link>
          </li>
          <li>
            <Link href="https://mongodb.com/" target="_blank">
              MongoDB
            </Link>
          </li>
        </ul>
        <p className="mb-4 text-center font-light text-gray-500 dark:text-gray-400 md:text-xl">
          {t("techWith")}
        </p>
        <ul className="mb-4 flex justify-around text-teal-600">
          <li>
            <Link href="https://leafletjs.com/" target="_blank">
              Leaflet
            </Link>
          </li>
          <li>
            <Link href="https://nodemailer.com/" target="_blank">
              Nodemailer
            </Link>
          </li>
        </ul>
        <p className="text-center font-light text-gray-500 dark:text-gray-400 md:text-xl">
          {t.rich("contribInfo", {
            link: (chunks) => (
              <Link
                href="https://github.com/TheRealOwenRees/echecsfrance"
                target="_blank"
                className="text-teal-600"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </header>
  );
}
