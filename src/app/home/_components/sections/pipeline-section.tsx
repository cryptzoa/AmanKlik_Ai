"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stages = [
  { step: "01", category: "PESAN", title: "Mencari pola", desc: "AmanKlik mencari kata dan pola yang sering muncul dalam pesan penipuan." },
  { step: "02", category: "TAUTAN", title: "Membaca alamat", desc: "Bagian alamat dipisahkan agar alamat utama lebih mudah dikenali." },
  { step: "03", category: "AI", title: "Memahami konteks", desc: "AI membantu membaca cara pesan mendesak, membujuk, atau meminta sesuatu yang sensitif." },
  { step: "04", category: "PENILAIAN", title: "Menggabungkan temuan", desc: "Semua tanda bahaya dinilai bersama agar tidak bergantung pada satu petunjuk saja." },
  { step: "05", category: "HASIL", title: "Menjelaskan langkah", desc: "Kamu mendapat tingkat risiko, alasan yang bisa diperiksa, dan tindakan yang disarankan." },
];

const stageTops = [15, 32.5, 50, 67.5, 85] as const;

const networkPoints = [
  [50, 145], [170, 96], [264, 104], [338, 228], [492, 164],
  [582, 286], [730, 240], [1100, 70], [1216, 150], [1302, 112],
  [1418, 244], [1540, 218], [78, 650], [198, 626], [270, 716],
  [402, 605], [500, 664], [1048, 668], [1178, 594], [1280, 690],
  [1390, 578], [1570, 650],
];

export function LandingPipelineSection() {
  const root = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const pathRefDesk = useRef<SVGPathElement>(null);
  const maskRefDesk = useRef<SVGRectElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const container = svgContainerRef.current;
    const movingDot = dotRef.current;
    if (!container || !movingDot) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      const path = pathRefDesk.current;
      const maskRect = maskRefDesk.current;
      if (!path || !maskRect) return;

      const nodes = gsap.utils.toArray<HTMLElement>("[data-pipeline-node]");
      gsap.set(nodes, { opacity: 0, y: 50 });
      nodes.forEach((node) => {
        gsap.to(node, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const length = path.getTotalLength();
      const progressDots = gsap.utils.toArray<HTMLElement>(
        '[data-progress-dot="desktop"]',
      );
      const dotStates = progressDots.map(() => false);
      const setX = gsap.quickSetter(movingDot, "x", "px");
      const setY = gsap.quickSetter(movingDot, "y", "px");
      let width = container.clientWidth;
      let height = container.clientHeight;

      const updateDimensions = () => {
        width = container.clientWidth;
        height = container.clientHeight;
      };
      ScrollTrigger.addEventListener("refreshInit", updateDimensions);

      const startPoint = path.getPointAtLength(0);
      setX((startPoint.x / 100) * width);
      setY((startPoint.y / 100) * height);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 40%",
          end: "bottom 10%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(movingDot, {
        ease: "none",
        duration: 0.8,
        onUpdate() {
          const point = path.getPointAtLength(this.progress() * length);
          setX((point.x / 100) * width);
          setY((point.y / 100) * height);
          maskRect.setAttribute("height", String(point.y));

          progressDots.forEach((dot, index) => {
            const active = point.y >= stageTops[index];
            if (active === dotStates[index]) return;
            dotStates[index] = active;
            gsap.to(dot, {
              borderColor: active
                ? "rgba(99,91,255,1)"
                : "rgba(99,91,255,0.2)",
              backgroundColor: active ? "rgba(99,91,255,1)" : "#f7f5f2",
              duration: 0.16,
              overwrite: "auto",
            });
          });
        },
      }, 0);

      timeline.to(
        movingDot,
        { scale: 150, duration: 0.3, ease: "power3.inOut" },
        0.7,
      );

      gsap.utils.toArray<HTMLElement>("[data-network-node]").forEach(
        (node, index) => {
          gsap.to(node, {
            y: index % 2 ? -10 : 12,
            x: index % 2 ? 5 : -4,
            rotation: index % 2 ? "+=1" : "-=1",
            duration: 3.8 + index * 0.45,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      );

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", updateDimensions);
      };
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <section
      ref={root}
      data-pipeline
      className="relative bg-canvas"
    >
      <svg
        data-network
        className="pointer-events-none absolute inset-0 hidden size-full opacity-60 md:block"
        viewBox="0 0 1600 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="reference-network-lines">
          <path d="M50 145 L170 96 L264 104 L338 228 L492 164 L582 286 L730 240" />
          <path d="M1100 70 L1216 150 L1302 112 L1418 244 L1540 218" />
          <path d="M78 650 L198 626 L270 716 L402 605 L500 664" />
          <path d="M1048 668 L1178 594 L1280 690 L1390 578 L1570 650" />
        </g>
        {networkPoints.map(([cx, cy], index) => (
          <circle
            data-network-node
            key={`${cx}-${cy}`}
            className="reference-network-node"
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 2 : 1.1}
          />
        ))}
      </svg>
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-10 lg:px-16 pt-24 sm:pt-32">
        <div className="flex flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai-text">
            03 / Cara AmanKlik memeriksa
          </p>
          <h2 className="section-title mt-5 max-w-3xl">
            Tidak hanya mengandalkan tebakan AI.
          </h2>
        </div>
      </div>

      <div data-pipeline-container ref={svgContainerRef} className="relative z-10 mt-20 w-full h-[120vh] sm:h-[150vh] mx-auto max-w-[1320px]">
        <svg className="hidden md:block absolute inset-0 w-full h-full text-ai" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <mask id="mask-desk" maskUnits="userSpaceOnUse">
              <rect ref={maskRefDesk} x="0" y="0" width="100" height="0" fill="white" />
            </mask>
          </defs>
          <path d="M50,0 C50,10 65,10 65,15 C65,25 35,25 35,32.5 C35,42.5 65,42.5 65,50 C65,60 35,60 35,67.5 C35,77.5 65,77.5 65,85 C65,95 50,95 50,100" fill="none" stroke="currentColor" strokeWidth="4" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" />
          <path ref={pathRefDesk} mask="url(#mask-desk)" d="M50,0 C50,10 65,10 65,15 C65,25 35,25 35,32.5 C35,42.5 65,42.5 65,50 C65,60 35,60 35,67.5 C35,77.5 65,77.5 65,85 C65,95 50,95 50,100" fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" />
        </svg>

        <svg className="absolute inset-0 h-full w-full text-ai md:hidden" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M15,0 L15,85" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" fill="none" vectorEffect="non-scaling-stroke" />
          <path d="M15,0 L15,85" stroke="currentColor" strokeWidth="2" strokeOpacity="0.45" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {stages.map((_, i) => {
            const top = `${stageTops[i]}%`;
            const isRightDesk = i % 2 === 0;
            const deskLeft = isRightDesk ? "65%" : "35%";
            return (
              <div key={`dots-wrapper-${i}`}>
                <div 
                  data-progress-dot="mobile"
                  className="absolute -ml-[6px] -mt-[6px] h-3 w-3 rounded-full border-2 border-ai/50 bg-[#f7f5f2] md:hidden"
                  style={{ left: "15%", top }}
                />
                <div 
                  data-progress-dot="desktop"
                  className="hidden md:block absolute w-3 h-3 rounded-full border-2 border-ai/20 bg-[#f7f5f2] -ml-[6px] -mt-[6px]" 
                  style={{ left: deskLeft, top }}
                />
              </div>
            );
          })}
        </div>

        <div data-pipeline-moving-dot ref={dotRef} className="absolute z-20 -ml-[10px] -mt-[10px] hidden h-5 w-5 rounded-full bg-ai shadow-[0_0_20px_rgba(99,91,255,0.6)] md:block" style={{ left: '0%', top: '0%' }} />

        {stages.map((stage, i) => {
          const isRightDesk = i % 2 === 0;
          
          return (
            <div 
              key={stage.step}
              data-pipeline-node
              className={`absolute w-[70%] sm:w-[50%] md:w-[35%] -translate-y-1/2 left-[25%] ${isRightDesk ? "md:left-[70%] md:-translate-x-0" : "md:left-[30%] md:-translate-x-full"} pr-5 md:pr-0`}
              style={{ top: `${stageTops[i]}%` }}
            >
              <div className="relative">
                <span className={`absolute -top-12 sm:-top-16 text-[6rem] sm:text-[8rem] font-bold text-ink opacity-5 select-none leading-none tracking-tighter ${isRightDesk ? "-left-8 sm:-left-12" : "-left-8 sm:-left-12 md:left-auto md:-right-12"}`}>
                  {stage.step}
                </span>
                <div className={`relative z-10 ${!isRightDesk ? "md:text-right md:flex md:flex-col md:items-end" : ""}`}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai-text font-bold">
                    {stage.category}
                  </p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                    {stage.title}
                  </h3>
                  <p className={`mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-sm ${!isRightDesk ? "md:ml-auto" : ""}`}>
                    {stage.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
