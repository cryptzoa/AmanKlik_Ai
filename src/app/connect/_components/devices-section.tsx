"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TokenItem } from "@/app/connect/_components/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function DevicesSection(
  { items, onRevoke }: { items: TokenItem[]; onRevoke: (id: string) => void },
) {
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
    gsap.from("[data-device-row]", {
      autoAlpha: 0,
      x: 24,
      stagger: 0.07,
      duration: 0.55,
      scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
    });
  }, { scope: root });

  return (
    <section ref={root}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        Connected devices
      </p>
      <div className="mt-5 divide-y divide-line border-y border-line">
        {items.length
          ? items.map((item) => (
            <div
              key={item.id}
              data-device-row
              className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <strong>{item.name}</strong>
                <p className="mt-1 text-xs text-muted">
                  Dibuat {new Date(item.createdAt).toLocaleString("id-ID")}{" "}
                  · terakhir dipakai {item.lastUsedAt
                    ? new Date(item.lastUsedAt).toLocaleString("id-ID")
                    : "belum pernah"}
                </p>
              </div>
              <button
                type="button"
                className="min-h-11 rounded-full border border-risk/30 px-4 text-xs font-semibold text-risk hover:bg-risk-soft"
                onClick={() => onRevoke(item.id)}
              >
                Cabut akses
              </button>
            </div>
          ))
          : (
            <p className="py-6 text-sm text-muted">
              Belum ada perangkat terhubung.
            </p>
          )}
      </div>
    </section>
  );
}
