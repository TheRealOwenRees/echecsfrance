import createMiddleware from "next-intl/middleware";

import { routing } from "@/utils/navigation";

export default createMiddleware(routing);

export const config = {
  // Skip all paths that should not be internationalized. This example skips certain folders
  // such as "api", and all files with an extension (e.g. favicon.ico)
  matcher: ["/((?!api|_next|robots|sitemap|.*\\..*).*)"],
};
