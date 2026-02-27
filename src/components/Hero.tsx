export default function Hero() {
  return (
    <section className="relative h-[68vh] md:h-[72vh] lg:h-[76vh] w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/retro-sp.mp4" type="video/mp4" />
        {/* Fallback for older browsers */}
        Your browser does not support the video tag.
      </video>

      {/* Optional: Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center h-full px-4 md:px-16 lg:px-24">
        <div className="text-left max-w-4xl">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-cormorant font-light tracking-tighter leading-[0.85] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
            Isaiah
            <br />
            Calibre
          </h1>
          <p className="mt-6 text-xs md:text-sm font-inter font-light tracking-[0.3em] uppercase text-white/90">
            Visual Storytelling
          </p>
        </div>
      </div>
    </section>
  );
}
