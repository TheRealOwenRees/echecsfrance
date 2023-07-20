"use client";

import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import HamburgerMenu from "./HamburgerMenu";

const Hamburger = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const hamburgerButtonRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={hamburgerButtonRef}
        className="hamburger-button relative z-[99999] space-y-2"
        data-test="hamburger-button"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <div
          className={twMerge(
            "h-0.5 w-8 bg-gray-600 transition-all duration-300 ease-in-out dark:bg-white",
            menuVisible &&
              "translate-x-[1px] translate-y-2.5 rotate-45 bg-white",
          )}
        ></div>
        <div
          className={twMerge(
            "h-0.5 w-8 bg-gray-600 transition-transform duration-300 ease-linear dark:bg-white",
            menuVisible && "scale-0 bg-white opacity-0",
          )}
        ></div>
        <div
          className={twMerge(
            "h-0.5 w-8 bg-gray-600 transition-transform duration-300 ease-in-out dark:bg-white",
            menuVisible && "-translate-y-2.5 -rotate-45 bg-white",
          )}
        ></div>
      </div>

      <HamburgerMenu
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        hamburgerButtonRef={hamburgerButtonRef}
      />
    </>
  );
};

export default Hamburger;
