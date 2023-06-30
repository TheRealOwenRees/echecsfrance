import Link from "next/link";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <header className="grid place-items-center bg-white dark:bg-gray-800">
        <div className="h-full max-w-5xl px-4 pt-8 pb-12 bg-white dark:bg-gray-800">
          <h2
            className="mb-8 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Qui Sommes-Nous?
          </h2>
          <p className="mb-4 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            Ce projet a vu le jour début 2022 afin de permettre une
            visualisation sur une carte des tournois d'échecs en France. Ayant
            déménagé en France en 2019, je ne connaissais alors pas la
            géographie française et je souhaitais savoir quels tournois avaient
            lieu près de chez moi.
          </p>
          <p className="mb-4 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            Le projet a été mis de côté jusqu'au printemps 2023; date à laquelle
            je lui ai redonné vie. Reconstruit à partir de zéro,{" "}
            <Link href="/" className="text-teal-600">
              Echecs France
            </Link>{" "}
            est désormais open source et ouvert aux contributions.
          </p>
          <p className="mb-4 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            Je compte mettre en place un bouton de don en ligne pour ceux qui
            souhaitent participer aux frais associés au site. Une fois les coûts
            de fonctionnement déduits, tous les fonds restant seront redirigés
            vers le monde des échecs soit en sponsorant des événements ou par la
            création de dons.
          </p>
          <h3
            className="mt-8 mb-4 text-2xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Remerciements
          </h3>
          <p className="mb-4 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            Ce projet est ce qu'il est grâce aux contributions de vous tous. Je
            souhaite en particulier remercier les personnes suivantes pour leurs
            contributions:
          </p>
          <ul className="mb-4 text-center text-teal-600">
            <li>
              <Link href="https://github.com/AlvaroNW" target="_blank">
                AlvaroNW
              </Link>
            </li>
            <li>
              <Link href="https://github.com/Florifourchette" target="_blank">
                Florifourchette
              </Link>
            </li>
          </ul>
          <h3
            className="mt-8 mb-4 text-2xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Tech Blurb
          </h3>
          <p className="mb-4 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            <Link href="/" className="text-teal-600">
              Echecs France
            </Link>{" "}
            utilise:
          </p>
          <ul className="mb-4 flex justify-around text-teal-600">
            <li>
              <Link href="https://nextjs.org/" target="_blank">
                NextJS
              </Link>
            </li>
            <li>
              <Link href="#" target="_blank">
                Typescript
              </Link>
            </li>
            <li>
              <Link href="https://tailwindcss.com/" target="_blank">
                Tailwind
              </Link>
            </li>
            <li>
              <Link href="https://mongodb.com/" target="_blank">
                MongoDB
              </Link>
            </li>
          </ul>
          <p className="mb-4 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            avec
          </p>
          <ul className="mb-4 flex justify-around text-teal-600">
            <li>
              <Link href="https://leafletjs.com/" target="_blank">
                Leaflet
              </Link>
            </li>
            <li>
              <Link href="https://nodemailer.com/" target="_blank">
                Nodemailer
              </Link>
            </li>
          </ul>
          <p className="mb-16 font-light text-center text-gray-500 dark:text-gray-400 md:text-xl">
            Pour plus d'informations sur les moyens de contribution, veuillez
            visiter notre{" "}
            <Link
              href="https://github.com/TheRealOwenRees/echecsfrance"
              target="_blank"
              className="text-teal-600"
            >
              GitHub.
            </Link>
          </p>
        </div>
      </header>
    </Layout>
  );
}
