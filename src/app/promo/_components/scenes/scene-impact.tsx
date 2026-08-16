"use client";

interface SceneImpactProps {
  isPortrait?: boolean;
}

export function SceneImpact({ isPortrait = false }: SceneImpactProps) {
  return (
    <div className="scene-impact absolute inset-0 hidden flex-col justify-center p-6 md:p-14 bg-[#111111] text-[#F3F1EA] overflow-hidden select-none">
      <div
        className={`relative z-10 my-auto flex flex-col justify-center ${
          isPortrait ? "gap-10 max-w-2xl px-4" : "gap-8 md:gap-10 max-w-5xl px-4 md:px-8"
        }`}
      >
        <div
          className="impact-line-1 font-extrabold tracking-tight text-[#F3F1EA] leading-[1.08]"
          style={{
            fontSize: isPortrait ? "72px" : "clamp(2.5rem, 5.5vw, 4.8rem)",
          }}
        >
          Berhenti sebelum transfer.
        </div>

        <div
          className="impact-line-2 font-extrabold tracking-tight text-[#635BFF] leading-[1.08]"
          style={{
            fontSize: isPortrait ? "72px" : "clamp(2.5rem, 5.5vw, 4.8rem)",
          }}
        >
          Pastikan lewat sumber resmi.
        </div>

        <div
          className="impact-line-3 font-extrabold tracking-tight text-[#38D9A9] leading-[1.08]"
          style={{
            fontSize: isPortrait ? "72px" : "clamp(2.5rem, 5.5vw, 4.8rem)",
          }}
        >
          Putuskan setelah memahami alasannya.
        </div>
      </div>
    </div>
  );
}
