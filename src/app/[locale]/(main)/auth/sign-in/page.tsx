import { Metadata } from "next";

import SignInClient from "@/app/[locale]/(main)/auth/sign-in/SignInClient";
import { baseUrl } from "@/constants";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale?: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical:
        locale === "fr"
          ? `${baseUrl}/auth/sign-in`
          : `${baseUrl}/${locale}/auth/sign-in`,
      languages: {
        fr: `${baseUrl}/auth/sign-in`,
        en: `${baseUrl}/en/auth/sign-in`,
      },
    },
  };
}

export default function SignIn() {
  return <SignInClient />;
}
