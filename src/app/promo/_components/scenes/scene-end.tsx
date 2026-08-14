"use client";

interface SceneEndProps {
  isPortrait?: boolean;
}

export function SceneEnd({ isPortrait = false }: SceneEndProps) {
  return (
    <div className="scene-end absolute inset-0 hidden flex-col items-center justify-center p-6 md:p-14 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none">
      {/* Moving subtle geometric grid */}
      <div
        className="end-grid absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(17,17,17,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.15) 1px, transparent 1px)",
          backgroundSize: isPortrait ? "40px 40px" : "54px 54px",
        }}
      />

      {/* Centerpiece: Final Call to Action */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-4xl px-4">
        <h2
          className="end-prompt font-extrabold tracking-tight text-[#111111] leading-tight mb-3"
          style={{
            fontSize: isPortrait ? "64px" : "clamp(2.8rem, 5vw, 4.5rem)",
          }}
        >
          Ada pesan yang bikin ragu?
        </h2>

        <h1
          className="end-cta font-extrabold tracking-tight text-[#635BFF] leading-none mb-10"
          style={{
            fontSize: isPortrait ? "80px" : "clamp(3.4rem, 6.2vw, 5.8rem)",
          }}
        >
          Periksa dengan AmanKlik.
        </h1>

        {/* Wordmark Lockup */}
        <div
          className={`end-brand flex items-center font-extrabold tracking-tighter leading-none border-3 border-[#111111] bg-white rounded-3xl shadow-[10px_10px_0_#111111] ${
            isPortrait ? "text-5xl px-8 py-5" : "text-3xl md:text-5xl border-2 px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-[8px_8px_0_#111111]"
          }`}
        >
          <span className="text-[#111111]">AMAN</span>
          <span className="text-[#111111]">KLIK</span>
          <span className="ml-2 text-[#635BFF]">AI</span>
          <span className={`font-mono font-normal text-[#6f6c65] border-l border-[#111111]/20 ${isPortrait ? "text-xl ml-5 pl-5" : "text-xs md:text-sm ml-4 pl-4"}`}>
            amanklik.ai
          </span>
        </div>

        {/* Responsible Safety Guardrail Disclaimer */}
        <p className={`end-disclaimer font-mono text-[#6f6c65] leading-relaxed ${isPortrait ? "mt-10 text-lg max-w-xl" : "mt-8 text-xs max-w-md"}`}>
          AmanKlik membantu mengenali tanda bahaya manipulasi digital. Selalu lakukan verifikasi mandiri ke kanal resmi.
        </p>
      </div>
    </div>
  );
}
