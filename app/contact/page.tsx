import Layout from "@/components/Layout";

export default function Contact() {
  return (
    <Layout>
      <header className="grid h-[calc(100%-176px)] md:h-[calc(100%-132px)] place-items-center">
        <div className="relative h-full w-full bg-amber-200"></div>
        <div className="absolute">
          <h1>Contact Page</h1>
        </div>
      </header>
    </Layout>
  );
}
