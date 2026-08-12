"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionButton } from "@/components/ui/animated-button";
import { usePreloader } from "@/components/site/preloader-context";
import { useTransition } from "@/components/site/transition-context";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type LearnTopic = {
  id: string;
  documentTitle: string;
  text: string;
  sourceUrl: string;
  publisher: string;
};

export function LearnSection({ topics }: { topics: LearnTopic[] }) {
  const root = useRef<HTMLElement>(null);
  const { isLoaded } = usePreloader();
  const { isTransitioning } = useTransition();
  const isReady = isLoaded && !isTransitioning;

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    if (!isReady) {
      gsap.set(root.current, { opacity: 0.82 });
      gsap.set("[data-topic-card]", { autoAlpha: 0, y: 34 });
      return;
    }

    gsap.fromTo(root.current, { opacity: 0.82 }, {
      opacity: 1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });

    gsap.fromTo("[data-topic-card]", { autoAlpha: 0, y: 34 }, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.055,
      duration: 0.62,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "[data-topic-list]",
        start: "top 88%",
        once: true,
      },
    });
  }, { scope: root, dependencies: [isReady] });

  return (
    <section ref={root}>
      <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
        <h2 className="section-title max-w-4xl">
          Pengetahuan yang tetap berguna setelah hasil scan ditutup.
        </h2>
        <p className="font-mono text-xs uppercase leading-6 tracking-[0.14em] text-muted lg:justify-self-end">
          {topics.length.toString().padStart(2, "0")}{" "}
          catatan terkurasi<br />Sumber resmi
        </p>
      </div>
      <div data-topic-list className="mt-12 divide-y border-y border-line">
        {topics.map((topic, index) => (
          <article
            key={topic.id}
            data-topic-card
            className="editorial-row group relative flex flex-col py-8 first:border-t-0 sm:px-2"
          >
            <span className="font-mono text-xs text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="absolute right-1 top-7 text-2xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-ai"
              aria-hidden="true"
            >
              ↗
            </span>
            <h3 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em]">
              {topic.documentTitle}
            </h3>
            <p className="max-w-xl leading-7 text-muted">{topic.text}</p>
            <a
              className="mt-6 text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai"
              href={topic.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Sumber resmi · {topic.publisher}
            </a>
          </article>
        ))}
      </div>
      <div className="mt-16 flex flex-col gap-6 border-t-2 border-ai bg-ink p-7 text-surface sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <p className="max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.03em]">
          Sudah mengenali polanya? Uji satu pesan tanpa membuka tautannya.
        </p>
        <MotionButton
          arrow
          className="shrink-0 bg-surface text-ink"
          href="/scan"
        >
          Buka scanner
        </MotionButton>
      </div>
    </section>
  );
}
