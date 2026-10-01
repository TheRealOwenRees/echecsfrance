"use client";

import { useEffect } from "react";

import { trackAppRouter } from "@socialgouv/matomo-next";
import { usePathname, useSearchParams } from "next/navigation";

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
const isMatomoEnabled = Boolean(MATOMO_URL && MATOMO_SITE_ID);

export function MatomoAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isMatomoEnabled) return;

    trackAppRouter({
      url: MATOMO_URL as string,
      siteId: MATOMO_SITE_ID as string,
      pathname,
      searchParams,
      enableHeatmapSessionRecording: false,
      enableHeartBeatTimer: true,
      cleanUrl: true,
      disableCookies: true,
      debug: process.env.NODE_ENV === "development",
    });
  }, [pathname, searchParams]);

  return null;
}
