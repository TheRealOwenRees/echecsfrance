import createMiddleware from "next-intl/middleware";

import { locales, pathnames } from "@/utils/navigation";

export default createMiddleware({
  defaultLocale: "fr",
  locales,
  pathnames,

  localePrefix: "as-needed",
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips certain folders
  // such as "api", and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|robots|sitemap|.*\\..*).*)"],
};
