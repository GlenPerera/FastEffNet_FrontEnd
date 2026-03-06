// app/(public)/layout.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children} {/* This is where your page.tsx content will be injected */}
      </main>
      <Footer />
    </div>
  );
}