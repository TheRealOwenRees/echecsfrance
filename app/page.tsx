import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-176px)] md:h-[calc(100%-132px)] place-items-center">
        <div className="relative h-full w-full bg-[url('/images/map-bg.jpg')] bg-cover bg-center brightness-[0.2]"></div>
        <div className="absolute text-center">
          <h1 className="text-5xl p-5">Echecs France</h1>
          <h2 className="text-3xl p-5 capitalize">
            Find chess tournaments in France on a map
          </h2>
          <h3 className="text-xl p-5 mb-5">
            A visual representation of all the chess tournaments published by
            the{" "}
            <Link href="http://www.echecs.asso.fr/" target="_blank">
              <abbr title="Fédération Française des Échecs">FFE</abbr>
            </Link>
          </h3>
          <Link
            href="/tournois"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Get Started
          </Link>
        </div>
      </header>
    </Layout>
  );
}
