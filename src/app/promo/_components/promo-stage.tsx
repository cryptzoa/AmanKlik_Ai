"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PromoStageProps {
  timeline: gsap.core.Timeline;
  ratio: "16x9" | "9x16";
  cut: "master" | "15s";
  onReady: (duration: number) => void;
}

export function PromoStage({ timeline, ratio, cut, onReady }: PromoStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!timeline) return;

    // Clear timeline to avoid duplicate animations on re-render
    timeline.clear();

    const isShort = cut === "15s";
    
    // We create the scenes based on the master storyboard
    // Helper function to calculate timings
    const d = (masterDuration: number, shortDuration: number) => isShort ? shortDuration : masterDuration;

    // --- SCENE 1: PRESSURE ---
    timeline.addLabel("scene-pressure", 0);
    timeline.set(".scene-pressure", { display: "flex", opacity: 1 }, "scene-pressure");
    timeline.fromTo(".pressure-word-1", { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power4.out" }, "scene-pressure");
    timeline.fromTo(".pressure-word-2", { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power4.out" }, "scene-pressure+=0.8");
    timeline.fromTo(".pressure-word-3", { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power4.out" }, "scene-pressure+=1.6");
    
    timeline.to(".scene-pressure", { opacity: 0, duration: 0.3 }, "scene-pressure+=" + d(4, 2));

    // --- SCENE 2: FAMILIAR MESSAGE ---
    timeline.addLabel("scene-familiar", ">");
    timeline.set(".scene-familiar", { display: "flex", opacity: 1 }, "scene-familiar");
    timeline.fromTo(".familiar-text", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "expo.out" }, "scene-familiar");
    timeline.to(".scene-familiar", { opacity: 0, duration: 0.3 }, "scene-familiar+=" + d(4, 2));

    // --- SCENE 3: THE PAUSE ---
    timeline.addLabel("scene-pause", ">");
    timeline.set(".scene-pause", { display: "flex", opacity: 1 }, "scene-pause");
    timeline.fromTo(".pause-text", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "scene-pause");
    timeline.to(".scene-pause", { opacity: 0, duration: 0.3 }, "scene-pause+=" + d(4, 2));

    // --- SCENE 4: BRAND REVEAL ---
    timeline.addLabel("scene-brand", ">");
    timeline.set(".scene-brand", { display: "flex", opacity: 1 }, "scene-brand");
    timeline.fromTo(".brand-aman", { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power4.out" }, "scene-brand");
    timeline.fromTo(".brand-klik", { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power4.out" }, "scene-brand");
    timeline.fromTo(".brand-ai", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }, "scene-brand+=0.5");
    timeline.fromTo(".brand-subtitle", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "scene-brand+=1");
    timeline.to(".scene-brand", { opacity: 0, duration: 0.5 }, "scene-brand+=" + d(4, 2));

    // --- SCENE 5: SCAN ---
    timeline.addLabel("scene-scan", ">");
    timeline.set(".scene-scan", { display: "flex", opacity: 1 }, "scene-scan");
    timeline.fromTo(".scan-ui-mask", { clipPath: "inset(50% 50% 50% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, "scene-scan");
    timeline.fromTo(".scan-text", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.3 }, "scene-scan+=1");
    timeline.to(".scene-scan", { opacity: 0, duration: 0.5 }, "scene-scan+=" + d(8, 3));

    // --- SCENE 6: EXPLAINABILITY (Skip in 15s) ---
    if (!isShort) {
      timeline.addLabel("scene-explain", ">");
      timeline.set(".scene-explain", { display: "flex", opacity: 1 }, "scene-explain");
      timeline.fromTo(".explain-text-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "scene-explain");
      timeline.fromTo(".explain-text-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "scene-explain+=1.5");
      timeline.to(".scene-explain", { opacity: 0, duration: 0.5 }, "scene-explain+=7");
    }

    // --- SCENE 7: FEATURE SYSTEM (Skip in 15s) ---
    if (!isShort) {
      timeline.addLabel("scene-features", ">");
      timeline.set(".scene-features", { display: "grid", opacity: 1 }, "scene-features");
      timeline.fromTo(".feature-word", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.2)" }, "scene-features");
      timeline.to(".scene-features", { opacity: 0, duration: 0.5 }, "scene-features+=4");
    }

    // --- SCENE 8: IMPACT (Skip in 15s) ---
    if (!isShort) {
      timeline.addLabel("scene-impact", ">");
      timeline.set(".scene-impact", { display: "flex", opacity: 1 }, "scene-impact");
      timeline.fromTo(".impact-text", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 1.5, ease: "expo.out" }, "scene-impact");
      timeline.to(".scene-impact", { opacity: 0, duration: 0.5 }, "scene-impact+=6");
    }

    // --- SCENE 9: END CARD ---
    timeline.addLabel("scene-end", ">");
    timeline.set(".scene-end", { display: "flex", opacity: 1 }, "scene-end");
    timeline.fromTo(".end-grid", { opacity: 0 }, { opacity: 0.1, duration: 2 }, "scene-end");
    timeline.fromTo(".end-text-1", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "scene-end+=0.5");
    timeline.fromTo(".end-text-2", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "scene-end+=1.5");
    
    // Hold final frame
    timeline.set({}, {}, "+=3");

    // Force GSAP to evaluate and render the initial state (time=0)
    timeline.progress(0);

    onReady(timeline.duration());
  }, { scope: stageRef, dependencies: [timeline, cut] });

  const isPortrait = ratio === "9x16";

  return (
    <div 
      ref={stageRef}
      className={`relative bg-[#F3F1EA] text-[#111111] overflow-hidden ${isPortrait ? 'w-[400px] h-[711px]' : 'w-[960px] h-[540px]'} shadow-2xl rounded-sm ring-1 ring-black/5 mx-auto`}
      style={{
        // Use transform scale to fit nicely in preview, but keep aspect ratio fixed
        transform: `scale(var(--stage-scale, 1))`
      }}
    >
      {/* SCENE 1: PRESSURE */}
      <div className="scene-pressure absolute inset-0 hidden bg-[#111111] text-[#F3F1EA] flex-col items-center justify-center p-8 text-center uppercase tracking-tighter font-extrabold" style={{ fontSize: isPortrait ? '4rem' : '7rem', lineHeight: 0.9 }}>
        <div className="pressure-word-1 text-[#635BFF]">SEKARANG.</div>
        <div className="pressure-word-2">TRANSFER.</div>
        <div className="pressure-word-3">JANGAN TELEPON.</div>
      </div>

      {/* SCENE 2: FAMILIAR MESSAGE */}
      <div className="scene-familiar absolute inset-0 hidden flex-col items-center justify-center p-12 text-center bg-[#F3F1EA]">
        <div className="familiar-text text-3xl md:text-5xl font-bold tracking-tight mb-4">Penipuan jarang terlihat seperti penipuan.</div>
        {/* Placeholder for synthetic chat layers */}
        <div className="familiar-text w-full max-w-md h-32 bg-black/5 rounded-2xl border border-black/10 mt-8 flex items-center justify-center font-mono text-sm text-black/50">
          [Synthetic Chat UI Placeholder]
        </div>
      </div>

      {/* SCENE 3: THE PAUSE */}
      <div className="scene-pause absolute inset-0 hidden flex-col items-center justify-center p-12 text-center bg-[#F3F1EA]">
        <div className="pause-text text-2xl md:text-4xl font-medium tracking-tight">Ia terlihat seperti pesan yang harus segera dijawab.</div>
      </div>

      {/* SCENE 4: BRAND REVEAL */}
      <div className="scene-brand absolute inset-0 hidden flex-col items-center justify-center bg-[#F3F1EA]">
        <div className="flex items-center text-6xl md:text-8xl font-extrabold tracking-tighter">
          <span className="brand-aman">AMAN</span>
          <span className="brand-klik">KLIK</span>
          <span className="brand-ai ml-2 text-[#635BFF]">AI</span>
        </div>
        <div className="brand-subtitle mt-6 font-mono tracking-widest text-sm uppercase font-semibold">Kenalin, AmanKlik AI.</div>
      </div>

      {/* SCENE 5: SCAN */}
      <div className="scene-scan absolute inset-0 hidden flex-col items-center justify-center p-8 bg-[#F3F1EA]">
        <div className="scan-ui-mask absolute inset-8 bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col">
          <div className="flex-1 bg-black/5 flex items-center justify-center font-mono text-sm text-black/50">
            [Product Scanner UI Placeholder]
          </div>
        </div>
        <div className="absolute bottom-16 left-16 flex flex-col gap-2 text-2xl font-bold tracking-tight">
          <div className="scan-text bg-white px-4 py-2 rounded-lg shadow-sm">Pesan.</div>
          <div className="scan-text bg-white px-4 py-2 rounded-lg shadow-sm">Screenshot.</div>
          <div className="scan-text bg-white px-4 py-2 rounded-lg shadow-sm">Tautan.</div>
        </div>
      </div>

      {/* SCENE 6: EXPLAINABILITY */}
      <div className="scene-explain absolute inset-0 hidden flex-col items-start justify-center p-16 bg-[#111111] text-[#F3F1EA]">
        <div className="w-full flex-1 flex gap-8">
          <div className="flex-1 bg-white/5 rounded-2xl flex items-center justify-center font-mono text-sm text-white/50 border border-white/10">
            [Explainability Result UI Placeholder]
          </div>
          <div className="flex-1 flex flex-col justify-center text-4xl md:text-5xl font-bold tracking-tight">
            <div className="explain-text-1 mb-4 text-white/50">Bukan cuma memberi skor.</div>
            <div className="explain-text-2 text-[#635BFF]">AmanKlik menjelaskan kenapa.</div>
          </div>
        </div>
      </div>

      {/* SCENE 7: FEATURE SYSTEM */}
      <div className="scene-features absolute inset-0 hidden grid grid-cols-2 grid-rows-2 bg-[#F3F1EA]">
        <div className="flex items-center justify-center border-r border-b border-black/10">
          <span className="feature-word text-4xl font-extrabold tracking-tighter">PERIKSA</span>
        </div>
        <div className="flex items-center justify-center border-b border-black/10">
          <span className="feature-word text-4xl font-extrabold tracking-tighter">PAHAMI</span>
        </div>
        <div className="flex items-center justify-center border-r border-black/10">
          <span className="feature-word text-4xl font-extrabold tracking-tighter">BERTINDAK</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="feature-word text-4xl font-extrabold tracking-tighter">LATIH</span>
        </div>
      </div>

      {/* SCENE 8: IMPACT */}
      <div className="scene-impact absolute inset-0 hidden flex-col justify-center p-16 bg-[#635BFF] text-white">
        <div className="impact-text text-5xl font-extrabold tracking-tighter mb-8 leading-none">Berhenti sebelum transfer.</div>
        <div className="impact-text text-5xl font-extrabold tracking-tighter mb-8 leading-none">Verifikasi lewat kanal resmi.</div>
        <div className="impact-text text-5xl font-extrabold tracking-tighter leading-none">Ambil keputusan dengan konteks.</div>
      </div>

      {/* SCENE 9: END CARD */}
      <div className="scene-end absolute inset-0 hidden flex-col items-center justify-center bg-[#F3F1EA]">
        {/* Subtle grid */}
        <div className="end-grid absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, transparent calc(100% - 1px), #111111 1px), linear-gradient(to bottom, transparent calc(100% - 1px), #111111 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="z-10 flex flex-col items-center text-center px-4">
          <div className="end-text-1 text-3xl md:text-5xl font-bold tracking-tight mb-4">Ada pesan yang bikin ragu?</div>
          <div className="end-text-2 text-3xl md:text-5xl font-bold tracking-tight text-[#635BFF]">Periksa dengan AmanKlik.</div>
          
          <div className="mt-12 flex items-center text-3xl font-extrabold tracking-tighter end-text-2">
            AMAN<span className="">KLIK</span><span className="text-[#635BFF] ml-1">AI</span>
          </div>
        </div>
      </div>

    </div>
  );
}
