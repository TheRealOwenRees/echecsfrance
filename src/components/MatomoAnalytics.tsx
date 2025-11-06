"use client";

import { trackAppRouter } from "@socialgouv/matomo-next";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

export function MatomoAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackAppRouter({
      url: MATOMO_URL || "",
      siteId: MATOMO_SITE_ID || "",
      pathname,
      searchParams, // Pass URLSearchParams object directly
      // Optional: Enable additional features
      enableHeatmapSessionRecording: false,
      enableHeartBeatTimer: true,
      cleanUrl: true,
      disableCookies: true,
      debug: process.env.NODE_ENV === "development",
    });
  }, [pathname, searchParams]);

  return null;
}