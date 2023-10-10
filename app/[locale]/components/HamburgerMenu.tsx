import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";

import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import useHamburgerClose from "@/hooks/useHamburgerClose";
import { Link } from "@/utils/navigation";

interface HamburgerMenuState {
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  hamburgerButtonRef: RefObject<HTMLDivElement>;
}

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
      className={twMerge(
        "fixed right-0 top-0 z-[9999] h-[calc(100svh-5rem)] w-full",
        "flex items-center justify-center bg-primary-600 transition-transform duration-200 ease-linear dark:bg-gray-600 md:hidden",
        !menuVisible && "translate-x-full",
      )}
      onMouseEnter={handleMouseEnterMenu}
      onMouseLeave={handleMouseLeaveMenu}
    >
      <ul className="list-reset text-white">
        <li className="py-5 text-center text-xl">
          <Link
            href="/tournaments"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("tournaments")}
          </Link>
        </li>

        <li className="py-5 text-center text-xl">
          <Link
            href="/clubs"
            className="border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-white"
          >
            {t("clubs")}
          </Link>
        </li>

        <li className="py-5 text-center text-xl">
          <Link
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
