import { ReactNode } from "react";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="relative min-h-content">{children}</div>
      <Footer />
    </>
  );
}
