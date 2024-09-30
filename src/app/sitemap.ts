import { MetadataRoute } from "next";

import { Pathnames, routing } from "@/utils/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => {
    const prefix = `https://echecsfrance.com${
      locale === "fr" ? "" : `/${locale}`
    }`;

    const paths = Object.keys(routing.pathnames) as Array<Pathnames>;

    return paths
      .filter((pathname) => !pathname.includes("["))
      .map((pathname) => {
        const route = routing.pathnames[pathname];
        if (typeof route === "string") {
          return {
            url: `${prefix}${route}`,
            lastModified: new Date(),
          };
        }

        return {
          url: `${prefix}${route[locale]}`,
          lastModified: new Date(),
        };
      });
  });
}
