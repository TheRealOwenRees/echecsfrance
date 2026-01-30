import { Metadata } from "next";

import EloClient from "@/app/[locale]/(main)/elo/EloClient";
import { baseUrl } from "@/constants";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale?: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical:
        locale === "fr" ? `${baseUrl}/elo` : `${baseUrl}/${locale}/elo`,
      languages: {
        fr: `${baseUrl}/elo`,
        en: `${baseUrl}/en/elo`,
      },
    },
  };
}

export default function Elo() {
  return <EloClient />;
}
