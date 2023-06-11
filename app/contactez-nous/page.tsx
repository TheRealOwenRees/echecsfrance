import Layout from "@/components/Layout";

export default function Contact() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-216px)] md:h-[calc(100%-172px)] place-items-center">
        <div className="relative h-full w-full bg-amber-200"></div>
        <div className="absolute">
          <h1>Contactez-Nous</h1>
        </div>
      </header>
    </Layout>
  );
}
