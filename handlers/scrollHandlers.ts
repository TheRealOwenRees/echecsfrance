import { ScrollableElement } from "@/types";

const isBrowser = () => typeof window !== "undefined";

export const handleScrollToTop = (element: ScrollableElement | null) => {
  if (!isBrowser()) return;
  element?.scrollTo({ top: 0, behavior: "smooth" });
};
