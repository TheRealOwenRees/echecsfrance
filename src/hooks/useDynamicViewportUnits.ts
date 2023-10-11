export const useDynamicViewportUnits = () => {
  const setVh = function () {
    var svh = document.documentElement.clientHeight * 0.01;
    document.documentElement.style.setProperty("--1svh", svh + "px");
    var dvh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--1dvh", dvh + "px");
  };

  const isMobile = function () {
    if (
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.userAgent.match(/Mac/) &&
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2)
    ) {
      return true;
    }

    return false;
  };

  // SSR support
  if (typeof window === "undefined") {
    return;
  }

  // Don't run polyfill if browser supports the units natively
  if (
    "CSS" in window &&
    "supports" in window.CSS &&
    window.CSS.supports("height: 100svh") &&
    window.CSS.supports("height: 100dvh") &&
    window.CSS.supports("height: 100lvh")
  ) {
    return;
  }

  // Don't run on desktop browsers
  if (!isMobile) {
    return;
  }

  window.addEventListener("resize", setVh);
  setVh();

  return () => {
    window.removeEventListener("resize", setVh);
  };
};
