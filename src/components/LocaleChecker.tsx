"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

import { setUserLocale } from "@/server/setUserLocale";
import { usePathname, useRouter } from "@/utils/routing";

type LocaleCheckerProps = {
  children?: React.ReactNode;
};

export const LocaleChecker = ({ children }: LocaleCheckerProps) => {
  const { data: sessionData, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  const userLocale = sessionData?.user?.locale;

  useEffect(() => {
    // If the user preference is not set, we set it to the current locale
    if (status === "authenticated" && userLocale === undefined) {
      setUserLocale(locale);
    }

    // If the user is authenticated and has a preferred locale that is different from the user's locale,
    // then we update redirect to the user's preference
    if (
      status === "authenticated" &&
      userLocale !== undefined &&
      userLocale !== locale
    ) {
      router.push({ pathname, params: params as any }, { locale: userLocale });
    }
  }, [locale, sessionData, status]);

  // To avoid flickering, we don't render the children until we have the user's locale
  if (status === "loading") return null;
  if (
    status === "authenticated" &&
    userLocale !== undefined &&
    userLocale !== locale
  )
    return null;

  return children;
};
