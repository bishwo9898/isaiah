export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex justify-center items-center gap-16">
          <button className="text-white text-xs font-inter font-light tracking-[0.25em] uppercase hover:text-white/60 transition-all duration-300">
            Home
          </button>
          <button className="text-white text-xs font-inter font-light tracking-[0.25em] uppercase hover:text-white/60 transition-all duration-300">
            Work
          </button>
          <button className="text-white text-xs font-inter font-light tracking-[0.25em] uppercase hover:text-white/60 transition-all duration-300">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
