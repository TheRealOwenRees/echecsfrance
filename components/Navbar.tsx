import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Hamburger from "@/components/Hamburger";

export default function Navbar() {
  return (
    <nav className="w-full relative border-b-[1px] pt-5 mt-0 px-5 md:pt-2 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto flex items-center">
        <div className="pb-3 justify-center flex w-full md:w-1/2 md:pb-0 md:justify-start font-extrabold">
          <Link
            className="text-gray-900 dark:text-white no-underline hover:no-underline"
            href="/"
          >
            <span className="text-2xl">Echecs France</span>
          </Link>
        </div>
        <div className="pb-2 md:hidden">
          <Hamburger />
        </div>

        <div className="hidden pt-2 justify-center md:flex md:w-1/2 md:justify-end">
          <ul className="list-reset text-gray-900 dark:text-white no-underline flex flex-1 justify-around md:flex-none items-center">
            <li className="mr-10">
              <Link
                className="inline-block border-b-4 py-5 border-transparent hover:border-teal-600 transition-all ease-in-out duration-300"
                href="/tournois"
              >
                Tournois
              </Link>
            </li>
            <li className="mr-10">
              <Link
                className="inline-block border-b-4 py-5 border-transparent hover:border-teal-600 transition-all ease-in-out duration-300"
                href="/qui-sommes-nous"
              >
                Qui Sommes-Nous
              </Link>
            </li>
            <li className="mr-10">
              <Link
                className="inline-block border-b-4 py-5 border-transparent hover:border-teal-600 transition-all ease-in-out duration-300"
                href="/contactez-nous"
              >
                Contactez-Nous
              </Link>
            </li>
            <li>
              <ThemeSwitcher />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
