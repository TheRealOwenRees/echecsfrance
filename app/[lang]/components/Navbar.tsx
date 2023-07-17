import Link from "next-intl/link";
import { useTranslations } from "next-intl";

import Hamburger from "./Hamburger";

export default function Navbar() {
  const t = useTranslations("Nav");

  const links = [
    { title: t("tournaments"), route: "/tournois" },
    { title: t("about"), route: "/qui-sommes-nous" },
    { title: t("contact"), route: "/contactez-nous" },
  ];

  return (
    <nav
      className="relative mt-0 h-16 w-full overflow-x-clip border-b-[1px] bg-white px-5 dark:border-gray-700 dark:bg-gray-800"
      data-test="navbar"
    >
      <div className="container mx-auto flex h-full items-center">
        <div className="flex w-full justify-center font-extrabold md:w-1/2 md:justify-start">
          <Link
            className="text-gray-900 no-underline hover:no-underline dark:text-white"
            href="/"
          >
            <span className="font-title text-2xl text-gray-800 dark:text-white">
              {t("title")}
            </span>
          </Link>
        </div>
        <div className="pb-2 md:hidden" data-test="mobile-menu">
          <Hamburger />
        </div>

        <div
          className="hidden h-full justify-center md:flex md:w-1/2 md:justify-end"
          data-test="desktop-menu"
        >
          <ul className="list-reset flex h-full flex-1 items-center justify-around text-gray-900 no-underline dark:text-white md:flex-none">
            {links.map(({ title, route }) => (
              <li key={route} className="mr-10 h-full">
                <Link
                  className="inline-flex h-full items-center border-b-4 border-t-4 border-transparent transition-all duration-300 ease-in-out hover:border-b-primary-600"
                  href={route}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
