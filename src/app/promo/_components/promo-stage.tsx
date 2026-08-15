"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScenePressure } from "./scenes/scene-pressure";
import { SceneFamiliar } from "./scenes/scene-familiar";
import { ScenePause } from "./scenes/scene-pause";
import { SceneBrand } from "./scenes/scene-brand";
import { SceneScan } from "./scenes/scene-scan";
import { SceneExplain } from "./scenes/scene-explain";
import { SceneFeatures } from "./scenes/scene-features";
import { SceneImpact } from "./scenes/scene-impact";
import { SceneEnd } from "./scenes/scene-end";

interface PromoStageProps {
  timeline: gsap.core.Timeline;
  ratio: "16x9" | "9x16";
  cut: "master" | "15s";
  fitMode?: "contain" | "cover";
  onReady: (duration: number) => void;
}

export function PromoStage({
  timeline,
  ratio,
  cut,
  fitMode = "contain",
  onReady,
}: PromoStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isPortrait = ratio === "9x16";
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      if (!stageRef.current) return;
      const targetWidth = isPortrait ? 1080 : 1920;
      const targetHeight = isPortrait ? 1920 : 1080;

      const parent = stageRef.current.parentElement;
      const availableWidth = parent && parent.clientWidth > 0 ? parent.clientWidth : window.innerWidth * 0.92;
      const availableHeight = parent && parent.clientHeight > 0 ? parent.clientHeight : window.innerHeight * 0.82;

      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;
      const calculatedScale = fitMode === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY, 1);

      setScale(calculatedScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    let resizeObserver: ResizeObserver | null = null;
    if (stageRef.current?.parentElement && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateScale());
      resizeObserver.observe(stageRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", updateScale);
      resizeObserver?.disconnect();
    };
  }, [isPortrait, fitMode]);

  useGSAP(
    () => {
      if (!timeline) return;

      timeline.clear();

      const isShort = cut === "15s";

      if (!isShort) {
        timeline.addLabel("scene-pressure", 0);
        timeline.set(".scene-pressure", { display: "flex", opacity: 1, zIndex: 10 }, "scene-pressure");
        timeline.fromTo(
          ".pressure-word-1",
          { scale: 2.5, opacity: 0, y: -40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power4.out" },
          "scene-pressure"
        );
        timeline.fromTo(
          ".pressure-shard-1",
          { x: -120, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "expo.out" },
          "scene-pressure+=0.4"
        );
        timeline.fromTo(
          ".pressure-word-2",
          { scale: 2.5, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power4.out" },
          "scene-pressure+=0.9"
        );
        timeline.fromTo(
          ".pressure-shard-2",
          { x: 120, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "expo.out" },
          "scene-pressure+=1.3"
        );
        timeline.fromTo(
          ".pressure-word-3",
          { scale: 2.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.7)" },
          "scene-pressure+=1.8"
        );
        timeline.to(
          ".scene-pressure",
          { opacity: 0, scale: 0.98, duration: 0.4, ease: "power2.inOut" },
          "scene-pressure+=4.2"
        );
        timeline.set(".scene-pressure", { display: "none" }, "scene-pressure+=4.6");

        timeline.addLabel("scene-familiar", "scene-pressure+=4.6");
        timeline.set(".scene-familiar", { display: "flex", opacity: 1, zIndex: 11 }, "scene-familiar");
        timeline.fromTo(
          ".familiar-headline",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          "scene-familiar"
        );
        timeline.fromTo(
          ".familiar-chat-box",
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" },
          "scene-familiar+=0.4"
        );
        timeline.fromTo(
          ".familiar-risk-1",
          { backgroundColor: "transparent", scale: 1 },
          { backgroundColor: "#FFE4E1", scale: 1.05, duration: 0.4 },
          "scene-familiar+=1.8"
        );
        timeline.fromTo(
          ".familiar-risk-2",
          { backgroundColor: "transparent", scale: 1 },
          { backgroundColor: "#FFE4E1", scale: 1.05, duration: 0.4 },
          "scene-familiar+=2.5"
        );
        timeline.fromTo(
          ".familiar-risk-3",
          { backgroundColor: "transparent", scale: 1 },
          { backgroundColor: "#FFE4E1", scale: 1.05, duration: 0.4 },
          "scene-familiar+=3.2"
        );
        timeline.to(
          ".scene-familiar",
          { opacity: 0, y: -20, duration: 0.4, ease: "power2.inOut" },
          "scene-familiar+=5.0"
        );
        timeline.set(".scene-familiar", { display: "none" }, "scene-familiar+=5.4");

        timeline.addLabel("scene-pause", "scene-familiar+=5.4");
        timeline.set(".scene-pause", { display: "flex", opacity: 1, zIndex: 12 }, "scene-pause");
        timeline.fromTo(
          ".pause-text",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "scene-pause"
        );
        timeline.fromTo(
          ".pause-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          "scene-pause+=0.6"
        );
        timeline.fromTo(
          ".pause-sub",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "scene-pause+=1.0"
        );
        timeline.to(
          ".scene-pause",
          { opacity: 0, scale: 1.02, duration: 0.4 },
          "scene-pause+=4.2"
        );
        timeline.set(".scene-pause", { display: "none" }, "scene-pause+=4.6");

        timeline.addLabel("scene-brand", "scene-pause+=4.6");
        timeline.set(".scene-brand", { display: "flex", opacity: 1, zIndex: 13 }, "scene-brand");
        timeline.fromTo(
          ".brand-intro",
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "scene-brand"
        );
        timeline.fromTo(
          ".brand-aman",
          { x: -180, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
          "scene-brand+=0.2"
        );
        timeline.fromTo(
          ".brand-klik",
          { x: 180, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
          "scene-brand+=0.2"
        );
        timeline.fromTo(
          ".brand-ai",
          { scale: 0, opacity: 0, rotation: -10 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" },
          "scene-brand+=0.7"
        );
        timeline.fromTo(
          ".brand-statement",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          "scene-brand+=1.2"
        );
        timeline.to(
          ".scene-brand",
          { opacity: 0, scale: 0.96, duration: 0.4 },
          "scene-brand+=4.8"
        );
        timeline.set(".scene-brand", { display: "none" }, "scene-brand+=5.2");

        timeline.addLabel("scene-scan", "scene-brand+=5.2");
        timeline.set(".scene-scan", { display: "flex", opacity: 1, zIndex: 14 }, "scene-scan");
        timeline.fromTo(
          ".scan-vectors-bar",
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "scene-scan"
        );
        timeline.fromTo(
          ".scan-workbench",
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "scene-scan+=0.3"
        );
        timeline.fromTo(
          ".scan-tag-1",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" },
          "scene-scan+=0.6"
        );
        timeline.fromTo(
          ".scan-tag-2",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" },
          "scene-scan+=1.0"
        );
        timeline.fromTo(
          ".scan-tag-3",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" },
          "scene-scan+=1.4"
        );
        timeline.fromTo(
          ".scan-beam",
          { top: "0%", opacity: 0 },
          { top: "100%", opacity: 1, duration: 1.4, ease: "power2.inOut" },
          "scene-scan+=2.0"
        );
        timeline.fromTo(
          ".scan-btn",
          { scale: 1 },
          { scale: 1.06, repeat: 1, yoyo: true, duration: 0.3 },
          "scene-scan+=3.6"
        );
        timeline.to(
          ".scene-scan",
          { opacity: 0, scale: 1.05, duration: 0.5, ease: "power2.in" },
          "scene-scan+=7.8"
        );
        timeline.set(".scene-scan", { display: "none" }, "scene-scan+=8.3");

        timeline.addLabel("scene-explain", "scene-scan+=8.3");
        timeline.set(".scene-explain", { display: "flex", opacity: 1, zIndex: 15 }, "scene-explain");
        timeline.fromTo(
          ".explain-text-1",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
          "scene-explain"
        );
        timeline.fromTo(
          ".explain-text-2",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          "scene-explain+=0.5"
        );
        timeline.fromTo(
          ".explain-card",
          { scale: 0.92, opacity: 0, x: 40 },
          { scale: 1, opacity: 1, x: 0, duration: 0.8, ease: "expo.out" },
          "scene-explain+=0.7"
        );
        timeline.fromTo(
          ".explain-row-1",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          "scene-explain+=1.3"
        );
        timeline.fromTo(
          ".explain-row-2",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          "scene-explain+=1.9"
        );
        timeline.fromTo(
          ".explain-row-3",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          "scene-explain+=2.5"
        );
        timeline.fromTo(
          ".explain-action",
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" },
          "scene-explain+=3.2"
        );
        timeline.to(
          ".scene-explain",
          { opacity: 0, y: -30, duration: 0.4 },
          "scene-explain+=7.0"
        );
        timeline.set(".scene-explain", { display: "none" }, "scene-explain+=7.4");

        timeline.addLabel("scene-features", "scene-explain+=7.4");
        timeline.set(".scene-features", { display: "flex", opacity: 1, zIndex: 16 }, "scene-features");
        timeline.fromTo(
          ".feature-card-1",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)" },
          "scene-features"
        );
        timeline.fromTo(
          ".feature-card-2",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)" },
          "scene-features+=0.4"
        );
        timeline.fromTo(
          ".feature-card-3",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)" },
          "scene-features+=0.8"
        );
        timeline.fromTo(
          ".feature-card-4",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)" },
          "scene-features+=1.2"
        );
        timeline.to(
          ".scene-features",
          { opacity: 0, scale: 0.98, duration: 0.4 },
          "scene-features+=6.8"
        );
        timeline.set(".scene-features", { display: "none" }, "scene-features+=7.2");

        timeline.addLabel("scene-impact", "scene-features+=7.2");
        timeline.set(".scene-impact", { display: "flex", opacity: 1, zIndex: 17 }, "scene-impact");
        timeline.fromTo(
          ".impact-line-1",
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power4.out" },
          "scene-impact"
        );
        timeline.fromTo(
          ".impact-line-2",
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power4.out" },
          "scene-impact+=1.4"
        );
        timeline.fromTo(
          ".impact-line-3",
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power4.out" },
          "scene-impact+=2.8"
        );
        timeline.to(
          ".scene-impact",
          { opacity: 0, duration: 0.4 },
          "scene-impact+=5.5"
        );
        timeline.set(".scene-impact", { display: "none" }, "scene-impact+=5.9");

        timeline.addLabel("scene-end", "scene-impact+=5.9");
        timeline.set(".scene-end", { display: "flex", opacity: 1, zIndex: 18 }, "scene-end");
        timeline.fromTo(
          ".end-prompt",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          "scene-end"
        );
        timeline.fromTo(
          ".end-cta",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
          "scene-end+=0.4"
        );
        timeline.fromTo(
          ".end-brand",
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.4)" },
          "scene-end+=0.9"
        );
        timeline.fromTo(
          ".end-disclaimer",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "scene-end+=1.4"
        );

        timeline.set({}, {}, "scene-end+=5.0");
      } else {
        timeline.addLabel("scene-pressure", 0);
        timeline.set(".scene-pressure", { display: "flex", opacity: 1, zIndex: 10 }, "scene-pressure");
        timeline.fromTo(
          ".pressure-word-1",
          { scale: 2.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power4.out" },
          "scene-pressure"
        );
        timeline.fromTo(
          ".pressure-word-2",
          { scale: 2.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power4.out" },
          "scene-pressure+=0.4"
        );
        timeline.fromTo(
          ".pressure-word-3",
          { scale: 2.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power4.out" },
          "scene-pressure+=0.8"
        );
        timeline.to(".scene-pressure", { opacity: 0, duration: 0.3 }, "scene-pressure+=2.4");
        timeline.set(".scene-pressure", { display: "none" }, "scene-pressure+=2.7");

        timeline.addLabel("scene-pause", "scene-pressure+=2.7");
        timeline.set(".scene-pause", { display: "flex", opacity: 1, zIndex: 11 }, "scene-pause");
        timeline.fromTo(
          ".pause-text",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "scene-pause"
        );
        timeline.to(".scene-pause", { opacity: 0, duration: 0.3 }, "scene-pause+=2.2");
        timeline.set(".scene-pause", { display: "none" }, "scene-pause+=2.5");

        timeline.addLabel("scene-brand", "scene-pause+=2.5");
        timeline.set(".scene-brand", { display: "flex", opacity: 1, zIndex: 12 }, "scene-brand");
        timeline.fromTo(
          ".brand-aman",
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power4.out" },
          "scene-brand"
        );
        timeline.fromTo(
          ".brand-klik",
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power4.out" },
          "scene-brand"
        );
        timeline.fromTo(
          ".brand-ai",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" },
          "scene-brand+=0.3"
        );
        timeline.to(".scene-brand", { opacity: 0, duration: 0.3 }, "scene-brand+=2.5");
        timeline.set(".scene-brand", { display: "none" }, "scene-brand+=2.8");

        timeline.addLabel("scene-scan", "scene-brand+=2.8");
        timeline.set(".scene-scan", { display: "flex", opacity: 1, zIndex: 13 }, "scene-scan");
        timeline.fromTo(
          ".scan-workbench",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" },
          "scene-scan"
        );
        timeline.to(".scene-scan", { opacity: 0, duration: 0.3 }, "scene-scan+=3.2");
        timeline.set(".scene-scan", { display: "none" }, "scene-scan+=3.5");

        timeline.addLabel("scene-end", "scene-scan+=3.5");
        timeline.set(".scene-end", { display: "flex", opacity: 1, zIndex: 14 }, "scene-end");
        timeline.fromTo(
          ".end-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "scene-end"
        );
        timeline.fromTo(
          ".end-brand",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out" },
          "scene-end+=0.3"
        );

        timeline.set({}, {}, "scene-end+=3.7");
      }

      timeline.progress(0);
      onReady(timeline.duration());
    },
    { scope: stageRef, dependencies: [timeline, cut, isPortrait] }
  );

  return (
    <div
      ref={stageRef}
      className={`promo-canvas relative shrink-0 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none origin-center`}
      style={{
        width: isPortrait ? "1080px" : "1920px",
        height: isPortrait ? "1920px" : "1080px",
        transform: `scale(${scale})`,
      }}
    >
      <ScenePressure isPortrait={isPortrait} />
      <SceneFamiliar isPortrait={isPortrait} />
      <ScenePause isPortrait={isPortrait} />
      <SceneBrand isPortrait={isPortrait} />
      <SceneScan isPortrait={isPortrait} />
      <SceneExplain isPortrait={isPortrait} />
      <SceneFeatures isPortrait={isPortrait} />
      <SceneImpact isPortrait={isPortrait} />
      <SceneEnd isPortrait={isPortrait} />
    </div>
  );
}
