"use client";

import HamburgerMenu from "@/components/HamburgerMenu";
import { useState } from "react";

// TODO make hamburger menu slide in from the right instead of conditional rendering
const Hamburger = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <div
        className="space-y-2 relative z-[99999]"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <div className="w-8 h-0.5 bg-gray-600 dark:bg-white"></div>
        <div className="w-8 h-0.5 bg-gray-600 dark:bg-white"></div>
        <div className="w-8 h-0.5 bg-gray-600 dark:bg-white"></div>
      </div>
      {<HamburgerMenu menuVisible={menuVisible} />}
    </>
  );
};

export default Hamburger;
