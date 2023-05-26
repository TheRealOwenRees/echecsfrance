import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-64px)] bg-green-400 place-items-center">
        <div>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
        </div>
      </header>
    </Layout>
  );
}
