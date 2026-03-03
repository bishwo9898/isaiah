import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WorkSection from "@/components/WorkSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <main>
        <WorkSection />
      </main>

      {/* Social Footer */}
      <footer className="border-t border-white/10 px-8 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <div className="text-center">
            <h3 className="text-xs font-inter font-light tracking-[0.3em] uppercase text-white/70 mb-6">
              Follow the work
            </h3>
            <a
              href="https://www.instagram.com/isaiahcalibre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-white/30 text-white font-inter text-sm tracking-[0.2em] uppercase hover:border-white hover:bg-white/5 transition-all duration-300"
            >
              @isaiahcalibre
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
