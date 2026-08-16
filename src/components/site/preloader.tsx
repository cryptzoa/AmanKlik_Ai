"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PRELOADER_COMPLETE_EVENT } from "./preloader-events";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";
const TARGET_TEXT = "AmanKlik";
const SCRAMBLE_DURATION_MS = 520;
const SCRAMBLE_FRAME_MS = 40;

export function Preloader() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const progress = progressRef.current;
    if (pathname !== "/" || !container || !text || !progress) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrameId = 0;
    let completed = false;

    const complete = () => {
      if (completed) return;
      completed = true;
      container.dataset.preloaderState = "complete";
      container.style.visibility = "hidden";
      container.style.pointerEvents = "none";
      window.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
    };

    if (reducedMotion) {
      complete();
      return;
    }

    const startedAt = performance.now();
    let previousFrameTime = 0;
    const animateText = (time: number) => {
      const elapsed = time - startedAt;
      if (elapsed - previousFrameTime >= SCRAMBLE_FRAME_MS) {
        previousFrameTime = elapsed;
        const amount = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1);
        const resolvedCharacters = Math.floor(amount * TARGET_TEXT.length);
        text.textContent = Array.from(TARGET_TEXT, (character, index) =>
          index < resolvedCharacters
            ? character
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("");
      }

      if (elapsed < SCRAMBLE_DURATION_MS) {
        animationFrameId = requestAnimationFrame(animateText);
      } else {
        text.textContent = TARGET_TEXT;
      }
    };

    animationFrameId = requestAnimationFrame(animateText);
    const progressAnimation = progress.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: 620, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" },
    );
    const exitAnimation = container.animate(
      [
        { opacity: 1, transform: "translate3d(0,0,0)" },
        { opacity: 0, transform: "translate3d(0,-12px,0)" },
      ],
      {
        delay: 620,
        duration: 260,
        easing: "cubic-bezier(.76,0,.24,1)",
        fill: "forwards",
      },
    );
    exitAnimation.finished.then(complete).catch(() => undefined);

    return () => {
      cancelAnimationFrame(animationFrameId);
      progressAnimation?.cancel();
      exitAnimation?.cancel();
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-site-preloader
      data-preloader-state="active"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink text-white"
      style={{ willChange: "opacity, transform" }}
    >
      <div
        ref={textRef}
        className="font-mono text-4xl font-bold tracking-wider sm:text-6xl"
      >
        {TARGET_TEXT}
      </div>

      <div className="absolute bottom-12 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden bg-white/20">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-ai"
        />
      </div>
    </div>
  );
}
