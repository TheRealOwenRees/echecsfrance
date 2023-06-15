"use client";

import { MdBrightness2, MdCircle } from "react-icons/md";
import useDarkMode from "@/hooks/useDarkMode";
import { useEffect, useState } from "react";

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
          className="relative cursor-pointer h-8 w-12 rounded-[50px] margin-auto bg-gradient-to-r from-blue-900 to-purple-900"
          onClick={() => setTheme("light")}
        >
          <MdBrightness2 className="ml-auto h-8 w-5" />
        </div>
      ) : (
        <div
          className="relative cursor-pointer h-8 w-12 rounded-[50px] margin-auto bg-gradient-to-r from-teal-300 to-sky-500"
          onClick={() => setTheme("dark")}
        >
          <MdCircle className="ml-1 h-8 w-5 text-yellow-300" />
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
