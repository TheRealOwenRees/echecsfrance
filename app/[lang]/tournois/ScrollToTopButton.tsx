"use client";

import { ScrollableElement } from "@/types";

import { FaArrowUp } from "react-icons/fa";
import { handleScrollToTop } from "@/handlers/scrollHandlers";
import { useEffect, useRef, useState } from "react";

const ScrollToTopButton = () => {
  const scrollToTopElementRef = useRef<ScrollableElement | null>(null);
  const [isLgScreen, setIsLgScreen] = useState(false);

  // calculate screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // determine scrollable element based on screen size - window or div
  useEffect(() => {
    isLgScreen
      ? (scrollToTopElementRef.current =
          document.getElementById("tournament-table"))
      : (scrollToTopElementRef.current = window);
  }, [isLgScreen]);

  const scrollToTopButtonClass = isLgScreen
    ? "absolute bottom-0 right-3 p-10"
    : "fixed top-20 right-3";

  return (
    <button
      className={`${scrollToTopButtonClass} z-10 text-2xl text-teal-900 dark:text-white`}
      data-test="scroll-to-top-button"
    >
      <FaArrowUp
        onClick={() => handleScrollToTop(scrollToTopElementRef.current)}
      />
    </button>
  );
};

export default ScrollToTopButton;
