import Navbar from "@/components/Navbar";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white font-sans leading-normal tracking-normal">
      <Navbar />
      {children}
    </div>
  );
}
