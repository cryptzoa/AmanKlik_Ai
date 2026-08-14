"use client";

interface SceneFamiliarProps {
  isPortrait?: boolean;
}

export function SceneFamiliar({ isPortrait = false }: SceneFamiliarProps) {
  return (
    <div className="scene-familiar absolute inset-0 hidden flex-col items-center justify-center p-6 md:p-12 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none">
      {/* Background subtle grain/rules */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)",
          backgroundSize: isPortrait ? "48px 48px" : "48px 48px",
        }}
      />

      {/* Editorial Headline */}
      <div
        className={`familiar-headline relative z-10 text-center ${
          isPortrait ? "max-w-3xl mb-12" : "max-w-2xl mb-8 md:mb-12"
        }`}
      >
        <h2
          className="font-extrabold tracking-tight leading-[1.08]"
          style={{
            fontSize: isPortrait ? "72px" : "clamp(2.4rem, 4.5vw, 3.8rem)",
          }}
        >
          Penipuan jarang terlihat seperti penipuan.
        </h2>
      </div>

      {/* Layered Synthetic Chat Simulator Box */}
      <div
        className={`familiar-chat-box relative z-10 w-full ${
          isPortrait ? "w-[90%] max-w-[880px] p-8 gap-5 border-[3px] shadow-[12px_12px_0_#111111] rounded-3xl" : "max-w-lg p-5 md:p-7 gap-3 border-2 shadow-[8px_8px_0_#111111] rounded-2xl"
        } bg-[#fffefa] border-[#111111] flex flex-col`}
      >
        {/* Chat header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#111111]/15">
          <div className="flex items-center gap-4">
            <div
              className={`rounded-full bg-[#111111] text-[#F3F1EA] flex items-center justify-center font-mono font-bold ${
                isPortrait ? "w-14 h-14 text-xl" : "w-9 h-9 text-xs"
              }`}
            >
              ?
            </div>
            <div>
              <div
                className={`font-bold leading-tight text-[#111111] flex items-center gap-2.5 ${
                  isPortrait ? "text-2xl" : "text-sm"
                }`}
              >
                +62 821-9981-0421
                <span
                  className={`font-mono bg-[#E9362F]/15 text-[#E9362F] rounded font-semibold ${
                    isPortrait ? "text-sm px-2 py-0.5" : "text-[10px] px-1.5 py-0.5"
                  }`}
                >
                  Nomor Asing
                </span>
              </div>
              <div className={isPortrait ? "text-base text-[#6f6c65] mt-0.5" : "text-[11px] text-[#6f6c65]"}>
                Kemarin, 14:02
              </div>
            </div>
          </div>
          <span className={`font-mono text-[#6f6c65] uppercase ${isPortrait ? "text-sm" : "text-[10px]"}`}>
            Sintetis
          </span>
        </div>

        {/* Message bubble */}
        <div
          className={`bg-[#f7f6f2] border border-[#111111]/15 rounded-2xl flex flex-col gap-3 ${
            isPortrait ? "p-6" : "p-4"
          }`}
        >
          <p
            className={`familiar-bubble-text text-[#292824] ${
              isPortrait ? "text-2xl leading-relaxed" : "text-sm md:text-base leading-relaxed"
            }`}
          >
            <span className="familiar-fragment-1">Ma, ini nomor baru aku. Nomor lama lagi rusak. </span>
            <span className="familiar-risk-phrase familiar-risk-1 font-bold text-[#E9362F] bg-[#FFE4E1] px-1.5 py-0.5 rounded transition-all">
              Lagi meeting
            </span>{" "}
            <span className="familiar-fragment-2">dan ada keperluan sangat mendesak. </span>
            <span className="familiar-risk-phrase familiar-risk-2 font-bold text-[#E9362F] bg-[#FFE4E1] px-1.5 py-0.5 rounded transition-all">
              Tolong transfer sekarang
            </span>{" "}
            <span className="familiar-fragment-3">ke rek BCA 8821092192 an Rahmat. </span>
            <span className="familiar-risk-phrase familiar-risk-3 font-bold text-[#E9362F] bg-[#FFE4E1] px-1.5 py-0.5 rounded transition-all">
              Jangan telepon dulu
            </span>
            <span className="familiar-fragment-4"> ya.</span>
          </p>
          <div className={`text-right font-mono text-[#6f6c65] ${isPortrait ? "text-sm" : "text-[10px]"}`}>
            14:02 · Dibaca
          </div>
        </div>

        {/* Manipulation pattern indicators */}
        <div className="familiar-tags flex flex-wrap gap-2 pt-1">
          <span
            className={`font-mono bg-[#111111] text-[#F3F1EA] rounded-full font-medium ${
              isPortrait ? "text-base px-4 py-1.5" : "text-[11px] px-2 py-0.5"
            }`}
          >
            Mengaku Kerabat
          </span>
          <span
            className={`font-mono bg-[#E9362F] text-white rounded-full font-medium ${
              isPortrait ? "text-base px-4 py-1.5" : "text-[11px] px-2 py-0.5"
            }`}
          >
            Minta Uang Cepat
          </span>
          <span
            className={`font-mono bg-[#111111] text-[#F3F1EA] rounded-full font-medium ${
              isPortrait ? "text-base px-4 py-1.5" : "text-[11px] px-2 py-0.5"
            }`}
          >
            Menghindari Telepon
          </span>
        </div>
      </div>
    </div>
  );
}
