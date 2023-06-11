import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-216px)] md:h-[calc(100%-172px)] place-items-center">
        <div className="relative h-full w-full bg-amber-200"></div>
        <div className="absolute">
          <h1>Qui Sommes-Nous</h1>
        </div>
      </header>
    </Layout>
  );
}
