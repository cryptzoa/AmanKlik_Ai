"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const primaryNavigation = [
  ["/scan", "Scan"],
  ["/investigate", "Investigate"],
  ["/respond", "Action"],
  ["/simulator", "Latihan"],
] as const;

const secondaryNavigation = [
  ["/learn", "Learn"],
  ["/history", "History"],
] as const;

const navigation = [...primaryNavigation, ...secondaryNavigation] as const;

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
  const pathname = usePathname();

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from("[data-shell-header]", { autoAlpha: 0, y: -18, duration: 0.45 })
      .from("[data-shell-eyebrow]", { autoAlpha: 0, y: 15, duration: 0.4 }, "-=0.15")
      .from("[data-shell-title]", { yPercent: 112, duration: 0.75 }, "-=0.22")
      .from("[data-shell-description]", { autoAlpha: 0, y: 22, duration: 0.5 }, "-=0.34")
      .from("[data-shell-fragment]", { autoAlpha: 0, scale: 0.88, stagger: 0.07, duration: 0.4 }, "-=0.3");

    gsap.utils.toArray<HTMLElement>("[data-shell-fragment]").forEach((fragment, index) => {
      gsap.to(fragment, {
        y: index % 2 ? 9 : -11,
        rotation: index % 2 ? 1.5 : -1.5,
        duration: 3.4 + index * 0.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 42,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal-card]").forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 34,
        rotate: index % 2 ? 0.6 : -0.6,
        duration: 0.62,
        delay: (index % 4) * 0.055,
        ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 91%", once: true },
      });
    });
  }, { scope: root });

  return (
    <main ref={root} className="landing-grain min-h-screen overflow-clip bg-canvas">
      <header data-shell-header className="sticky inset-x-0 top-0 z-50 border-b border-line bg-canvas/90 px-4 py-4 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <Link className="font-mono text-sm font-bold uppercase tracking-[0.18em]" href="/">AmanKlik AI</Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Navigasi utama">
            {primaryNavigation.map(([href, label]) => (
              <Link
                key={href}
                className={`relative py-1 transition after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-ink after:transition-transform ${pathname.startsWith(href) ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100"}`}
                href={href}
              >
                {label}
              </Link>
            ))}
            <details className="group relative">
              <summary className={`cursor-pointer list-none py-1 transition [&::-webkit-details-marker]:hidden ${secondaryNavigation.some(([href]) => pathname.startsWith(href)) ? "text-ink" : "text-muted hover:text-ink"}`}>Lainnya +</summary>
              <nav className="absolute right-0 top-9 grid min-w-48 gap-1 border border-line bg-surface p-2 shadow-[8px_8px_0_rgba(17,17,17,0.12)]" aria-label="Navigasi tambahan">
                {secondaryNavigation.map(([href, label]) => <Link key={href} className={`min-h-11 px-3 py-3 text-sm font-semibold ${pathname.startsWith(href) ? "bg-ai-soft text-ai" : "hover:bg-canvas"}`} href={href} prefetch={href === "/history" ? false : undefined}>{label}</Link>)}
              </nav>
            </details>
          </nav>
          <div className="flex items-center gap-2">
            <details className="group relative md:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">Menu</summary>
              <nav className="absolute right-0 top-14 grid min-w-48 gap-1 border border-line bg-surface p-2 shadow-[8px_8px_0_rgba(17,17,17,0.12)]" aria-label="Navigasi seluler">
                {navigation.map(([href, label]) => <Link key={href} className="min-h-11 px-3 py-3 text-sm font-semibold" href={href} prefetch={href === "/history" ? false : undefined}>{label}</Link>)}
              </nav>
            </details>
            <Link className="hidden min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai sm:inline-flex" href="/scan">Cek pesan</Link>
          </div>
        </div>
      </header>

      <section className={`hero-grid relative border-b border-line px-5 sm:px-10 lg:px-16 ${compact ? "py-16 sm:py-24" : "flex min-h-[68svh] items-end py-16 sm:py-24"}`}>
        <div className="relative z-10 mx-auto w-full max-w-[1320px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p data-shell-eyebrow className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-ai">{eyebrow}</p>
              <div className="mt-6 overflow-hidden pb-[0.08em]">
                <h1 data-shell-title className="max-w-5xl text-[clamp(3.4rem,8vw,7.8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.072em]">{title}</h1>
              </div>
            </div>
            <p className="hidden max-w-48 border-l border-line pl-5 font-mono text-xs uppercase leading-6 tracking-[0.14em] text-muted lg:block">{marker}</p>
          </div>
          <p data-shell-description className="mt-8 max-w-2xl text-lg leading-8 text-muted sm:text-xl">{description}</p>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {fragments.slice(0, 3).map((fragment, index) => (
            <span
              key={`${fragment}-${index}`}
              data-shell-fragment
              className={`absolute border border-line bg-surface px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] shadow-[7px_7px_0_rgba(17,17,17,0.08)] ${index === 0 ? "right-[8%] top-[18%] -rotate-2 text-risk" : index === 1 ? "right-[21%] top-[33%] rotate-2 text-ai" : "right-[6%] top-[49%] -rotate-1"}`}
            >
              {fragment}
            </span>
          ))}
        </div>
      </section>

      <div className="px-5 py-16 sm:px-10 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1320px]">{children}</div>
      </div>

      <footer className="border-t border-white/15 bg-ink px-5 py-9 text-sm text-[#aaa9a2] sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.14em]">AmanKlik AI · 2026</p>
          <p>Risiko rendah bukan jaminan aman. Verifikasi selalu melalui kanal resmi.</p>
        </div>
      </footer>
    </main>
  );
}
