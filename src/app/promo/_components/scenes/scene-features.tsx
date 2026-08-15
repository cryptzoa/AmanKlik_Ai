"use client";

interface SceneFeaturesProps {
  isPortrait?: boolean;
}

export function SceneFeatures({ isPortrait = false }: SceneFeaturesProps) {
  return (
    <div className="scene-features absolute inset-0 hidden flex-col justify-center p-6 md:p-12 bg-[#F3F1EA] text-[#111111] overflow-hidden select-none">
      <div
        className={`relative z-10 my-auto grid ${
          isPortrait ? "grid-cols-1 gap-4 w-[92%]" : "grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl w-full"
        } mx-auto`}
      >
        <div
          className={`feature-card feature-card-1 bg-[#fffefa] border-[#111111] flex flex-col justify-between ${
            isPortrait ? "p-6 rounded-3xl border-3 shadow-[10px_10px_0_#111111]" : "p-6 rounded-2xl border-2 shadow-[8px_8px_0_#111111]"
          }`}
        >
          <div>
            <div className={`font-mono text-[#635BFF] font-bold uppercase ${isPortrait ? "text-base mb-1.5" : "text-xs mb-3"}`}>
              01 / DETEKSI
            </div>
            <h3 className={`font-extrabold tracking-tight ${isPortrait ? "text-3xl mb-1.5" : "text-2xl md:text-3xl mb-2"}`}>
              PERIKSA
            </h3>
            <p className={`text-[#6f6c65] leading-relaxed ${isPortrait ? "text-lg" : "text-xs md:text-sm"}`}>
              Cek pesan mencurigakan, tangkapan layar chat, atau link tanpa perlu membukanya.
            </p>
          </div>
          <div className={`pt-3 border-t border-[#111111]/10 font-mono text-[#111111] font-semibold flex items-center justify-between ${isPortrait ? "mt-4 text-base" : "mt-6 text-xs"}`}>
            <span>Cek Pesan &amp; Link</span>
            <span>→</span>
          </div>
        </div>

        <div
          className={`feature-card feature-card-2 bg-[#fffefa] border-[#111111] flex flex-col justify-between ${
            isPortrait ? "p-6 rounded-3xl border-3 shadow-[10px_10px_0_#111111]" : "p-6 rounded-2xl border-2 shadow-[8px_8px_0_#111111]"
          }`}
        >
          <div>
            <div className={`font-mono text-[#635BFF] font-bold uppercase ${isPortrait ? "text-base mb-1.5" : "text-xs mb-3"}`}>
              02 / KONTEKS
            </div>
            <h3 className={`font-extrabold tracking-tight ${isPortrait ? "text-3xl mb-1.5" : "text-2xl md:text-3xl mb-2"}`}>
              PAHAMI
            </h3>
            <p className={`text-[#6f6c65] leading-relaxed ${isPortrait ? "text-lg" : "text-xs md:text-sm"}`}>
              Ketahui persis trik yang dipakai pelaku dan alasan kenapa pesan itu berbahaya.
            </p>
          </div>
          <div className={`pt-3 border-t border-[#111111]/10 font-mono text-[#111111] font-semibold flex items-center justify-between ${isPortrait ? "mt-4 text-base" : "mt-6 text-xs"}`}>
            <span>Penjelasan Transparan</span>
            <span>→</span>
          </div>
        </div>

        <div
          className={`feature-card feature-card-3 bg-[#fffefa] border-[#111111] flex flex-col justify-between ${
            isPortrait ? "p-6 rounded-3xl border-3 shadow-[10px_10px_0_#111111]" : "p-6 rounded-2xl border-2 shadow-[8px_8px_0_#111111]"
          }`}
        >
          <div>
            <div className={`font-mono text-[#E9362F] font-bold uppercase ${isPortrait ? "text-base mb-1.5" : "text-xs mb-3"}`}>
              03 / RESPON
            </div>
            <h3 className={`font-extrabold tracking-tight ${isPortrait ? "text-3xl mb-1.5" : "text-2xl md:text-3xl mb-2"}`}>
              BERTINDAK
            </h3>
            <p className={`text-[#6f6c65] leading-relaxed ${isPortrait ? "text-lg" : "text-xs md:text-sm"}`}>
              Sudah terlanjur transfer? Dapatkan panduan darurat dan kontak resmi bank seketika.
            </p>
          </div>
          <div className={`pt-3 border-t border-[#111111]/10 font-mono text-[#111111] font-semibold flex items-center justify-between ${isPortrait ? "mt-4 text-base" : "mt-6 text-xs"}`}>
            <span>Langkah Darurat</span>
            <span>→</span>
          </div>
        </div>

        <div
          className={`feature-card feature-card-4 bg-[#fffefa] border-[#111111] flex flex-col justify-between ${
            isPortrait ? "p-6 rounded-3xl border-3 shadow-[10px_10px_0_#111111]" : "p-6 rounded-2xl border-2 shadow-[8px_8px_0_#111111]"
          }`}
        >
          <div>
            <div className={`font-mono text-[#087F5B] font-bold uppercase ${isPortrait ? "text-base mb-1.5" : "text-xs mb-3"}`}>
              04 / REFLEKS
            </div>
            <h3 className={`font-extrabold tracking-tight ${isPortrait ? "text-3xl mb-1.5" : "text-2xl md:text-3xl mb-2"}`}>
              LATIH
            </h3>
            <p className={`text-[#6f6c65] leading-relaxed ${isPortrait ? "text-lg" : "text-xs md:text-sm"}`}>
              Asah insting lewat simulasi kasus nyata agar Anda dan keluarga makin sulit dikecoh.
            </p>
          </div>
          <div className={`pt-3 border-t border-[#111111]/10 font-mono text-[#111111] font-semibold flex items-center justify-between ${isPortrait ? "mt-4 text-base" : "mt-6 text-xs"}`}>
            <span>Asah Kewaspadaan</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
