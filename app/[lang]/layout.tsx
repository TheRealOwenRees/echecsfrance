import { Analytics } from "@vercel/analytics/react";
import { Inter, Julius_Sans_One } from "next/font/google";
import { useLocale, NextIntlClientProvider } from "next-intl";
import { getTranslator } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

import "@/css/globals.css";

import Providers from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const title = Julius_Sans_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-title",
});

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const locale = useLocale(); // This hook IS allowed since it's stateless

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
    <html lang={locale} className={`${inter.variable} ${title.variable}`}>
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="bg-white font-sans leading-normal tracking-normal dark:bg-gray-800">
              <Navbar />
              <div className="relative min-h-content">{children}</div>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
