import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Echecs France- Tournois d'Echecs",
  description: "Trouvez Vos Tournois d'Echecs en France Sur Une Carte",
  keywords: "echecs, France, tournoi, tournois, FFE, carte",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
