"use client";

interface SceneScanProps {
  isPortrait?: boolean;
}

export function SceneScan({ isPortrait = false }: SceneScanProps) {
  return (
    <div className="scene-scan absolute inset-0 hidden flex-col items-center justify-center p-6 md:p-12 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none">
      <div className="relative z-10 w-full h-full max-w-5xl flex flex-col justify-between items-center py-6">
        <div className="scan-vectors-bar w-full flex items-center justify-center border-b-2 border-[#111111] pb-5 pt-2">
          <div className={`flex items-center ${isPortrait ? "gap-4" : "gap-3 sm:gap-6"}`}>
            <span
              className={`scan-tag-1 font-bold bg-[#111111] text-[#F3F1EA] rounded-xl shadow-sm ${
                isPortrait ? "text-2xl px-6 py-2.5" : "text-sm sm:text-lg px-4 py-1.5"
              }`}
            >
              Pesan.
            </span>
            <span
              className={`scan-tag-2 font-bold bg-[#111111] text-[#F3F1EA] rounded-xl shadow-sm ${
                isPortrait ? "text-2xl px-6 py-2.5" : "text-sm sm:text-lg px-4 py-1.5"
              }`}
            >
              Screenshot.
            </span>
            <span
              className={`scan-tag-3 font-bold bg-[#635BFF] text-white rounded-xl shadow-sm ${
                isPortrait ? "text-2xl px-6 py-2.5" : "text-sm sm:text-lg px-4 py-1.5"
              }`}
            >
              Tautan.
            </span>
          </div>
        </div>

        <div
          className={`scan-workbench w-full my-auto ${
            isPortrait ? "w-[92%] max-w-[920px] rounded-3xl border-3 shadow-[14px_14px_0_#111111]" : "max-w-4xl rounded-2xl border-2 shadow-[12px_12px_0_#111111]"
          } bg-[#fffefa] border-[#111111] overflow-hidden flex flex-col`}
        >
          <div className={`bg-[#f7f6f2] border-b-2 border-[#111111] flex items-center justify-between ${isPortrait ? "px-6 py-4" : "px-5 py-3"}`}>
            <div className="flex items-center gap-2.5">
              <span className={`rounded-full bg-[#111111] ${isPortrait ? "w-4 h-4" : "w-3 h-3"}`} />
              <span className={`rounded-full bg-[#111111]/30 ${isPortrait ? "w-4 h-4" : "w-3 h-3"}`} />
              <span className={`rounded-full bg-[#111111]/30 ${isPortrait ? "w-4 h-4" : "w-3 h-3"}`} />
              <span className={`font-mono font-bold text-[#111111] ml-2 ${isPortrait ? "text-lg" : "text-xs"}`}>
                amanklik.ai/periksa
              </span>
            </div>
            <div className={`font-mono text-[#635BFF] bg-[#635BFF]/10 rounded-lg font-semibold ${isPortrait ? "text-sm px-3 py-1" : "text-[11px] px-2 py-0.5"}`}>
              Tautan tidak dibuka
            </div>
          </div>

          <div className={`flex flex-col ${isPortrait ? "p-8 gap-6" : "p-6 md:p-8 gap-4"}`}>
            <div className="flex items-center justify-between">
              <span className={`font-mono uppercase tracking-wider text-[#6f6c65] ${isPortrait ? "text-base" : "text-xs"}`}>
                Pemeriksaan Pesan Mencurigakan
              </span>
              <span className={`font-mono text-[#635BFF] font-bold ${isPortrait ? "text-base" : "text-xs"}`}>
                HAPUS DATA PRIBADI
              </span>
            </div>

            <div className={`relative bg-[#f7f6f2] border-2 border-[#111111]/20 rounded-2xl font-mono text-[#111111] leading-relaxed overflow-hidden ${isPortrait ? "p-7" : "p-5"}`}>
              <div className="scan-beam absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#635BFF] to-transparent shadow-[0_0_20px_#635BFF] opacity-0" />

              <p className={`scan-input-text font-sans font-medium ${isPortrait ? "text-2xl leading-relaxed" : "text-sm md:text-base"}`}>
                &quot;Ma, ini nomor baru aku. Nomor lama rusak. Aku lagi ada masalah dan butuh transfer sekarang. Tolong kirim ke rekening yang aku kasih ya, jangan telepon dulu karena lagi meeting.&quot;
              </p>

              <div className={`mt-5 flex items-center justify-between pt-4 border-t border-[#111111]/10 ${isPortrait ? "text-base" : "text-xs"} text-[#6f6c65]`}>
                <span>Mencari pola kata &amp; tekanan waktu</span>
                <span className="font-mono text-[#635BFF] font-bold">KIRIM SEPERLUNYA</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <span className={`font-mono text-[#6f6c65] ${isPortrait ? "text-base" : "text-xs"}`}>Siap dianalisis</span>
              <div className={`scan-btn bg-[#635BFF] text-white font-bold rounded-xl shadow-md flex items-center gap-3 ${isPortrait ? "px-8 py-4 text-xl" : "px-6 py-2.5 text-sm"}`}>
                <span>Periksa sekarang</span>
                <span className="font-mono text-base">→</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`w-full flex items-center justify-between font-mono text-[#6f6c65] pt-2 ${isPortrait ? "text-base px-4" : "text-xs"}`}>
          <span>AMANKLIK AI</span>
          <span>PERIKSA PESAN &amp; TAUTAN</span>
        </div>
      </div>
    </div>
  );
}
