"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PromoStage } from "./promo-stage";
import { PromoControls } from "./promo-controls";

gsap.registerPlugin(useGSAP);

interface PromoClientProps {
  ratio: "16x9" | "9x16";
  cut: "master" | "15s";
  mode: "preview" | "record";
}

export function PromoClient({ ratio, cut, mode }: PromoClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [masterTl] = useState(() => gsap.timeline({ paused: true }));

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    masterTl.eventCallback("onUpdate", () => {
      setProgress(masterTl.progress());
    });
    masterTl.eventCallback("onComplete", () => {
      setIsPlaying(false);
    });
  }, [masterTl]);

  const togglePlay = useCallback(() => {
    if (masterTl.isActive()) {
      masterTl.pause();
      setIsPlaying(false);
    } else {
      if (masterTl.progress() >= 1) {
        masterTl.restart();
      } else {
        masterTl.play();
      }
      setIsPlaying(true);
      setHasStarted(true);
    }
  }, [masterTl]);

  const seek = useCallback(
    (newProgress: number) => {
      masterTl.progress(newProgress);
      setProgress(newProgress);
    },
    [masterTl]
  );

  const restart = useCallback(() => {
    masterTl.restart();
    setIsPlaying(true);
    setHasStarted(true);
  }, [masterTl]);

  const jumpToLabel = useCallback(
    (label: string) => {
      if (!(label in masterTl.labels)) return;
      masterTl.seek(label);
      setProgress(masterTl.progress());
    },
    [masterTl]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        restart();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, restart]);

  const handleStageReady = useCallback((tlDuration: number) => {
    setDuration(tlDuration);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#F3F1EA] flex items-center justify-center overflow-hidden"
    >
      {mode === "record" && !hasStarted && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 z-50 bg-[#111111] flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none"
        >
          <div className="w-16 h-16 rounded-full bg-[#635BFF]/20 border border-[#635BFF] flex items-center justify-center mb-6 animate-pulse text-[#635BFF]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <div className="font-mono text-sm tracking-[0.25em] text-[#F3F1EA] uppercase font-bold mb-2">
            MODE REKAM SIAP
          </div>
          <p className="font-sans text-xs text-[#F3F1EA]/60 max-w-sm">
            Tekan <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-white">SPACE</kbd> atau klik di mana saja untuk memulai perekaman dengan urutan tetap.
          </p>
        </button>
      )}

      <PromoStage
        timeline={masterTl}
        ratio={ratio}
        cut={cut}
        onReady={handleStageReady}
      />

      {mode === "preview" && (
        <PromoControls
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          ratio={ratio}
          cut={cut}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onRestart={restart}
          onJumpToLabel={jumpToLabel}
        />
      )}
    </div>
  );
}
