import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type hamburgerMenuState = {
  menuVisible: boolean;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
  hamburgerButtonRef: RefObject<HTMLDivElement>;
};

const HamburgerMenu = ({
  menuVisible,
  setMenuVisible,
  hamburgerButtonRef,
}: hamburgerMenuState) => {
  const [mouseOverMenu, setMouseOverMenu] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const menuRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("mousedown", handleMouseDownOutsideMenu);

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutsideMenu);
    };
  }, [menuVisible]);

  useEffect(() => {
    if (menuVisible && !mouseOverMenu) {
      menuTimeout();
    } else {
      clearTimeout(timeoutRef.current);
    }
  }, [mouseOverMenu, menuVisible]);

  const handleMouseEnterMenu = () => {
    setMouseOverMenu(true);
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeaveMenu = () => {
    setMouseOverMenu(false);
    clearTimeout(timeoutRef.current);
  };

  const menuTimeout = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuVisible(false);
      setMouseOverMenu(false);
    }, 2000);
  };

  return (
    <div
      ref={menuRef}
      className={`absolute top-0 -right-[173px] ${
        menuVisible ? "-translate-x-full" : ""
      } z-[9999] bg-teal-600 flex md:hidden dark:bg-gray-600 transition-transform duration-500 ease-linear`}
      onMouseEnter={handleMouseEnterMenu}
      onMouseLeave={handleMouseLeaveMenu}
    >
      <ul className="list-reset text-white mt-16 p-5">
        <li className="py-5">
          <Link
            href="/tournois"
            className="border-b-2 border-transparent hover:border-white transition-all ease-in-out duration-300"
          >
            Tournois
          </Link>
        </li>
        <li className="py-5">
          <Link
            href="/qui-sommes-nous"
            className="border-b-2 border-transparent hover:border-white transition-all ease-in-out duration-300"
          >
            Qui Sommes-Nous
          </Link>
        </li>
        <li className="py-5">
          <Link
            href="/contactez-nous"
            className="border-b-2 border-transparent hover:border-white transition-all ease-in-out duration-300"
          >
            Contactez-Nous
          </Link>
        </li>
        <li className="py-5">
          <ThemeSwitcher />
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
