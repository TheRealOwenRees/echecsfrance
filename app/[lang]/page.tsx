import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import bgImage from "@/public/images/map-bg.jpg";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <header className="relative flex h-content items-center justify-center">
      <div className="absolute h-full w-full brightness-[0.2]">
        <Image
          src={bgImage}
          alt="Background image of France"
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="z-10 text-center text-white">
        <h1 className="p-5 font-title text-5xl" data-test="header1">
          {t("title")}
        </h1>
        <h2 className="p-5 text-3xl">{t("purpose")}</h2>
        <h3 className="mb-5 p-5 text-xl">
          {t.rich("how", {
            link: (chunks) => (
              <Link href="http://www.echecs.asso.fr/" target="_blank">
                <abbr title="Fédération Française des Échecs">{chunks}</abbr>
              </Link>
            ),
          })}
        </h3>
        <Link
          href="/tournois"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
        >
          {t("mapLink")}
        </Link>
      </div>
    </header>
  );
}
