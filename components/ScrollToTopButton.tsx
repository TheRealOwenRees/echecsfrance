"use client";

import { FaArrowUp } from "react-icons/fa";
import { handleScrollToTop } from "@/handlers/scrollHandlers";

const ScrollToTopButton = ({ isLgScreen }: { isLgScreen: boolean }) => {
  // determine scrollable element based on screen size - window or div
  const scrollToTopElement = isLgScreen
    ? document.getElementById("tournament-table")
    : window;

  const scrollToTopButtonClass = isLgScreen
    ? "absolute bottom-0 right-3 p-10"
    : "sticky top-20";

  return (
    <button
      className={`${scrollToTopButtonClass} z-10 text-2xl text-teal-900 dark:text-white`}
    >
      <FaArrowUp onClick={() => handleScrollToTop(scrollToTopElement)} />
    </button>
  );
};

export default ScrollToTopButton;
