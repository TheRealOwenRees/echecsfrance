import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="grid grid-cols-2 bg-gray-800 text-white p-3">
      <div>
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>
      <div>
        <Link
          href="https://github.com/TheRealOwenRees/echecsfrance"
          target="_blank"
        >
          <FaGithub />
        </Link>
      </div>
    </footer>
  );
}
