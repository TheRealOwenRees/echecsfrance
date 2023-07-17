import Link from "next-intl/link";
import { FaGithub, FaRegEnvelope } from "react-icons/fa";
import { useTranslations } from "next-intl";
import ThemeSwitcher from "@/app/[lang]/components/ThemeSwitcher";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer
      className="fixed bottom-0 z-30 flex h-20 w-full flex-col items-center justify-center justify-items-center bg-teal-600 px-5 py-2 text-white dark:bg-gray-700"
      data-test="footer"
    >
      <div>
        <p>&copy; {new Date().getFullYear()} - Owen Rees</p>
      </div>

      <div className="flex items-center py-2">
        <Link
          href="https://github.com/TheRealOwenRees/echecsfrance"
          target="_blank"
          aria-label={t("githubAria")}
          className="mr-4"
        >
          <FaGithub />
        </Link>
        <Link
          href="/contactez-nous"
          aria-label={t("contactAria")}
          className="mr-4"
        >
          <FaRegEnvelope />
        </Link>
        <div className="mr-4 space-x-2 text-xs">
          <Link href="/" locale="fr">
            FR
          </Link>
          <span>|</span>
          <Link href="/" locale="en">
            EN
          </Link>
        </div>
        <div className="text-xs">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
