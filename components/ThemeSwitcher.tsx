"use client";

import { MdBrightness2, MdCircle } from "react-icons/md";
import useDarkMode from "@/hooks/useDarkMode";
import { useEffect, useState } from "react";
import "@/css/theme-toggle.css";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {colorTheme === "light" ? (
        <div
          className="toggle-dark"
          data-test="toggle-dark"
          onClick={() => setTheme("light")}
        >
          <MdBrightness2 className="theme-icon-dark" />
        </div>
      ) : (
        <div
          className="toggle"
          data-test="toggle"
          onClick={() => setTheme("dark")}
        >
          <MdCircle className="theme-icon" />
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
