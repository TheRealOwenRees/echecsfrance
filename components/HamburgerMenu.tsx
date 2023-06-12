import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const HamburgerMenu = () => {
  return (
    <div className="hamburgerMenu absolute top-16 right-0 z-[9999] bg-teal-600 flex md:hidden dark:bg-gray-600">
      <ul className="list-reset text-white p-5">
        <li className="py-5">
          <Link href="/tournois">Tournois</Link>
        </li>
        <li className="py-5">
          <Link href="/qui-sommes-nous">Qui Sommes-Nous</Link>
        </li>
        <li className="py-5">
          <Link href="/contactez-nous">Contactez-Nous</Link>
        </li>
        <li className="py-5">
          <ThemeSwitcher />
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
