import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const HamburgerMenu = ({ menuVisible }: { menuVisible: boolean }) => {
  return (
    <div
      className={`absolute top-0 ${
        menuVisible ? "right-0" : "-right-[173px]"
      } z-[9999] bg-teal-600 flex md:hidden dark:bg-gray-600 transition-all duration-500 ease-linear`}
    >
      <ul className="list-reset text-white mt-16 p-5">
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
