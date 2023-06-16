interface HamburgerMenuState {
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  hamburgerButtonRef: RefObject<HTMLDivElement>;
}

import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import useHamburgerClose from "@/hooks/useHamburgerClose";

const HamburgerMenu = ({
  menuVisible,
  setMenuVisible,
  hamburgerButtonRef,
}: HamburgerMenuState) => {
  const [mouseOverMenu, setMouseOverMenu] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuTimeout = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuVisible(false);
      setMouseOverMenu(false);
    }, 2000);
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
      className={`absolute top-0 -right-[173px] ${
        menuVisible ? "-translate-x-full" : ""
      } z-[9999] bg-teal-600 flex md:hidden dark:bg-gray-600 transition-transform duration-500 ease-linear`}
      onMouseEnter={handleMouseEnterMenu}
      onMouseLeave={handleMouseLeaveMenu}
    >
      <ul className="list-reset text-white mt-16 p-5">
        <li className="py-5">
          <Link
            href="/tournois"
            className="border-b-2 border-transparent hover:border-white transition-all ease-in-out duration-300"
          >
            Tournois
          </Link>
        </li>
        <li className="py-5">
          <Link
            href="/qui-sommes-nous"
            className="border-b-2 border-transparent hover:border-white transition-all ease-in-out duration-300"
          >
            Qui Sommes-Nous
          </Link>
        </li>
        <li className="py-5">
          <Link
            href="/contactez-nous"
            className="border-b-2 border-transparent hover:border-white transition-all ease-in-out duration-300"
          >
            Contactez-Nous
          </Link>
        </li>
        <li className="py-5">
          <ThemeSwitcher />
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
