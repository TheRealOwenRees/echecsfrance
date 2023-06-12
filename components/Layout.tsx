import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen min-h-[600px] bg-white dark:bg-gray-800 font-sans leading-normal tracking-normal">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
