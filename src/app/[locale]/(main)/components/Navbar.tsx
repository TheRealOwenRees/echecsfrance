import { useTranslations } from "next-intl";

import AuthButton from "@/components/AuthButton";
import { Link } from "@/utils/navigation";

import Hamburger from "./Hamburger";

export default function Navbar() {
  const t = useTranslations("Nav");

  const links = [
    { title: t("tournaments"), route: "/tournaments" },
    { title: t("clubs"), route: "/clubs" },
    { title: t("elo"), route: "/elo" },
  ] as const;

  return (
    <nav className="relative mt-0 h-16 w-full overflow-x-clip border-b-[1px] bg-white px-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto flex h-full items-center justify-between">
        <Link
          className="font-extrabold text-gray-900 no-underline hover:no-underline dark:text-white"
          href="/"
        >
          <span className="font-title text-2xl text-gray-800 dark:text-white">
            {t("title")}
          </span>
        </Link>

        <div className="md:hidden" data-test="mobile-menu">
          <Hamburger />
        </div>

        <div className="hidden h-full justify-center md:flex md:w-1/2 md:justify-end">
          <ul className="list-reset flex h-full flex-1 items-center gap-14 text-gray-900 no-underline dark:text-white md:flex-none">
            {links.map(({ title, route }) => (
              <li key={route} className="h-full">
                <Link
                  className="inline-flex h-full items-center border-b-4 border-t-4 border-transparent transition-all duration-300 ease-in-out hover:border-b-primary-600"
                  href={route}
                >
                  {title}
                </Link>
              </li>
            ))}

            <AuthButton />
          </ul>
        </div>
      </div>
    </nav>
  );
}
