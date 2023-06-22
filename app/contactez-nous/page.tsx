import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";

// TODO fix page sizing
export default function Contact() {
  return (
    <Layout>
      <section className="grid  place-items-center bg-white dark:bg-gray-800">
        <div className="pt-8 pb-32 lg:pt-16 px-4 mx-auto max-w-screen-md">
          <h2
            className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white"
            data-test="header2"
          >
            Contactez-Nous
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            Vous souhaitez ajouter les tournois de votre fédération sur ce site?
            Vous avez un problème technique? Vous aimeriez participer à ce
            projet? Contactez-nous.
          </p>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
}
