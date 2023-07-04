import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { useLocale, NextIntlClientProvider } from "next-intl";
import { getTranslator } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale?: string };
}) {
  // While the `locale` is required, the namespace is optional and
  // identical to the parameter that `useTranslations` accepts.
  const t = await getTranslator(locale ?? "fr", "Metadata");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale?: string };
}) {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.locale !== undefined && params.locale !== locale) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}