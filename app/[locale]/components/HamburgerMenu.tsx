import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import { burgerMenuIsOpenAtom } from "@/app/atoms";
import { Link } from "@/utils/navigation";

const HamburgerMenu = () => {
  const t = useTranslations("Nav");
  const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useAtom(burgerMenuIsOpenAtom);

  const closeMenu = () => setBurgerMenuIsOpen(false);

  return (
    <div
      className={twMerge(
        "fixed right-0 top-0 z-[9999] h-[calc(100svh-3rem)] w-full",
        "flex items-center justify-center bg-primary-600 transition-transform duration-200 ease-linear dark:bg-gray-600 md:hidden",
        !burgerMenuIsOpen && "translate-x-full",
      )}
    >
      <ul className="list-reset text-white">
        <li className="py-5 text-center text-xl">
          <Link
            onClick={closeMenu}
            href="/tournaments"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("tournaments")}
          </Link>
        </li>

        <li className="py-5 text-center text-xl">
          <Link
            onClick={closeMenu}
            href="/clubs"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("clubs")}
          </Link>
        </li>

        <li className="py-5 text-center text-xl">
          <Link
            onClick={closeMenu}
            href="/elo"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("elo")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
