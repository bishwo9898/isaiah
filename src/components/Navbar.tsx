"use client";

import Link from "next/link";

export default function Navbar() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToWork = () => {
    const workSection = document.getElementById("work-section");
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5">
        <div className="flex justify-center items-center gap-8 sm:gap-12 md:gap-16">
          <button
            onClick={scrollToTop}
            className="text-white text-[10px] sm:text-xs font-inter font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:text-white/60 transition-all duration-300"
          >
            Home
          </button>
          <button
            onClick={scrollToWork}
            className="text-white text-[10px] sm:text-xs font-inter font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:text-white/60 transition-all duration-300"
          >
            Work
          </button>
          <Link
            href="/contact"
            className="text-white text-[10px] sm:text-xs font-inter font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase hover:text-white/60 transition-all duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
