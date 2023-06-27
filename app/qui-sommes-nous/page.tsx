import Link from "next/link";
import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-216px)] md:h-[calc(100%-174px)] place-items-center">
        <div className="h-full px-4 pt-8 pb-12 bg-white dark:bg-gray-800">
          <h2
            className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Qui Sommes-Nous?
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            This project was first started in early 2022 as a means to visualise
            where chess tournaments were taking place in France. Having moved to
            France in 2019, I did not know my way around the country and wanted
            to know which tournaments were happening near me.
          </p>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            The project was shelved until Spring 2023 when it was given a new
            lease of life. Rebuilt from the ground up,{" "}
            <Link href="/" className="text-teal-600">
              Echecs France
            </Link>{" "}
            is now open source and open to contributions.
          </p>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            I will be setting up a donation link if you wish to help cover some
            of the costs of running this website. After costs, and remaining
            funds will put back into the chess community by means of sponsoring
            events or by donations.
          </p>
          <h3
            className="mb-4 text-2xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Credits
          </h3>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            This project is what it is thanks to the contributions of the wider
            community. In particular I would like to thank the following for
            their contributions so far:
            <ul className="text-teal-600">
              <li>
                <Link href="#" target="_blank">
                  Alvaro
                </Link>
              </li>
              <li>
                <Link href="#" target="_blank">
                  Flo
                </Link>
              </li>
            </ul>
          </p>
          <h3
            className="mb-4 text-2xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Tech Blurb
          </h3>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            <Link href="/" className="text-teal-600">
              Echecs France
            </Link>{" "}
            is built on the following tech stack:
            <ul className="flex justify-around text-teal-600">
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
          </p>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            with the following core dependencies:
            <ul className="flex justify-around text-teal-600">
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
          </p>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            For more information and details on how to contribute, please visit
            our{" "}
            <Link
              href="https://github.com/TheRealOwenRees/echecsfrance"
              target="_blank"
              className="text-teal-600"
            >
              GitHub repository
            </Link>
          </p>
          .
        </div>
      </header>
    </Layout>
  );
}
