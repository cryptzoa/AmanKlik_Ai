import { LandingVideoPlayer } from "./landing-video-player";

export function LandingVideoSection() {
  return (
    <section
      aria-label="Film AmanKlik"
      className="bg-canvas px-4 py-6 sm:px-[1.5%] sm:py-[2vw]"
    >
      <div
        className="video-stage relative flex aspect-[9/16] max-w-[390px] sm:max-w-md md:max-w-none md:aspect-video w-full mx-auto items-center justify-center overflow-hidden bg-ink"
      >
        <LandingVideoPlayer />
      </div>
    </section>
  );
}
