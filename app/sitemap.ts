import { MetadataRoute } from "next";

import { locales, pathnames } from "@/utils/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => {
    const prefix = `https://echecsfrance.com${
      locale === "fr" ? "" : `/${locale}`
    }`;

    const paths = Object.keys(pathnames) as Array<keyof typeof pathnames>;

    return paths.map((pathname) => {
      const route = pathnames[pathname];
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
