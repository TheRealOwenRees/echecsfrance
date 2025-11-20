import ClubForm from "@/app/[locale]/(main)/add-club/ClubForm";
import { useTranslations } from "next-intl";

export default function AddClubPage() {
  const t = useTranslations("AddClub");

  return (
    <section className="grid place-items-center bg-white pb-20 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
        <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t("title")}</h2>

        <p className="mb-8 text-center font-light text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
          {t("info")}
        </p>

        <ClubForm />
      </div>
    </section>
  )
}