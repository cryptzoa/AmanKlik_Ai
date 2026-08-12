"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ConversationClient } from "@/app/scan/conversation/_components/conversation-client";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ConversationSection() {
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <p className="max-w-xl text-sm leading-7 text-muted">
          Gunakan percakapan sintetis atau konteks minimum. Jangan menempelkan
          OTP, password, nomor rekening, atau identitas nyata.
        </p>
        <Link
          className="text-sm font-semibold text-ai underline underline-offset-4"
          href="/scan"
        >
          Kembali ke scanner tunggal
        </Link>
      </div>
      <ConversationClient />
    </section>
  );
}
