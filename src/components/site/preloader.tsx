"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { usePreloader } from "./preloader-context";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";
const TARGET_TEXT = "AmanKlik";
const SCRAMBLE_DURATION_MS = 1_300;
const SCRAMBLE_FRAME_MS = 32;

export function Preloader() {
  const { isLoaded, setIsLoaded } = usePreloader();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pathname !== "/" || reducedMotion) {
      setIsLoaded(true);
      return;
    }

    let animationFrameId: number;
    let previousFrameTime = 0;
    const startedAt = performance.now();

    const animateText = (time: number) => {
      const elapsed = time - startedAt;
      if (
        elapsed - previousFrameTime < SCRAMBLE_FRAME_MS &&
        elapsed < SCRAMBLE_DURATION_MS
      ) {
        animationFrameId = requestAnimationFrame(animateText);
        return;
      }

      previousFrameTime = elapsed;
      const progress = Math.min(elapsed / SCRAMBLE_DURATION_MS, 1);
      const resolvedCharacters = Math.floor(progress * TARGET_TEXT.length);
      let result = "";
      for (let i = 0; i < TARGET_TEXT.length; i++) {
        if (i < resolvedCharacters) {
          result += TARGET_TEXT[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      if (textRef.current) textRef.current.textContent = result;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateText);
      } else {
        if (textRef.current) textRef.current.textContent = TARGET_TEXT;
      }
    };

    animationFrameId = requestAnimationFrame(animateText);
    const timeline = gsap.timeline({
      onComplete: () => setIsLoaded(true),
    });
    timeline.to(progressRef.current, {
      scaleX: 1,
      duration: 1.35,
      ease: "power2.inOut",
    }, 0);
    timeline.to(textRef.current, {
      scale: 0.94,
      y: -10,
      opacity: 0,
      duration: 0.42,
      ease: "power3.inOut",
    }, 1.48);
    timeline.to(containerRef.current, {
      clipPath: "inset(50% 0 50% 0)",
      duration: 0.72,
      ease: "expo.inOut",
    }, 1.68);

    return () => {
      cancelAnimationFrame(animationFrameId);
      timeline.kill();
    };
  }, [isLoaded, pathname, setIsLoaded]);

  if (pathname !== "/" || isLoaded) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-site-preloader
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink text-white"
      style={{ clipPath: "inset(0% 0 0% 0)", willChange: "clip-path" }}
    >
      <div
        ref={textRef}
        className="z-10 font-mono text-4xl font-bold tracking-wider sm:text-6xl"
      >
        {TARGET_TEXT}
      </div>

      <div className="absolute bottom-12 left-1/2 h-[1px] w-48 -translate-x-1/2 overflow-hidden bg-white/20">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-white"
        />
      </div>
    </div>
  );
}
