import Link from "next-intl/link";
import { useTranslations } from "next-intl";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import Hamburger from "@/components/Hamburger";

export default function Navbar() {
  const t = useTranslations("Nav");

  return (
    <nav
      className="relative mt-0 w-full overflow-x-clip border-b-[1px] bg-white px-5 pt-5 dark:border-gray-700 dark:bg-gray-800 md:pt-2"
      data-test="navbar"
    >
      <div className="container mx-auto flex items-center">
        <div className="flex w-full justify-center pb-3 font-extrabold md:w-1/2 md:justify-start md:pb-0">
          <Link
            className="text-gray-900 no-underline hover:no-underline dark:text-white"
            href="/"
          >
            <span className="text-2xl">{t("title")}</span>
          </Link>
        </div>
        <div className="pb-2 md:hidden" data-test="mobile-menu">
          <Hamburger />
        </div>

        <div
          className="hidden justify-center pt-2 md:flex md:w-1/2 md:justify-end"
          data-test="desktop-menu"
        >
          <ul className="list-reset flex flex-1 items-center justify-around text-gray-900 no-underline dark:text-white md:flex-none">
            <li className="mr-10">
              <Link
                className="inline-block border-b-4 border-transparent py-5 transition-all duration-300 ease-in-out hover:border-teal-600"
                href="/tournois"
              >
                {t("competitions")}
              </Link>
            </li>
            <li className="mr-10">
              <Link
                className="inline-block border-b-4 border-transparent py-5 transition-all duration-300 ease-in-out hover:border-teal-600"
                href="/qui-sommes-nous"
              >
                {t("about")}
              </Link>
            </li>
            <li className="mr-10">
              <Link
                className="inline-block border-b-4 border-transparent py-5 transition-all duration-300 ease-in-out hover:border-teal-600"
                href="/contactez-nous"
              >
                {t("contact")}
              </Link>
            </li>
            <li>
              <ThemeSwitcher />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
