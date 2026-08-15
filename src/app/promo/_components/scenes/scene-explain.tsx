"use client";

interface SceneExplainProps {
  isPortrait?: boolean;
}

export function SceneExplain({ isPortrait = false }: SceneExplainProps) {
  return (
    <div className="scene-explain absolute inset-0 hidden flex-col justify-center p-6 md:p-14 bg-[#111111] text-[#F3F1EA] overflow-hidden select-none">
      <div className={`relative z-10 my-auto grid ${isPortrait ? "grid-cols-1 gap-6 w-[94%]" : "grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 max-w-6xl w-full"} items-center mx-auto`}>
        <div className={`${isPortrait ? "w-full text-center" : "md:col-span-5"} flex flex-col gap-3`}>
          <h2
            className="explain-text-1 font-bold text-[#F3F1EA]/60 tracking-tight leading-tight"
            style={{ fontSize: isPortrait ? "42px" : "2.4rem" }}
          >
            Bukan cuma memberi skor.
          </h2>
          <p
            className="explain-text-2 font-extrabold text-[#635BFF] tracking-tight leading-none"
            style={{ fontSize: isPortrait ? "56px" : "3.4rem" }}
          >
            AmanKlik menjelaskan kenapa.
          </p>
          <p className={`explain-desc text-[#F3F1EA]/70 mt-2 leading-relaxed ${isPortrait ? "text-xl max-w-xl mx-auto" : "text-xs md:text-sm"}`}>
            Bukan sekadar tebak-tebakan. AmanKlik tunjukkan bagian mana yang janggal dan apa maksud di baliknya.
          </p>
        </div>

        <div className={isPortrait ? "w-full" : "md:col-span-7"}>
          <div className={`explain-card bg-[#1a1a1a] border-2 border-[#F3F1EA]/20 rounded-3xl shadow-2xl flex flex-col ${isPortrait ? "p-8 gap-5" : "p-5 md:p-7 gap-4"}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F1EA]/10">
              <div className="flex items-center gap-3">
                <span className={`bg-[#E9362F] text-white font-mono font-bold rounded-lg ${isPortrait ? "px-4 py-1.5 text-base" : "px-3 py-1 text-xs"}`}>
                  RISIKO TINGGI
                </span>
                <span className={`font-mono text-[#F3F1EA]/70 ${isPortrait ? "text-base" : "text-xs"}`}>
                  3 Tanda Bahaya Ditemukan
                </span>
              </div>
              <span className={`font-mono text-[#635BFF] ${isPortrait ? "text-base" : "text-xs"}`}>Uraian Bukti</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className={`explain-row-1 bg-[#111111] border border-[#F3F1EA]/10 rounded-2xl flex items-center justify-between gap-3 ${isPortrait ? "p-5" : "p-3"}`}>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#E9362F]" />
                  <span className={`font-bold text-[#F3F1EA] ${isPortrait ? "text-xl" : "text-xs sm:text-sm"}`}>
                    Mengaku Keluarga Pakai Nomor Asing
                  </span>
                </div>
                <div className={`font-mono bg-[#E9362F]/20 text-[#FF8F8A] rounded-lg border border-[#E9362F]/30 ${isPortrait ? "text-base px-3 py-1" : "text-[11px] px-2 py-0.5"}`}>
                  &quot;ini nomor baru aku&quot;
                </div>
              </div>

              <div className={`explain-row-2 bg-[#111111] border border-[#F3F1EA]/10 rounded-2xl flex items-center justify-between gap-3 ${isPortrait ? "p-5" : "p-3"}`}>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#E9362F]" />
                  <span className={`font-bold text-[#F3F1EA] ${isPortrait ? "text-xl" : "text-xs sm:text-sm"}`}>
                    Memaksa Transfer Tanpa Berpikir
                  </span>
                </div>
                <div className={`font-mono bg-[#E9362F]/20 text-[#FF8F8A] rounded-lg border border-[#E9362F]/30 ${isPortrait ? "text-base px-3 py-1" : "text-[11px] px-2 py-0.5"}`}>
                  &quot;transfer sekarang&quot;
                </div>
              </div>

              <div className={`explain-row-3 bg-[#111111] border border-[#F3F1EA]/10 rounded-2xl flex items-center justify-between gap-3 ${isPortrait ? "p-5" : "p-3"}`}>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#E9362F]" />
                  <span className={`font-bold text-[#F3F1EA] ${isPortrait ? "text-xl" : "text-xs sm:text-sm"}`}>
                    Mencegah Verifikasi Lewat Telepon
                  </span>
                </div>
                <div className={`font-mono bg-[#E9362F]/20 text-[#FF8F8A] rounded-lg border border-[#E9362F]/30 ${isPortrait ? "text-base px-3 py-1" : "text-[11px] px-2 py-0.5"}`}>
                  &quot;jangan telepon dulu&quot;
                </div>
              </div>
            </div>

            <div className={`explain-action bg-[#087F5B]/15 border border-[#087F5B]/40 rounded-2xl flex items-start gap-4 ${isPortrait ? "p-5 mt-2" : "p-3 mt-1"}`}>
              <span className={isPortrait ? "text-2xl" : "text-base"}>🛡️</span>
              <div>
                <div className={`font-mono uppercase tracking-wider text-[#38D9A9] font-bold ${isPortrait ? "text-base" : "text-[11px]"}`}>
                  Langkah Paling Aman Saat Ini
                </div>
                <p className={`text-[#F3F1EA]/90 mt-1 leading-relaxed ${isPortrait ? "text-lg" : "text-xs"}`}>
                  Tahan transfer. Hubungi nomor lama atau telepon langsung keluarga lewat jalur lain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
