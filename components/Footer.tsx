import Link from "next-intl/link";
import { FaGithub, FaRegEnvelope } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer
      className="fixed bottom-0 z-30 grid w-full justify-items-center bg-teal-600 px-5 py-2 text-white dark:bg-gray-700"
      data-test="footer"
    >
      <div className="p-2">
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>
      <div className="flex space-x-4 p-2">
        <Link
          href="https://github.com/TheRealOwenRees/echecsfrance"
          target="_blank"
          aria-label={t("githubAria")}
        >
          <FaGithub />
        </Link>
        <Link href="/contactez-nous" aria-label={t("contactAria")}>
          <FaRegEnvelope />
        </Link>
        <div className="space-x-2 text-xs">
          <Link href="/" locale="fr">
            FR
          </Link>
          <span>|</span>
          <Link href="/" locale="en">
            EN
          </Link>
        </div>
      </div>
    </footer>
  );
}
