"use client";

interface ScenePauseProps {
  isPortrait?: boolean;
}

export function ScenePause({ isPortrait = false }: ScenePauseProps) {
  return (
    <div className="scene-pause absolute inset-0 hidden flex-col items-center justify-center p-8 md:p-16 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none">
      <div className="relative z-10 max-w-4xl text-center flex flex-col items-center px-6">
        <p
          className="pause-text font-extrabold tracking-tight leading-[1.08] text-[#111111]"
          style={{
            fontSize: isPortrait ? "80px" : "clamp(2.8rem, 5.5vw, 5.2rem)",
          }}
        >
          Ia terlihat seperti pesan yang harus segera dijawab.
        </p>

        <div
          className={`pause-line bg-[#635BFF] rounded-full ${
            isPortrait ? "w-36 h-2 my-10" : "w-24 h-1 my-8"
          }`}
        />

        <p
          className={`pause-sub font-sans text-[#6f6c65] font-medium leading-relaxed ${
            isPortrait ? "text-3xl max-w-2xl" : "text-sm md:text-lg max-w-lg"
          }`}
        >
          Beri dirimu jeda. Kenali polanya sebelum terlanjur bertindak.
        </p>
      </div>
    </div>
  );
}
