"use client";

import { MdOutlineDarkMode, MdLightbulbOutline } from "react-icons/md";
import useDarkMode from "@/hooks/useDarkMode";

// TODO write tests for light/mode
// TODO new SVG for light/dark theme
// TODO fix TS error on setTheme
const ThemeSwitcher = () => {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <>
      {colorTheme === "light" ? (
        <MdOutlineDarkMode onClick={() => setTheme("light")} />
      ) : (
        <MdLightbulbOutline onClick={() => setTheme("dark")} />
      )}
    </>
  );
};

export default ThemeSwitcher;
