"use client";

import { FaArrowUp } from "react-icons/fa";
import { handleScrollToTop } from "@/handlers/scrollHandlers";
import { useEffect, useRef } from "react";

const ScrollToTopButton = ({ isLgScreen }: { isLgScreen: boolean }) => {
  const scrollToTopElementRef = useRef<HTMLElement | null>(null);
  // determine scrollable element based on screen size - window or div
  useEffect(() => {
    if (isLgScreen) {
      scrollToTopElementRef.current =
        document.getElementById("tournament-table");
    }
  }, [isLgScreen]);

  const scrollToTopButtonClass = isLgScreen
    ? "absolute bottom-0 right-3 p-10"
    : "fixed top-20 right-3";

  return (
    <button
      className={`${scrollToTopButtonClass} z-10 text-2xl text-teal-900 dark:text-white`}
      data-cy="scroll-to-top-button"
    >
      <FaArrowUp
        onClick={() =>
          handleScrollToTop(scrollToTopElementRef.current || window)
        }
      />
    </button>
  );
};

export default ScrollToTopButton;
