import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-64px)] place-items-center">
        <div className="relative h-full w-full bg-[url('/images/map-bg.jpg')] brightness-[0.2]"></div>
        <div className="absolute z-10">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
        </div>
      </header>
    </Layout>
  );
}
