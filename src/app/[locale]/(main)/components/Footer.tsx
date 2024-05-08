"use client";

import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { FaGithub, FaRegEnvelope } from "react-icons/fa";

import { burgerMenuIsOpenAtom } from "@/atoms";
import { Link, usePathname } from "@/utils/navigation";

import ThemeSwitcher from "./ThemeSwitcher";

export default function Footer() {
  const t = useTranslations("Footer");
  const setBurgerMenuIsOpen = useSetAtom(burgerMenuIsOpenAtom);
  const pathname = usePathname();

  return (
    <footer
      className="fixed bottom-0 z-30 flex h-12 w-[100vw] flex-col items-center justify-center justify-items-center bg-primary-600 px-5 py-2 text-white dark:bg-gray-700"
      data-test="footer"
    >
      <div
        className="flex items-center py-2 hover:[&_a]:opacity-80"
        onClick={() => setBurgerMenuIsOpen(false)}
      >
        <a
          href="https://github.com/TheRealOwenRees/echecsfrance"
          target="_blank"
          aria-label={t("githubAria")}
          className="mr-4"
        >
          <FaGithub />
        </a>
        <Link href="/contact-us" aria-label={t("contactAria")} className="mr-4">
          <FaRegEnvelope />
        </Link>
        <div className="mr-4 space-x-2 text-xs">
          <Link href={pathname} locale="fr">
            FR
          </Link>
          <span>|</span>
          <Link href={pathname} locale="en">
            EN
          </Link>
        </div>
        <div className="text-xs hover:opacity-80">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
