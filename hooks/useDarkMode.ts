import { Dispatch, SetStateAction, useEffect, useState } from "react";

function useDarkMode(): [string, Dispatch<SetStateAction<string>>] {
  const prefersDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.theme || (prefersDarkMode ? "dark" : "light")
      : "dark",
  );

  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(theme);

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return [colorTheme, setTheme];
}

export default useDarkMode;
