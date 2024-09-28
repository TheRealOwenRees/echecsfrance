import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "./utils/navigation";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) notFound();

  return {
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("./messages/en.json")
        : import(`./messages/${locale}.json`))
    ).default,
  };
});
