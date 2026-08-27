"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PRELOADER_COMPLETE_EVENT } from "./preloader-events";

const CHARS = "!<>-_\\/[]{}~=+*^?#________";
const TARGET_TEXT = "AmanKlik";
const SCRAMBLE_DURATION_MS = 1_300;
const SCRAMBLE_FRAME_MS = 32;

export function Preloader() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const progress = progressRef.current;
    const progressTrack = progressTrackRef.current;
    if (
      pathname !== "/" ||
      !container ||
      !text ||
      !progress ||
      !progressTrack
    ) return;

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
      {
        duration: 1_350,
        easing: "cubic-bezier(.65,0,.35,1)",
        fill: "forwards",
      },
    );
    const progressExitAnimation = progressTrack.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        delay: 1_480,
        duration: 200,
        easing: "ease-out",
        fill: "forwards",
      },
    );
    const textAnimation = text.animate(
      [
        { opacity: 1, transform: "translate3d(0,0,0) scale(1)" },
        { opacity: 0, transform: "translate3d(0,-10px,0) scale(.94)" },
      ],
      {
        delay: 1_480,
        duration: 420,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards",
      },
    );
    const exitAnimation = container.animate(
      [
        { clipPath: "inset(0% 0 0% 0)" },
        { clipPath: "inset(50% 0 50% 0)" },
      ],
      {
        delay: 1_680,
        duration: 720,
        easing: "cubic-bezier(.87,0,.13,1)",
        fill: "forwards",
      },
    );
    exitAnimation.finished.then(complete).catch(() => undefined);

    return () => {
      cancelAnimationFrame(animationFrameId);
      progressAnimation.cancel();
      progressExitAnimation.cancel();
      textAnimation.cancel();
      exitAnimation.cancel();
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-site-preloader
      data-preloader-state="active"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink text-white"
      style={{ clipPath: "inset(0% 0 0% 0)", willChange: "clip-path" }}
    >
      <div
        ref={progressTrackRef}
        className="absolute bottom-12 left-1/2 z-10 h-px w-48 -translate-x-1/2 overflow-hidden bg-white/20"
      >
        <div
          ref={progressRef}
          data-preloader-progress
          className="h-full w-full origin-left bg-ai"
          style={{ transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>

      <div
        ref={textRef}
        className="relative z-10 font-mono text-4xl font-bold tracking-wider will-change-transform sm:text-6xl"
      >
        {TARGET_TEXT}
      </div>
    </div>
  );
}
