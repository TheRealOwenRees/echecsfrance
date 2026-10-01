import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "./utils/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  const locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("./messages/en.json")
        : import(`./messages/${locale}.json`))
    ).default,
  };
});
