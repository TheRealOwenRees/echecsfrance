interface HamburgerMenuState {
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  hamburgerButtonRef: RefObject<HTMLDivElement>;
}

import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import Link from "next-intl/link";
import { useTranslations } from "next-intl";

import useHamburgerClose from "@/hooks/useHamburgerClose";

const HamburgerMenu = ({
  menuVisible,
  setMenuVisible,
  hamburgerButtonRef,
}: HamburgerMenuState) => {
  const t = useTranslations("Nav");
  const [mouseOverMenu, setMouseOverMenu] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuTimeout = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuVisible(false);
      setMouseOverMenu(false);
    }, 4000);
  };

  const handleMouseEnterMenu = () => {
    setMouseOverMenu(true);
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeaveMenu = () => {
    setMouseOverMenu(false);
    clearTimeout(timeoutRef.current);
  };

  useHamburgerClose({
    menuVisible,
    setMenuVisible,
    menuRef,
    hamburgerButtonRef,
    mouseOverMenu,
    setMouseOverMenu,
    timeoutRef,
    menuTimeout,
  });

  return (
    <div
      ref={menuRef}
      className={`fixed right-0 top-0 ${
        menuVisible ? "" : "translate-x-full"
      } z-[9999] flex bg-teal-600 transition-transform duration-200 ease-linear dark:bg-gray-600 md:hidden`}
      onMouseEnter={handleMouseEnterMenu}
      onMouseLeave={handleMouseLeaveMenu}
    >
      <ul className="list-reset mt-16 p-5 text-white">
        <li className="py-5">
          <Link
            href="/tournois"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("tournaments")}
          </Link>
        </li>
        <li className="py-5">
          <Link
            href="/qui-sommes-nous"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("about")}
          </Link>
        </li>
        <li className="py-5">
          <Link
            href="/contactez-nous"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("contact")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
