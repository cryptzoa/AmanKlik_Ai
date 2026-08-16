"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNearViewport } from "@/components/site/use-near-viewport";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const storyBeats = [
  {
    number: "01",
    title: "Terlihat biasa",
    body: "Sapaan akrab membuat pesan terasa seperti percakapan sehari-hari yang wajar.",
    highlightIndex: 0,
  },
  {
    number: "02",
    title: "Waktu dipersempit",
    body: "Kata ‘sekarang’ sengaja dipakai untuk mengurangi ruang kamu untuk berpikir jernih.",
    highlightIndex: 3,
  },
  {
    number: "03",
    title: "Identitas berubah",
    body: "Nomor baru meminta kamu langsung percaya tanpa memeriksa identitasnya.",
    highlightIndex: 1,
  },
  {
    number: "04",
    title: "Permintaan muncul",
    body: "Transfer atau permintaan kode rahasia selalu menjadi tujuan akhir dari tekanan.",
    highlightIndex: 2,
  },
  {
    number: "05",
    title: "Pola dijelaskan",
    body: "AmanKlik memisahkan tanda bahaya ini agar kamu bisa menilainya dengan tenang.",
    highlightIndex: 4,
  }
];

const MessageText = () => (
  <p className="mt-6 max-w-md leading-[2.2] text-lg text-ink">
    <span data-hl="0" className="rounded px-1.5 py-0.5 -ml-1.5 transition-colors">Bu</span>, ini{" "}
    <span data-hl="1" className="rounded px-1.5 py-0.5 -ml-1.5 transition-colors">nomor baru aku</span>. Ada masalah dan{" "}
    <span data-hl="2" className="rounded px-1.5 py-0.5 -ml-1.5 transition-colors">butuh transfer</span>{" "}
    <span data-hl="3" className="rounded px-1.5 py-0.5 -ml-1.5 transition-colors">sekarang</span>.{" "}
    <span data-hl="4" className="rounded px-1.5 py-0.5 -ml-1.5 transition-colors">Jangan telepon dulu</span>.
  </p>
);

export function LandingStorySection() {
  const root = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const motionReady = useNearViewport(root);

  useGSAP(() => {
    if (!motionReady) return;
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 768px)", () => {
      const articles = gsap.utils.toArray<HTMLElement>("[data-story-beat]");

      articles.forEach((article, i) => {
        const wrapper = article.querySelector("[data-story-wrapper]");
        const card = article.querySelector("[data-story-card]");

        if (wrapper) {
          gsap.fromTo(wrapper,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: article,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }

        if (i < articles.length - 1 && card) {
          gsap.to(card, {
            scale: 0.92,
            y: -35,
            opacity: 0.85,
            rotateX: 4,
            transformPerspective: 1000,
            scrollTrigger: {
              trigger: articles[i + 1],
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            }
          });
        }

        ScrollTrigger.create({
          trigger: article,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => activateHighlight(storyBeats[i].highlightIndex, i),
          onEnterBack: () => activateHighlight(storyBeats[i].highlightIndex, i),
        });
      });

      function activateHighlight(hlIndex: number, beatIndex: number) {
        gsap.to("[data-hl]", {
          backgroundColor: "transparent",
          color: "inherit",
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });

        if (beatIndex === 4) {
          gsap.to("[data-hl]", {
            backgroundColor: "var(--ai)",
            color: "#ffffff",
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out"
          });
        } else {
          gsap.to(`[data-hl="${hlIndex}"]`, {
            backgroundColor: "var(--warning)",
            color: "#ffffff",
            scale: 1.05,
            duration: 0.5,
            ease: "back.out(2)"
          });
        }
      }

      const cardMain = cardRef.current;
      if (cardMain) {
        const onMouseMove = (e: MouseEvent) => {
          const rect = cardMain.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;

          gsap.to(cardMain, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            ease: "power3.out",
            duration: 0.6
          });
        };

        const onMouseLeave = () => {
          gsap.to(cardMain, {
            rotateX: 0,
            rotateY: 0,
            ease: "elastic.out(1, 0.5)",
            duration: 1.2
          });
        };

        const wrapper = cardMain.parentElement;
        if (wrapper) {
          wrapper.addEventListener("mousemove", onMouseMove);
          wrapper.addEventListener("mouseleave", onMouseLeave);
          return () => {
            wrapper.removeEventListener("mousemove", onMouseMove);
            wrapper.removeEventListener("mouseleave", onMouseLeave);
          };
        }
      }
    });

    media.add("(max-width: 767px)", () => {
       gsap.utils.toArray<HTMLElement>("[data-story-beat]").forEach((article) => {
         const card = article.querySelector("[data-story-card]");
         if (card) {
           gsap.fromTo(card,
             { opacity: 0, y: 40 },
             {
               opacity: 1,
               y: 0,
               duration: 0.8,
               ease: "power3.out",
               scrollTrigger: {
                 trigger: article,
                 start: "top 90%",
                 toggleActions: "play none none reverse"
               }
             }
           );
         }
       });
    });

    return () => media.revert();
  }, {
    dependencies: [motionReady],
    revertOnUpdate: true,
    scope: root,
  });

  return (
    <section
      ref={root}
      data-story
      className="bg-canvas border-b border-line px-5 sm:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1320px] gap-10 py-16 md:gap-14 md:py-24 md:grid-cols-[1fr_1fr] md:py-[15vh]">

        <div className="self-start md:sticky md:top-[15vh] perspective-1000">
          <div className="w-full">

            <p className="eyebrow-label text-muted">
              02 / Cara pola terbentuk
            </p>
            <h2 className="section-title mt-5 max-w-xl text-ink">
              Satu pesan. Beberapa lapis tekanan.
            </h2>

            <div
              ref={cardRef}
              className="pressure-card relative mt-8 md:mt-12 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-xl shadow-ink/5 border border-line/10 p-6 sm:p-8 md:p-10 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex items-center justify-between border-b border-line/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="size-10 md:size-12 rounded-full bg-ink/5 flex items-center justify-center">
                    <svg className="size-5 md:size-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm md:text-base">Kontak tidak dikenal</p>
                    <p className="text-xs md:text-sm text-muted mt-0.5">+62 812-XXXX-XXXX</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-muted">18.42</span>
              </div>

              <MessageText />

            </div>
          </div>
        </div>

        <div className="relative md:pt-[14rem]">
          {storyBeats.map((beat) => (
            <article
              key={beat.number}
              data-story-beat
              className="relative flex items-center md:h-[55vh] py-6 md:py-0"
            >
              <div
                data-story-wrapper
                className="w-full max-w-md md:sticky md:top-[calc(15vh+14rem)] will-change-transform"
              >
                <div
                  data-story-card
                  className="bg-white p-8 sm:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line/5 will-change-transform"
                >
                  <div className="flex items-center gap-3">
                     <span className="flex size-8 items-center justify-center rounded-full bg-ai/10 text-xs font-bold text-ai-text">
                       {beat.number}
                     </span>
                     <span className="text-xs font-semibold tracking-wider text-muted uppercase">Langkah</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {beat.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {beat.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
