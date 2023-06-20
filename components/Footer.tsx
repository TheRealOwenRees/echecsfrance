import Link from "next/link";
import { FaGithub, FaRegEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="grid w-full fixed bottom-0 justify-items-center py-2 px-5 text-white bg-teal-600 text-gray-900 dark:bg-gray-700 z-30"
      data-cy="footer"
    >
      <div className="p-2">
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>
      <div className="flex p-2 space-x-4">
        <Link
          href="https://github.com/TheRealOwenRees/echecsfrance"
          target="_blank"
        >
          <FaGithub />
        </Link>
        <Link href="/contactez-nous">
          <FaRegEnvelope />
        </Link>
      </div>
    </footer>
  );
}
