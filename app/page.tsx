import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import bgImage from "@/public/images/map-bg.jpg";

export default function Home() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-153px)] md:h-[calc(100%-173px)] place-items-center">
        <div className="relative h-full w-full brightness-[0.2]">
          <Image
            src={bgImage}
            alt="Background image of France"
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="absolute text-center">
          <h1 className="text-5xl p-5">Echecs France</h1>
          <h2 className="text-3xl p-5">
            Trouvez Vos Tournois d&apos;Echecs en France Sur Une Carte
          </h2>
          <h3 className="text-xl p-5 mb-5">
            Une représentation visuelle de tous les tournois d&apos;échecs
            publiés par la{" "}
            <Link href="http://www.echecs.asso.fr/" target="_blank">
              <abbr title="Fédération Française des Échecs">FFE</abbr>
            </Link>
          </h3>
          <Link
            href="/tournois"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Voir La Carte
          </Link>
        </div>
      </header>
    </Layout>
  );
}
