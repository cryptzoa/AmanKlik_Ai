"use client";

interface SceneBrandProps {
  isPortrait?: boolean;
}

export function SceneBrand({ isPortrait = false }: SceneBrandProps) {
  return (
    <div className="scene-brand absolute inset-0 hidden flex-col items-center justify-center p-6 md:p-12 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none">
      <div className="brand-glow absolute w-[600px] h-[600px] rounded-full bg-[#635BFF]/10 blur-[120px] pointer-events-none" />

      <div
        className="brand-grid absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,91,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,91,255,0.2) 1px, transparent 1px)",
          backgroundSize: isPortrait ? "50px 50px" : "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div
          className={`brand-intro font-mono uppercase tracking-[0.35em] text-[#635BFF] font-bold ${
            isPortrait ? "text-2xl mb-8" : "text-xs md:text-sm mb-6"
          }`}
        >
          Kenalin, AmanKlik AI.
        </div>

        <div
          className="brand-lockup flex items-center font-extrabold tracking-tighter leading-none"
          style={{
            fontSize: isPortrait ? "140px" : "clamp(5.5rem, 12vw, 10.5rem)",
          }}
        >
          <span className="brand-aman inline-block text-[#111111]">AMAN</span>
          <span className="brand-klik inline-block text-[#111111]">KLIK</span>
          <span
            className={`brand-ai inline-block bg-[#635BFF] text-white shadow-xl ${
              isPortrait ? "ml-4 px-5 py-2 rounded-3xl" : "ml-3 md:ml-6 px-3 md:px-6 py-1 md:py-2 rounded-2xl"
            }`}
          >
            AI
          </span>
        </div>

        <div className={`brand-statement flex flex-col items-center gap-3 ${isPortrait ? "mt-12" : "mt-8 md:mt-12"}`}>
          <p
            className="font-bold text-[#111111] tracking-tight"
            style={{ fontSize: isPortrait ? "42px" : "1.75rem" }}
          >
            Pahami risikonya sebelum percaya pesannya.
          </p>
          <p
            className={`font-mono text-[#6f6c65] uppercase tracking-wider font-semibold ${
              isPortrait ? "text-xl" : "text-xs md:text-sm"
            }`}
          >
            Periksa pesan · Pahami tandanya · Ambil langkah aman
          </p>
        </div>
      </div>
    </div>
  );
}
