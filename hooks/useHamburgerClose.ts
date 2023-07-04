interface HamburgerClose {
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  menuRef: RefObject<HTMLDivElement>;
  hamburgerButtonRef: RefObject<HTMLDivElement>;
  mouseOverMenu: boolean;
  setMouseOverMenu: Dispatch<SetStateAction<boolean>>;
  timeoutRef: RefObject<NodeJS.Timeout | undefined>;
  menuTimeout: () => void;
}

import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

const useHamburgerClose = ({
  menuVisible,
  setMenuVisible,
  menuRef,
  hamburgerButtonRef,
  mouseOverMenu,
  setMouseOverMenu,
  timeoutRef,
  menuTimeout,
}: HamburgerClose) => {
  useEffect(() => {
    const handleMouseDownOutsideMenu = (event: MouseEvent) => {
      if (
        menuVisible &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
        setMouseOverMenu(false);
      }
    };

    const handleLinkClick = () => {
      setMenuVisible(false);
    };

    document.addEventListener("mousedown", handleMouseDownOutsideMenu);
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutsideMenu);
    };
  }, [menuVisible]);

  useEffect(() => {
    if (menuVisible && !mouseOverMenu) {
      menuTimeout();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [mouseOverMenu, menuVisible]);
};

export default useHamburgerClose;
