"use client";

import { MdBrightness2, MdCircle } from "react-icons/md";
import useDarkMode from "@/hooks/useDarkMode";
import { useEffect, useState} from 'react'

// TODO write tests for light/mode
// TODO fix TS error on setTheme
const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted) {
    return null;
  }

  return (
    <div>
      {colorTheme === "light" ? (
        <div className="toggle-dark" onClick={() => setTheme("light")}>
          <MdBrightness2 className="theme-icon-dark"  />
        </div>
        
      ) : (
        <div className="toggle" onClick={() => setTheme("dark")}>
          <MdCircle className="theme-icon"  />
        </div>
        
      )}
    </div>
  );
};

export default ThemeSwitcher;
