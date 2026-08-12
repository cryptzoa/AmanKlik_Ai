export function LandingVideoSection() {
  return (
    <section className="bg-canvas px-[1%] py-[1.5vw] sm:px-[1.5%] sm:py-[2vw]">
      <div
        className="video-stage relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink"
        aria-label="Area video AmanKlik"
      >
        <div className="relative z-10 flex flex-col items-center text-center text-surface">
          <span
            className="grid size-14 place-items-center rounded-full border border-white/25 bg-white/10 pl-0.5 text-base"
            aria-hidden="true"
          >
            ▶
          </span>
          <p className="eyebrow-label mt-5 text-white/60">AmanKlik / Film</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">
            Tempatkan video pengenalan AmanKlik di sini.
          </p>
        </div>
      </div>
    </section>
  );
}
