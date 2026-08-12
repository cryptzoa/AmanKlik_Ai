"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePreloader } from "./preloader-context";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";
const TARGET_TEXT = "AmanKlik";

export function Preloader() {
  const { isLoaded, setIsLoaded } = usePreloader();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [scrambleText, setScrambleText] = useState("");

  useEffect(() => {
    if (isLoaded) return;

    let frame = 0;
    const duration = 60;
    let animationFrameId: number;

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
      setScrambleText(result);

      frame++;
      if (frame <= duration) {
        animationFrameId = requestAnimationFrame(animateText);
      } else {
        setScrambleText(TARGET_TEXT);
      }
    };

    animationFrameId = requestAnimationFrame(animateText);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
      }
    });

    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 1.5,
      ease: "power2.inOut"
    }, 0);

    tl.to(textRef.current, {
      scale: 0.8,
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.in"
    }, 1.6);

    tl.to(containerRef.current, {
      clipPath: "inset(50% 0 50% 0)",
      duration: 0.8,
      ease: "expo.inOut"
    }, 1.8);

    return () => {
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, [isLoaded, setIsLoaded]);

  if (isLoaded) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink text-white"
      style={{ clipPath: "inset(0% 0 0% 0)" }}
    >
      <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

      <div
        ref={textRef}
        className="z-10 font-mono text-4xl font-bold tracking-wider sm:text-6xl"
      >
        {scrambleText}
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
