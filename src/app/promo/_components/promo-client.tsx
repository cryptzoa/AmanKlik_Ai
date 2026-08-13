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
  const container = useRef<HTMLDivElement>(null);
  const [masterTl] = useState(() => gsap.timeline({ paused: true }));
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Setup callbacks
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
      // If we are at the end, restart
      if (masterTl.progress() === 1) {
        masterTl.restart();
      } else {
        masterTl.play();
      }
      setIsPlaying(true);
      setHasStarted(true);
    }
  }, [masterTl]);

  const seek = useCallback((newProgress: number) => {
    masterTl.progress(newProgress);
    setProgress(newProgress);
  }, [masterTl]);

  const restart = useCallback(() => {
    masterTl.restart();
    setIsPlaying(true);
    setHasStarted(true);
  }, [masterTl]);

  // Keyboard controls for record mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "KeyR") {
        restart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, restart]);

  // Once the timeline is fully populated, we set ready state
  const handleStageReady = useCallback((tlDuration: number) => {
    setDuration(tlDuration);
  }, []);

  return (
    <div ref={container} className="relative w-full h-screen bg-[#F3F1EA] flex items-center justify-center">
      
      {/* 
        In record mode, we might want a black ready screen before playback starts 
        as mentioned in the brief: "Optional clean black ready screen before playback" 
      */}
      {mode === "record" && !hasStarted && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center text-[#635BFF]">
          <p className="font-mono text-sm tracking-widest opacity-50">PRESS SPACE TO START RECORDING</p>
        </div>
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
          onTogglePlay={togglePlay}
          onSeek={seek}
          onRestart={restart}
        />
      )}
    </div>
  );
}
