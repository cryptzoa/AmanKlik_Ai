"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { usePreloader } from "@/components/site/preloader-context";
import { useTransition } from "@/components/site/transition-context";
import { useEffect } from "react";

gsap.registerPlugin(useGSAP);

type InteriorShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  marker?: string;
  fragments?: string[];
  children: React.ReactNode;
  compact?: boolean;
};

export function InteriorShell({
  eyebrow,
  title,
  description,
  marker = "AMAN / KLIK",
  fragments = ["PERIKSA", "PAHAMI", "VERIFIKASI"],
  children,
  compact = false,
}: InteriorShellProps) {
  const root = useRef<HTMLElement>(null);
  const { isLoaded } = usePreloader();
  const { isTransitioning } = useTransition();
  const isReady = isLoaded && !isTransitioning;
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const intro = gsap.timeline({
      defaults: { ease: "power3.out" },
      paused: !isReady
    });
    timelineRef.current = intro;

    intro
      .from(
        "[data-shell-eyebrow]",
        { autoAlpha: 0, y: 15, duration: 0.4 },
        "-=0.15",
      )
      .from("[data-shell-title]", { yPercent: 112, duration: 0.75 }, "-=0.22")
      .from(
        "[data-shell-description]",
        { autoAlpha: 0, y: 22, duration: 0.5 },
        "-=0.34",
      )
      .from("[data-shell-fragment]", {
        autoAlpha: 0,
        scale: 0.88,
        stagger: 0.07,
        duration: 0.4,
      }, "-=0.3");

    gsap.utils.toArray<HTMLElement>("[data-shell-fragment]").forEach(
      (fragment, index) => {
        gsap.to(fragment, {
          y: index % 2 ? 9 : -11,
          rotation: index % 2 ? 1.5 : -1.5,
          duration: 3.4 + index * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      },
    );
  }, { scope: root });

  useEffect(() => {
    if (isReady && timelineRef.current) {
      timelineRef.current.play();
    }
  }, [isReady]);

  return (
    <main
      ref={root}
      className="landing-grain min-h-screen overflow-clip bg-ink"
    >
      <SiteHeader variant="interior" />

      <section
        className={`relative border-b border-white/15 bg-ink px-5 text-surface sm:px-10 lg:px-16 ${
          compact ? "py-12 sm:py-16" : "py-16 sm:py-24"
        }`}
      >
        <div className="relative z-10 mx-auto w-full max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
            <div>
              <p data-shell-eyebrow className="eyebrow-label text-ai-soft">
                {eyebrow}
              </p>
              <div className="mt-5 overflow-hidden pb-[0.1em]">
                <h1
                  data-shell-title
                  className={`${
                    compact ? "page-title max-w-5xl" : "display-title max-w-6xl"
                  } text-balanced uppercase`}
                >
                  {title}
                </h1>
              </div>
            </div>
            <p className="hidden border-l-2 border-ai pl-5 font-mono text-xs uppercase leading-6 tracking-[0.14em] text-white/60 lg:block">
              {marker}
            </p>
          </div>
          <p
            data-shell-description
            className="mt-8 max-w-2xl border-t border-white/20 pt-5 text-base leading-7 text-white/65 sm:text-lg sm:leading-8"
          >
            {description}
          </p>
        </div>

        <div
          className="mx-auto mt-8 hidden max-w-[1320px] flex-wrap gap-2 border-t border-white/20 pt-4 lg:flex"
          aria-hidden="true"
        >
          {fragments.slice(0, 3).map((fragment, index) => (
            <span
              key={`${fragment}-${index}`}
              data-shell-fragment
              className={`${
                index === 1 ? "bg-ai text-white" : "bg-white/10 text-white"
              } border border-white/25 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]`}
            >
              {fragment}
            </span>
          ))}
        </div>
      </section>

      <div className="bg-canvas px-5 py-14 text-ink sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-[1320px]">{children}</div>
      </div>

      <SiteFooter variant="interior" />
    </main>
  );
}
