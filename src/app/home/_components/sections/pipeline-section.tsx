"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stages = [
  { step: "01", category: "RULES", title: "Pola Pesan", desc: "Pemeriksaan pola deterministik dari struktur pesan yang masuk untuk mendeteksi anomali." },
  { step: "02", category: "URL", title: "Struktur Domain", desc: "Analisis anatomi tautan untuk membongkar teknik penyamaran domain yang sering digunakan phisher." },
  { step: "03", category: "AI", title: "Konteks Bahasa", desc: "Kecerdasan buatan membaca intensi, gaya bahasa, dan taktik manipulasi psikologis dalam teks." },
  { step: "04", category: "RISK ENGINE", title: "Logika Aplikasi", desc: "Mesin risiko menggabungkan seluruh temuan menjadi satu kesimpulan holistik." },
  { step: "05", category: "RESULT", title: "Skor & Aksi", desc: "Hasil akhir berupa skor bahaya, alasan transparan, dan rekomendasi tindakan." },
];

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
  const pathRefMob = useRef<SVGPathElement>(null);
  const maskRefDesk = useRef<SVGRectElement>(null);
  const maskRefMob = useRef<SVGRectElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const isDesktop = window.innerWidth >= 768;
    const path = isDesktop ? pathRefDesk.current : pathRefMob.current;
    const maskRect = isDesktop ? maskRefDesk.current : maskRefMob.current;
    if (!path || !dotRef.current || !svgContainerRef.current) return;

    const length = path.getTotalLength();

    let width = svgContainerRef.current.clientWidth;
    let height = svgContainerRef.current.clientHeight;

    const onRefresh = () => {
      if (svgContainerRef.current) {
        width = svgContainerRef.current.clientWidth;
        height = svgContainerRef.current.clientHeight;
      }
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Set initial position immediately before scroll
    const startPoint = path.getPointAtLength(0);
    gsap.set(dotRef.current, {
      x: (startPoint.x / 100) * width,
      y: (startPoint.y / 100) * height
    });

    gsap.set("[data-pipeline-node]", { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgContainerRef.current,
        start: "top 40%", 
        end: isDesktop ? "bottom 10%" : "bottom 60%", 
        scrub: isDesktop ? 0.8 : 1.5, 
      }
    });

    tl.to(dotRef.current, {
      ease: "none",
      duration: 0.8,
      onUpdate: function() {
        const progress = this.progress();
        const point = path.getPointAtLength(progress * length);
        gsap.set(dotRef.current, {
          x: (point.x / 100) * width,
          y: (point.y / 100) * height,
        });
        if (maskRect) {
          gsap.set(maskRect, { height: point.y });
        }
        
        // Color dots when passed
        const currentY = point.y;
        const progressDots = gsap.utils.toArray<HTMLElement>("[data-progress-dot]");
        progressDots.forEach((dot) => {
           const thresholdStr = dot.getAttribute("data-threshold");
           if (!thresholdStr) return;
           const threshold = parseFloat(thresholdStr);
           
           if (currentY >= threshold) {
              gsap.to(dot, { borderColor: "rgba(99,91,255, 1)", backgroundColor: "rgba(99,91,255, 1)", duration: 0.2, overwrite: "auto" });
           } else {
              gsap.to(dot, { borderColor: "rgba(99,91,255, 0.2)", backgroundColor: "#f7f5f2", duration: 0.2, overwrite: "auto" });
           }
        });
      }
    }, 0);

    if (isDesktop) {
      tl.to(dotRef.current,
        { scale: 150, duration: 0.3, ease: "power3.inOut" },
        0.7
      );
    }

    const nodes = gsap.utils.toArray<HTMLElement>("[data-pipeline-node]");
    nodes.forEach((node) => {
      gsap.to(node, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: node,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });
    });

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

  }, { scope: root });

  return (
    <section
      ref={root}
      data-pipeline
      className="relative bg-canvas"
    >
      <svg
        data-network
        className="pointer-events-none absolute inset-0 size-full opacity-60"
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
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai">
            03 / Hybrid intelligence
          </p>
          <h2 className="section-title mt-5 max-w-3xl">
            Bukan sekadar tebakan AI mentah.
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

        <svg className="md:hidden absolute inset-0 w-full h-full text-ai" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <mask id="mask-mob" maskUnits="userSpaceOnUse">
              <rect ref={maskRefMob} x="0" y="0" width="100" height="0" fill="white" />
            </mask>
          </defs>
          <path d="M15,0 L15,85" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" fill="none" vectorEffect="non-scaling-stroke" />
          <path ref={pathRefMob} mask="url(#mask-mob)" d="M15,0 L15,85" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* HTML Dots (Empty tracks) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {stages.map((_, i) => {
            const tops = ["15%", "32.5%", "50%", "67.5%", "85%"];
            const isRightDesk = i % 2 === 0;
            const deskLeft = isRightDesk ? "65%" : "35%";
            return (
              <div key={`dots-wrapper-${i}`}>
                <div 
                  data-progress-dot
                  data-threshold={parseFloat(tops[i])}
                  className="md:hidden absolute w-3 h-3 rounded-full border-2 border-ai/20 bg-[#f7f5f2] -ml-[6px] -mt-[6px]" 
                  style={{ left: "15%", top: tops[i] }} 
                />
                <div 
                  data-progress-dot
                  data-threshold={parseFloat(tops[i])}
                  className="hidden md:block absolute w-3 h-3 rounded-full border-2 border-ai/20 bg-[#f7f5f2] -ml-[6px] -mt-[6px]" 
                  style={{ left: deskLeft, top: tops[i] }} 
                />
              </div>
            );
          })}
        </div>

        <div ref={dotRef} className="absolute w-5 h-5 rounded-full bg-ai -ml-[10px] -mt-[10px] z-20 shadow-[0_0_20px_rgba(99,91,255,0.6)]" style={{ left: '0%', top: '0%' }} />

        {stages.map((stage, i) => {
          const tops = ["15%", "32.5%", "50%", "67.5%", "85%"];
          const isRightDesk = i % 2 === 0;
          
          return (
            <div 
              key={stage.step}
              data-pipeline-node
              className={`absolute w-[70%] sm:w-[50%] md:w-[35%] -translate-y-1/2 left-[25%] ${isRightDesk ? "md:left-[70%] md:-translate-x-0" : "md:left-[30%] md:-translate-x-full"} pr-5 md:pr-0`}
              style={{ top: tops[i] }}
            >
              <div className="relative">
                <span className={`absolute -top-12 sm:-top-16 text-[6rem] sm:text-[8rem] font-bold text-ink opacity-5 select-none leading-none tracking-tighter ${isRightDesk ? "-left-8 sm:-left-12" : "-left-8 sm:-left-12 md:left-auto md:-right-12"}`}>
                  {stage.step}
                </span>
                <div className={`relative z-10 ${!isRightDesk ? "md:text-right md:flex md:flex-col md:items-end" : ""}`}>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai font-bold">
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
