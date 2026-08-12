"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RespondClient } from "@/app/respond/_components/respond-client";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function RespondSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });
  }, { scope: root });

  return (
    <section ref={root}>
      <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
        <h2 className="section-title max-w-3xl">
          Pilih yang terjadi. Kerjakan yang pertama.
        </h2>
        <p className="max-w-lg text-sm leading-7 text-muted lg:justify-self-end">
          Untuk uang yang sudah terkirim, kecepatan melapor penting. Gunakan
          hanya kanal resmi yang kamu buka sendiri—bukan nomor atau tautan dari
          pesan.
        </p>
      </div>
      <RespondClient />
    </section>
  );
}
