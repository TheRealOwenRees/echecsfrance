"use client";

import { useEffect, useRef, useState } from "react";

import { FaArrowUp } from "react-icons/fa";

import { handleScrollToTop } from "@/handlers/scrollHandlers";
import { useBreakpoint } from "@/hooks/tailwind";
import { ScrollableElement } from "@/types";

const ScrollToTopButton = () => {
  const scrollToTopElementRef = useRef<ScrollableElement | null>(null);
  const isLgScreen = useBreakpoint("lg");

  // determine scrollable element based on screen size - window or div
  useEffect(() => {
    isLgScreen
      ? (scrollToTopElementRef.current =
          document.getElementById("tournament-table"))
      : (scrollToTopElementRef.current = window);
  }, [isLgScreen]);

  const scrollToTopButtonClass = isLgScreen
    ? "absolute bottom-0 right-3 p-10"
    : "fixed bottom-20 right-3 py-10";

  return (
    <button
      className={`${scrollToTopButtonClass} z-10 text-2xl text-primary-900 dark:text-white`}
      data-test="scroll-to-top-button"
    >
      <FaArrowUp
        onClick={() => handleScrollToTop(scrollToTopElementRef.current)}
      />
    </button>
  );
};

export default ScrollToTopButton;
