import { LandingVideoPlayer } from "./landing-video-player";

export function LandingVideoSection() {
  return (
    <section className="bg-canvas px-4 sm:px-[1.5%] py-6 sm:py-[2vw]">
      <div
        className="video-stage relative flex aspect-[9/16] max-w-[390px] sm:max-w-md md:max-w-none md:aspect-video w-full mx-auto items-center justify-center overflow-hidden bg-ink"
        aria-label="Area video AmanKlik"
      >
        <LandingVideoPlayer />
      </div>
    </section>
  );
}
