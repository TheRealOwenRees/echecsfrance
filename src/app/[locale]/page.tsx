import { useTranslations } from "next-intl";
import Image from "next/image";
import { GiTrophyCup } from "react-icons/gi";
import { GrLineChart } from "react-icons/gr";
import { HiUserGroup } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import bannerImage from "/public/banner.jpeg";
import { Link } from "@/utils/routing";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="min-h-[100vh] bg-white pb-40 dark:bg-gray-800">
      <div className="relative mb-20 max-h-[400px]">
        <Image
          src={bannerImage}
          alt="banner"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "400px",
            objectFit: "cover",
          }}
        />

        <div
          className={twMerge(
            "absolute",
            "left-5 top-[50%] max-w-[50%] -translate-y-[50%]",
            "sm:left-10",
            "md:left-15",
          )}
        >
          <h1
            className={twMerge(
              "mb-2 font-title text-2xl/6 font-bold text-white",
              "sm:text-4xl",
              "md:text-5xl",
            )}
            data-test="header1"
          >
            {t("title")}
          </h1>
          <p className={twMerge("text-sm", "sm:text-lg", "md:text-xl")}>
            {t("purpose")}
          </p>
        </div>

        <div className="absolute -bottom-[2px] w-full text-white dark:text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="auto"
            viewBox="0 0 1440 128"
          >
            <path
              fill="currentColor"
              d="M0,471 L1440,471 L1440,386.338583 C1331.33333,357.446194 1239,343 1163,343 C821.995497,343 821.995497,463.944882 426,463.944882 C262.447846,463.944882 120.447846,438.076115 0,386.338583 L0,471 Z"
              transform="translate(0 -343)"
            />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 text-black dark:text-white sm:px-10">
        <div
          className={twMerge(
            "grid gap-8",
            "grid-rows-[repeat(3,1fr)]",
            "md:grid-cols-[repeat(3,1fr)] md:grid-rows-[auto_min-content_1fr_max-content]",
          )}
        >
          <section
            className={twMerge(
              "row-span-4 grid gap-4",
              // We use subgrid if possible to align the sections horizontally, falling back to a grid
              "grid-rows-[auto_min-content_1fr_max-content]",
              "grid-rows-[subgrid] gap-2",
            )}
          >
            <div className="flex items-center justify-center text-5xl">
              <GiTrophyCup />
            </div>
            <h2 className="text-center text-2xl font-semibold">
              {t("tournamentsTitle")}
            </h2>

            <p className="">{t("tournamentsInfo")}</p>

            <Link
              href="/tournaments"
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
            >
              {t("tournamentsLink")}
            </Link>
          </section>

          <section
            className={twMerge(
              "row-span-4 grid gap-4",
              // We use subgrid if possible to align the sections horizontally, falling back to a grid
              "grid-rows-[auto_min-content_1fr_max-content]",
              "grid-rows-[subgrid] gap-2",
            )}
          >
            <div className="flex items-center justify-center text-5xl">
              <HiUserGroup />
            </div>
            <h2 className="text-center text-2xl font-semibold">
              {t("clubsTitle")}
            </h2>
            <p className="">{t("clubsInfo")}</p>

            <Link
              href="/clubs"
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
            >
              {t("clubsLink")}
            </Link>
          </section>

          <section
            className={twMerge(
              "row-span-4 grid gap-4",
              // We use subgrid if possible to align the sections horizontally, falling back to a grid
              "grid-rows-[auto_min-content_1fr_max-content]",
              "grid-rows-[subgrid] gap-2",
            )}
          >
            <div className="flex items-center justify-center text-5xl">
              <GrLineChart />
            </div>
            <h2 className="text-center text-2xl font-semibold">
              {t("eloTitle")}
            </h2>
            <p className="">{t("eloInfo")}</p>

            <Link
              href="/elo"
              className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
            >
              {t("calculatorLink")}
            </Link>
          </section>
        </div>

        <hr className="my-10" />

        <div className="text-center italic">
          {t.rich("getInvolved", {
            link: (str) => (
              <a
                target="_blank"
                className="text-primary hover:bg-primary-700"
                rel="noopener noreferrer"
                href="https://github.com/TheRealOwenRees/echecsfrance"
              >
                {str}
              </a>
            ),
          })}
        </div>
      </div>
    </div>
  );
}
