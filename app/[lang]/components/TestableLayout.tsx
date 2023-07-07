import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";

import "@/app/globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

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
        <div className="relative h-content overflow-scroll">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
};

export default TestableLayout;
