import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import { FaGithub, FaRegEnvelope } from "react-icons/fa";

import ThemeSwitcher from "./ThemeSwitcher";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer
      className="fixed bottom-0 z-30 flex h-12 w-[100vw] flex-col items-center justify-center justify-items-center bg-primary-600 px-5 py-2 text-white dark:bg-gray-700"
      data-test="footer"
    >
      <div className="flex items-center py-2 hover:[&_a]:opacity-80">
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
        <div className="text-xs hover:opacity-80">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
