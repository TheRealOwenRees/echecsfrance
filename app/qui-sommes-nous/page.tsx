import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-216px)] md:h-[calc(100%-174px)] place-items-center">
        <div className="relative h-full w-full bg-white dark:bg-gray-800"></div>
        <div className="absolute">
          <h2
            className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Qui Sommes-Nous?
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            Prochainement
          </p>
        </div>
      </header>
    </Layout>
  );
}
