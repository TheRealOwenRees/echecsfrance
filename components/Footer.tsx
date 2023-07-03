import Link from "next/link";
import { FaGithub, FaRegEnvelope } from "react-icons/fa";
export default function Footer() {
  return (
    <footer
      className="grid w-full fixed bottom-0 justify-items-center py-2 px-5 text-white bg-teal-600 dark:bg-gray-700 z-30"
      data-test="footer"
    >
      <div className="p-2">
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>
      <div className="flex p-2 space-x-4">
        <Link
          href="https://github.com/TheRealOwenRees/echecsfrance"
          target="_blank"
          aria-label="Lien vers le dépôt GitHub"
        >
          <FaGithub />
        </Link>
        <Link href="/contactez-nous" aria-label="Contactez-nous">
          <FaRegEnvelope />
        </Link>
      </div>
    </footer>
  );
}
