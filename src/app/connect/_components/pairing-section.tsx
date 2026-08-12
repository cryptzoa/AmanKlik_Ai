"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  name: string;
  token: string | null;
  status: string | null;
  onNameChange: (name: string) => void;
  onCreate: () => void;
  onCopy: (value: string) => void;
};

export function PairingSection(
  { name, token, status, onNameChange, onCreate, onCopy }: Props,
) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });
  }, { scope: root });

  return (
    <section
      ref={root}
      className="grid gap-8 border-b border-line pb-12 lg:grid-cols-[0.4fr_0.6fr]"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
          Extension pairing
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
          Satu token, satu perangkat.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Token hanya memberi akses membuat pemeriksaan ke sesi anonim ini.
          Token tidak berisi Gemini key dan bisa dicabut kapan saja.
        </p>
      </div>
      <div className="motion-surface p-6 sm:p-8">
        <label className="block text-sm font-semibold">
          Nama perangkat<input
            className="mt-3 min-h-12 w-full border border-line bg-surface px-4"
            value={name}
            maxLength={60}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="mt-5 min-h-12 rounded-full bg-ink px-6 font-semibold text-surface hover:bg-ai"
          onClick={onCreate}
        >
          Buat token extension
        </button>
        {token
          ? (
            <div className="mt-6 border border-ai bg-ai-soft p-4">
              <p className="text-xs font-semibold text-ai">TAMPIL SEKALI</p>
              <code className="mt-3 block break-all text-sm">{token}</code>
              <button
                type="button"
                className="mt-4 min-h-11 rounded-full bg-ai px-4 text-xs font-semibold text-white"
                onClick={() => onCopy(token)}
              >
                Salin token
              </button>
            </div>
          )
          : null}
        {status
          ? <p className="mt-4 text-sm text-muted" role="status">{status}</p>
          : null}
      </div>
    </section>
  );
}
