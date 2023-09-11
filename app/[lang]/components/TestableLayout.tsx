import { ReactNode } from "react";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import "@/css/globals.css";

import Footer from "./Footer";
import Navbar from "./Navbar";

const TestableLayout = ({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="bg-white font-sans leading-normal tracking-normal dark:bg-gray-800">
        <Navbar />
        <div className="relative min-h-content">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
};

export default TestableLayout;
