"use client";

import HamburgerMenu from "@/components/HamburgerMenu";
import { useState } from "react";

const Hamburger = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <div
        className="space-y-2 relative z-[99999]"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <div
          className={`w-8 h-0.5 bg-gray-600 dark:bg-white transition-transform duration-300 ease-in-out ${
            menuVisible ? "rotate-45 translate-y-2.5 translate-x-[1px]" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-0.5 bg-gray-600 dark:bg-white transition-transform duration-300 ease-linear ${
            menuVisible ? "opacity-0 rotate-0 scale-0" : ""
          }`}
        ></div>
        <div
          className={`w-8 h-0.5 bg-gray-600 dark:bg-white transition-transform duration-300 ease-in-out ${
            menuVisible ? "-rotate-45 -translate-y-2.5" : ""
          }`}
        ></div>
      </div>
      {<HamburgerMenu menuVisible={menuVisible} />}
    </>
  );
};

export default Hamburger;
