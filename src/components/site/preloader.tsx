"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePreloader } from "./preloader-context";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";
const TARGET_TEXT = "AmanKlik";

export function Preloader() {
  const { isLoaded, setIsLoaded } = usePreloader();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyShown = window.sessionStorage.getItem("amanklik-preloader") === "shown";
    if (pathname !== "/" || reducedMotion || alreadyShown) {
      setIsLoaded(true);
      return;
    }

    let frame = 0;
    const duration = 36;
    let animationFrameId: number;
    let cancelled = false;
    let killTimeline: (() => void) | undefined;

    const animateText = () => {
      let result = "";
      for (let i = 0; i < TARGET_TEXT.length; i++) {
        const threshold = (i / TARGET_TEXT.length) * (duration - 20);
        if (frame > threshold + 10) {
          result += TARGET_TEXT[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      if (textRef.current) textRef.current.textContent = result;

      frame++;
      if (frame <= duration) {
        animationFrameId = requestAnimationFrame(animateText);
      } else {
        if (textRef.current) textRef.current.textContent = TARGET_TEXT;
      }
    };

    animationFrameId = requestAnimationFrame(animateText);
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      const timeline = gsap.timeline({
        onComplete: () => {
          window.sessionStorage.setItem("amanklik-preloader", "shown");
          setIsLoaded(true);
        },
      });
      killTimeline = () => timeline.kill();
      timeline.to(progressRef.current, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 0);
      timeline.to(textRef.current, { scale: 0.9, y: -12, opacity: 0, duration: 0.28, ease: "power3.in" }, 0.58);
      timeline.to(containerRef.current, { clipPath: "inset(50% 0 50% 0)", duration: 0.42, ease: "expo.inOut" }, 0.7);
    }).catch(() => {
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrameId);
      killTimeline?.();
    };
  }, [isLoaded, pathname, setIsLoaded]);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink text-white"
      style={{ clipPath: "inset(0% 0 0% 0)" }}
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
