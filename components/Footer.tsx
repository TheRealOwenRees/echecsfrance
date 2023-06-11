import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="grid justify-items-center bg-gray-800 text-white py-2 px-5">
      <div className="p-2">
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>
      <div className="p-2">
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
