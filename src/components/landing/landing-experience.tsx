"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const storyBeats = [
  ["01", "Terlihat biasa", "Sapaan akrab membuat pesan terasa seperti percakapan sehari-hari."],
  ["02", "Waktu dipersempit", "Kata ‘sekarang’ mengurangi ruang untuk berpikir dan memeriksa."],
  ["03", "Identitas berubah", "Nomor baru meminta kamu menerima identitas tanpa verifikasi lama."],
  ["04", "Permintaan muncul", "Transfer atau kode rahasia menjadi tujuan akhir dari rangkaian tekanan."],
  ["05", "Pola dijelaskan", "AmanKlik memisahkan indikator agar kamu bisa menilai keputusan berikutnya."],
];

const messageFragments = [
  { text: "OTP 714•••", className: "left-[68%] top-[19%] -rotate-3" },
  { text: "nomor baru", className: "left-[77%] top-[37%] rotate-2" },
  { text: "TRANSFER SEKARANG", className: "left-[61%] top-[54%] -rotate-2" },
  { text: "akun dibatasi", className: "left-[80%] top-[69%] rotate-3" },
];

export function LandingExperience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .from("[data-site-header]", { autoAlpha: 0, y: -18, duration: 0.45 })
      .from("[data-hero-line] > span", { yPercent: 115, duration: 0.72, stagger: 0.08 }, "-=0.18")
      .from("[data-hero-support]", { autoAlpha: 0, y: 22, duration: 0.45 }, "-=0.28")
      .from("[data-fragment]", { autoAlpha: 0, scale: 0.92, duration: 0.42, stagger: 0.07 }, "-=0.25");

    gsap.utils.toArray<HTMLElement>("[data-fragment]").forEach((fragment, index) => {
      gsap.to(fragment, {
        y: index % 2 ? -10 : 12,
        x: index % 2 ? 5 : -4,
        rotation: index % 2 ? "+=1" : "-=1",
        duration: 3.8 + index * 0.45,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    gsap.to("[data-site-header]", {
      backgroundColor: "rgba(255, 253, 247, 0.96)",
      borderColor: "rgba(17, 17, 17, 0.14)",
      duration: 0.2,
      scrollTrigger: {
        trigger: "[data-hero]",
        start: "bottom 15%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.utils.toArray<HTMLElement>("[data-story-beat]").forEach((beat) => {
      gsap.from(beat, {
        autoAlpha: 0.35,
        y: 42,
        scrollTrigger: { trigger: beat, start: "top 78%", end: "top 48%", scrub: 0.5 },
      });
    });

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const signals = gsap.utils.toArray<HTMLElement>("[data-story-signal]");
      gsap.set(signals, { autoAlpha: 0, y: 24, scale: 0.94 });
      gsap.timeline({
        scrollTrigger: {
          trigger: "[data-story]",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      })
        .to(signals[0], { autoAlpha: 1, y: 0, scale: 1, duration: 0.14 }, 0.12)
        .to(signals[1], { autoAlpha: 1, y: 0, scale: 1, duration: 0.14 }, 0.34)
        .to(signals[2], { autoAlpha: 1, y: 0, scale: 1, duration: 0.14 }, 0.56)
        .to(signals[3], { autoAlpha: 1, y: 0, scale: 1, duration: 0.14 }, 0.78);
    });

    gsap.from("[data-url-domain]", {
      color: "#6f6c65",
      scale: 0.9,
      transformOrigin: "center",
      scrollTrigger: { trigger: "[data-url-anatomy]", start: "top 70%", end: "center 45%", scrub: 0.6 },
    });

    gsap.from("[data-pipeline-node]", {
      autoAlpha: 0,
      y: 34,
      stagger: 0.12,
      scrollTrigger: { trigger: "[data-pipeline]", start: "top 72%" },
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <main ref={root} className="landing-grain overflow-clip bg-canvas">
      <header data-site-header className="fixed inset-x-0 top-0 z-50 border-b border-transparent px-4 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <Link className="font-mono text-sm font-bold uppercase tracking-[0.18em]" href="/">AmanKlik AI</Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex" aria-label="Navigasi utama">
            <Link className="transition hover:text-ink" href="/scan">Scan</Link>
            <Link className="transition hover:text-ink" href="/simulator">Simulator</Link>
            <Link className="transition hover:text-ink" href="/learn">Learn</Link>
            <Link className="transition hover:text-ink" href="/history" prefetch={false}>History</Link>
          </nav>
          <div className="flex items-center gap-2">
            <details className="group relative md:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">Menu</summary>
              <nav className="absolute right-0 top-14 grid min-w-44 gap-1 border border-line bg-surface p-2 shadow-xl" aria-label="Navigasi seluler">
                <Link className="min-h-11 px-3 py-3 text-sm font-semibold" href="/scan">Scan</Link>
                <Link className="min-h-11 px-3 py-3 text-sm font-semibold" href="/simulator">Simulator</Link>
                <Link className="min-h-11 px-3 py-3 text-sm font-semibold" href="/learn">Learn</Link>
                <Link className="min-h-11 px-3 py-3 text-sm font-semibold" href="/history" prefetch={false}>History</Link>
              </nav>
            </details>
            <Link className="hidden min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-surface transition hover:bg-ai sm:inline-flex" href="/scan">Cek pesan</Link>
          </div>
        </div>
      </header>

      <section data-hero className="hero-grid relative min-h-[100svh] border-b border-line px-5 pb-14 pt-32 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-12rem)] max-w-[1440px] flex-col justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">Digital safety / explainable AI</p>
            <h1 className="mt-7 max-w-[1050px] text-[clamp(3.5rem,10vw,9rem)] font-semibold uppercase leading-[0.78] tracking-[-0.075em]">
              <span data-hero-line className="block overflow-hidden pb-[0.08em]"><span className="block">Jangan</span></span>
              <span data-hero-line className="block overflow-hidden pb-[0.08em]"><span className="block text-risk">Percaya</span></span>
              <span data-hero-line className="block overflow-hidden pb-[0.08em]"><span className="block">Pesannya.</span></span>
            </h1>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div data-hero-support>
              <p className="max-w-xl text-lg leading-8 text-muted sm:text-xl">Pahami pola manipulasi, struktur tautan, dan konteks pesannya sebelum mengeklik, membalas, atau mengirim sesuatu.</p>
              <Link data-hero-cta className="mt-7 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai" href="/scan">Periksa sekarang <span className="ml-3" aria-hidden="true">→</span></Link>
            </div>
            <p className="max-w-sm border-l border-line pl-5 font-mono text-xs uppercase leading-6 tracking-[0.14em] text-muted">Rules + URL intelligence + AI context. Skor akhir tetap dikendalikan logika aplikasi.</p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {messageFragments.map((fragment) => (
            <span key={fragment.text} data-fragment className={`absolute border border-line bg-surface px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] shadow-[8px_8px_0_rgba(17,17,17,0.08)] ${fragment.className}`}>{fragment.text}</span>
          ))}
        </div>
      </section>

      <section data-story className="border-b border-line px-5 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-14 py-24 md:grid-cols-[0.9fr_1.1fr] md:py-0">
          <div className="self-start md:sticky md:top-0 md:flex md:min-h-screen md:items-center">
            <div className="w-full">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai">01 / Cara pola terbentuk</p>
              <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">Satu pesan. Beberapa lapis tekanan.</h2>
              <div className="relative mt-10 overflow-hidden border border-line bg-surface p-5 shadow-[14px_14px_0_var(--ai-soft)] sm:p-7">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <span className="font-semibold">Kontak tidak dikenal</span>
                  <span className="font-mono text-xs text-muted">18.42</span>
                </div>
                <p className="mt-6 max-w-md leading-8">Bu, ini nomor baru aku. Ada masalah dan butuh transfer sekarang. Jangan telepon dulu.</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <span data-story-signal className="rounded-full bg-warning-soft px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]">Tekanan waktu</span>
                  <span data-story-signal className="rounded-full bg-ai-soft px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]">Identitas berubah</span>
                  <span data-story-signal className="rounded-full bg-risk-soft px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]">Transfer</span>
                  <span data-story-signal className="rounded-full bg-canvas px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]">Hindari verifikasi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-line md:py-[35vh]">
            {storyBeats.map(([number, title, body]) => (
              <article key={number} data-story-beat className="flex min-h-[38vh] flex-col justify-center py-14 md:min-h-[52vh]">
                <span className="font-mono text-xs text-muted">{number} / 05</span>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h3>
                <p className="mt-5 max-w-lg text-lg leading-8 text-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-url-anatomy className="border-b border-line bg-ink px-5 py-24 text-surface sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-warning">02 / Anatomi URL</p>
              <h2 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">Nama merek bisa ditempel. Domain tidak bisa disamarkan begitu saja.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#aaa9a2] lg:justify-self-end">Baca alamat dari kanan ke kiri. Kata “brand” atau “secure-login” di subdomain belum menjadikannya situs resmi.</p>
          </div>

          <div className="mt-16 overflow-x-auto border-y border-white/20 py-10">
            <p className="min-w-max font-mono text-[clamp(1.45rem,3.2vw,3.8rem)] tracking-[-0.05em]">
              <span className="text-[#77776f]">https://</span>
              <span className="text-warning">brand.secure-login.</span>
              <span data-url-domain className="inline-block bg-risk px-2 py-1 font-bold text-white">example.net</span>
              <span className="text-[#77776f]">/account</span>
            </p>
            <div className="mt-5 flex min-w-[760px] font-mono text-xs uppercase tracking-[0.14em] text-[#888880]">
              <span className="w-[14%]">protokol</span><span className="w-[38%] text-warning">subdomain / hiasan</span><span className="w-[29%] text-white">domain sebenarnya ↑</span><span>path</span>
            </div>
          </div>
          <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-[#aaa9a2]">Contoh memakai domain dokumentasi yang dicadangkan dan tidak pernah di-fetch oleh AmanKlik.</p>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-surface px-6 font-semibold text-ink transition hover:bg-warning" href="/scan">Coba analisis tautan →</Link>
          </div>
        </div>
      </section>

      <section data-pipeline className="border-b border-line px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai">03 / Hybrid intelligence</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-end">
            <h2 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">Bukan keputusan AI mentah.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted lg:justify-self-end">AI membantu membaca konteks. Rules dan pemeriksaan URL memberi bukti deterministik. Risk Engine milik aplikasi menggabungkannya menjadi hasil yang bisa dijelaskan.</p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-[0.9fr_0.9fr_0.9fr_1.2fr_1.3fr]">
            {[
              ["RULES", "Pola pesan"], ["URL", "Struktur domain"], ["AI", "Konteks bahasa"], ["RISK ENGINE", "Logika aplikasi"], ["RESULT", "Skor + alasan + aksi"],
            ].map(([label, body], index) => (
              <div key={label} data-pipeline-node className={`${index === 3 ? "bg-ink text-surface" : index === 4 ? "bg-ai-soft" : "bg-surface"} relative min-h-48 p-6`}>
                <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-60">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-14 font-mono text-sm font-bold tracking-[0.12em]">{label}</p>
                <p className="mt-2 text-sm opacity-70">{body}</p>
                {index < 4 ? <span className="absolute bottom-5 right-5 text-xl" aria-hidden="true">→</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-risk px-5 py-24 text-white sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">Sebelum bertindak</p>
          <h2 className="mt-6 max-w-5xl text-[clamp(3.3rem,8vw,8rem)] font-semibold leading-[0.84] tracking-[-0.07em]">Kalau pesannya bikin ragu, cek dulu.</h2>
          <div className="mt-12 flex flex-col gap-6 border-t border-white/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-lg leading-8 text-white/80">Gunakan contoh sintetis atau periksa pesanmu tanpa membuka tautan tujuan.</p>
            <Link className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-8 font-semibold text-ink transition hover:-translate-y-1 hover:bg-warning" href="/scan">Buka AmanKlik <span className="ml-3" aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-4 bg-ink px-5 py-9 text-sm text-[#aaa9a2] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <p className="font-mono uppercase tracking-[0.14em]">AmanKlik AI · 2026</p>
        <p>Risiko rendah bukan jaminan aman. Verifikasi selalu melalui kanal resmi.</p>
      </footer>
    </main>
  );
}
