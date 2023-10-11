"use client";

import { useAtom } from "jotai";
import { twMerge } from "tailwind-merge";

import { burgerMenuIsOpenAtom } from "@/app/atoms";

import HamburgerMenu from "./HamburgerMenu";

const Hamburger = () => {
  const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useAtom(burgerMenuIsOpenAtom);

  return (
    <>
      <div
        className="hamburger-button relative z-[99999] space-y-2"
        data-test="hamburger-button"
        onClick={() => setBurgerMenuIsOpen(!burgerMenuIsOpen)}
      >
        <div
          className={twMerge(
            "h-0.5 w-8 bg-gray-600 transition-all duration-300 ease-in-out dark:bg-white",
            burgerMenuIsOpen &&
              "translate-x-[1px] translate-y-2.5 rotate-45 bg-white",
          )}
        ></div>
        <div
          className={twMerge(
            "h-0.5 w-8 bg-gray-600 transition-transform duration-300 ease-linear dark:bg-white",
            burgerMenuIsOpen && "scale-0 bg-white opacity-0",
          )}
        ></div>
        <div
          className={twMerge(
            "h-0.5 w-8 bg-gray-600 transition-transform duration-300 ease-in-out dark:bg-white",
            burgerMenuIsOpen && "-translate-y-2.5 -rotate-45 bg-white",
          )}
        ></div>
      </div>

      <HamburgerMenu />
    </>
  );
};

export default Hamburger;
