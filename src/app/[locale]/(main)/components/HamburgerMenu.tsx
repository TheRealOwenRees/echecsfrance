import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";

import { burgerMenuIsOpenAtom } from "@/atoms";
import { useAuthMenuOptions } from "@/hooks/useAuthMenuOptions";
import { Link } from "@/utils/navigation";

const HamburgerMenu = () => {
  const t = useTranslations("Nav");
  const [burgerMenuIsOpen, setBurgerMenuIsOpen] = useAtom(burgerMenuIsOpenAtom);
  const menuItems = useAuthMenuOptions();

  const closeMenu = () => setBurgerMenuIsOpen(false);

  return (
    <div
      className={twMerge(
        "fixed right-0 top-0 z-[9999] h-[calc(100svh-3rem)] w-full",
        "flex items-center justify-center bg-primary-600 transition-transform duration-200 ease-linear dark:bg-gray-600 md:hidden",
        !burgerMenuIsOpen && "translate-x-full",
      )}
    >
      <ul className="list-reset text-white">
        <li className="py-3 text-center text-xl">
          <Link onClick={closeMenu} href="/tournaments">
            {t("tournaments")}
          </Link>
        </li>

        <li className="py-3 text-center text-xl">
          <Link onClick={closeMenu} href="/clubs">
            {t("clubs")}
          </Link>
        </li>

        <li className="py-3 text-center text-xl">
          <Link onClick={closeMenu} href="/elo">
            {t("elo")}
          </Link>
        </li>

        <hr className="my-5" />

        {menuItems.map(({ title, onClick, className, disabled }, i) => (
          <li key={i} className="py-3 text-center text-xl">
            <button
              type="button"
              disabled={disabled}
              className={className}
              onClick={() => {
                onClick();
                closeMenu();
              }}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HamburgerMenu;
