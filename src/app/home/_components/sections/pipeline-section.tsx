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
    
    // Set nodes initial state
    gsap.set("[data-pipeline-node]", { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgContainerRef.current,
        start: "top 40%", 
        end: "bottom 10%", 
        scrub: 0.5, 
      }
    });

    // Phase 1: Move the dot and reveal the line via mask (takes first 80% of timeline)
    tl.to(dotRef.current, {
      ease: "none",
      duration: 0.8,
      onUpdate: function() {
        const progress = this.progress(); // Progress of this specific tween (0 to 1)
        const point = path.getPointAtLength(progress * length);
        gsap.set(dotRef.current, {
          left: `${point.x}%`,
          top: `${point.y}%`
        });
        if (maskRect) {
          gsap.set(maskRect, { height: point.y });
        }
      }
    }, 0);

    // Phase 2: Pipeline Explosion (overlaps with the end of the dot's movement)
    tl.to(dotRef.current, 
      { scale: 150, duration: 0.3, ease: "power3.inOut" },
      0.7 // Start slightly before the dot finishes
    );

    // Independent ScrollTriggers for Text Nodes
    const nodes = gsap.utils.toArray("[data-pipeline-node]");
    nodes.forEach((node: any) => {
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

  }, { scope: root });

  return (
    <section
      ref={root}
      data-pipeline
      className="relative bg-[#f7f5f2]"
    >
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
        {/* Desktop Winding Path */}
        <svg className="hidden md:block absolute inset-0 w-full h-full text-ai" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <mask id="mask-desk">
              <rect ref={maskRefDesk} x="0" y="0" width="100" height="0" fill="white" />
            </mask>
          </defs>
          <path ref={pathRefDesk} mask="url(#mask-desk)" d="M50,0 C50,10 65,10 65,15 C65,25 35,25 35,32.5 C35,42.5 65,42.5 65,50 C65,60 35,60 35,67.5 C35,77.5 65,77.5 65,85 C65,95 50,95 50,100" fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Mobile Winding Path */}
        <svg className="md:hidden absolute inset-0 w-full h-full text-ai" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <mask id="mask-mob">
              <rect ref={maskRefMob} x="0" y="0" width="100" height="0" fill="white" />
            </mask>
          </defs>
          <path ref={pathRefMob} mask="url(#mask-mob)" d="M20,0 C20,10 30,10 30,15 C30,25 10,25 10,32.5 C10,42.5 30,42.5 30,50 C30,60 10,60 10,67.5 C10,77.5 30,77.5 30,85 C30,95 50,95 50,100" fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Traveling Dot */}
        <div ref={dotRef} className="absolute w-5 h-5 rounded-full bg-ai -ml-[10px] -mt-[10px] z-20 shadow-[0_0_20px_rgba(99,91,255,0.6)]" style={{ left: '50%', top: '0%' }} />

        {/* Text Nodes */}
        {stages.map((stage, i) => {
          const tops = ["15%", "32.5%", "50%", "67.5%", "85%"];
          const isRightDesk = i % 2 === 0;
          
          return (
            <div 
              key={stage.step}
              data-pipeline-node
              className={`absolute w-[60%] sm:w-[45%] md:w-[35%] -translate-y-1/2 left-[40%] sm:left-[35%] ${isRightDesk ? "md:left-[70%] md:-translate-x-0" : "md:left-[30%] md:-translate-x-full"} pr-5 md:pr-0`}
              style={{ top: tops[i] }}
            >
              <div className="relative">
                <span className="absolute -top-12 -left-8 sm:-top-16 sm:-left-12 text-[6rem] sm:text-[8rem] font-bold text-ink opacity-5 select-none leading-none tracking-tighter">
                  {stage.step}
                </span>
                <div className="relative z-10">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai font-bold">
                    {stage.category}
                  </p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-sm">
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
