"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type SiteFooterProps = {
  variant?: "landing";
};

export function SiteFooter({ variant = "landing" }: SiteFooterProps) {
  const container = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    gsap.fromTo(
      inner.current,
      { yPercent: -40 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".footer-stagger",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: container });

  return (
    <footer
      ref={container}
      data-footer-variant={variant}
      className="relative z-30 overflow-hidden bg-ink pt-16 sm:pt-24 lg:pt-32 text-surface"
    >
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div ref={inner} className="relative z-10 flex flex-col justify-between min-h-[500px]">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-20">
          <div className="footer-stagger">
            <p className="text-2xl font-bold text-white mb-4">AmanKlik AI</p>
            <p className="max-w-sm text-[#aaa9a2] text-lg leading-relaxed">
              Risiko rendah bukan jaminan aman. Verifikasi tautan dan pesan mencurigakan melalui analitik AI yang transparan.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:justify-items-end">
            <div className="footer-stagger flex flex-col gap-3 md:justify-self-start">
              <p className="font-mono text-xs uppercase tracking-widest text-[#aaa9a2] mb-2">Navigasi</p>
              <Link href="/" className="hover:text-white transition-colors duration-200">Beranda</Link>
              <Link href="/scan" className="hover:text-white transition-colors duration-200">Periksa Tautan</Link>
              <Link href="/investigate" className="hover:text-white transition-colors duration-200">Investigasi Lanjut</Link>
              <Link href="/simulator" className="hover:text-white transition-colors duration-200">Simulator Phishing</Link>
            </div>
            <div className="footer-stagger flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-widest text-[#aaa9a2] mb-2">Eksplorasi</p>
              <Link href="/learn" className="hover:text-white transition-colors duration-200">Pusat Edukasi</Link>
              <Link href="/benchmark" className="hover:text-white transition-colors duration-200">Benchmark AI</Link>
              <Link href="/history" className="hover:text-white transition-colors duration-200">Riwayat Anda</Link>
            </div>
            <div className="footer-stagger flex flex-col gap-3 col-span-2 md:col-span-1 mt-4 md:mt-0">
              <p className="font-mono text-xs uppercase tracking-widest text-[#aaa9a2] mb-2">Legal</p>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-auto overflow-hidden w-full px-5 sm:px-10 lg:px-16 pb-6">
          <div
            aria-hidden="true"
            className="footer-stagger text-[15vw] leading-[0.75] font-extrabold tracking-[-0.04em] text-white/5 select-none text-center"
          >
            AMANKLIK
          </div>
        </div>
        <div className="border-t border-white/10 w-full">
          <div className="mx-auto w-full max-w-[1320px] px-5 py-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#aaa9a2] font-mono uppercase tracking-widest">
            <span>© {new Date().getFullYear()} AmanKlik AI</span>
            <span>Made with precision by bersiaplah - HMTI UNIPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
