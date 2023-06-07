import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-2 mt-0 w-full">
      <div className="container mx-auto flex flex-wrap items-center">
        <div className="flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold">
          <Link
            className="text-white no-underline hover:text-white hover:no-underline"
            href="/"
          >
            <span className="text-2xl pl-2">Echecs France</span>
          </Link>
        </div>
        <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
          <ul className="list-reset text-white no-underline flex justify-between flex-1 md:flex-none items-center">
            <li className="mr-3">
              <Link
                className="inline-block hover:text-gray-200 hover:text-underline py-2 px-4"
                href="/tournois"
              >
                Tournois
              </Link>
            </li>
            <li className="mr-3">
              <Link
                className="inline-block hover:text-gray-200 hover:text-underline py-2 px-4"
                href="/about"
              >
                About
              </Link>
            </li>
            <li className="mr-3">
              <Link
                className="inline-block hover:text-gray-200 hover:text-underline py-2 px-4"
                href="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
