import { MotionButton } from "@/components/ui/animated-button";

export function ClosingCtaSection() {
  return (
    <section className="bg-risk px-5 py-24 text-white sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
          Sebelum bertindak
        </p>
        <h2 className="display-title mt-6 max-w-5xl">
          Kalau pesannya bikin ragu, jangan buru-buru.
        </h2>
        <div className="mt-12 flex flex-col gap-6 border-t border-white/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-lg leading-8 text-white/80">
            Gunakan contoh sintetis atau periksa pesanmu tanpa membuka tautan
            tujuan.
          </p>
          <MotionButton
            arrow
            className="min-h-14 bg-white px-8 text-ink"
            href="/scan"
          >
            Periksa dengan AmanKlik
          </MotionButton>
        </div>
      </div>
    </section>
  );
}
