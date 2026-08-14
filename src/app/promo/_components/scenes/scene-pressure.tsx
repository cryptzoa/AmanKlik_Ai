"use client";

interface ScenePressureProps {
  isPortrait?: boolean;
}

export function ScenePressure({ isPortrait = false }: ScenePressureProps) {
  return (
    <div className="scene-pressure absolute inset-0 hidden bg-[#111111] text-[#F3F1EA] flex-col items-center justify-center overflow-hidden select-none">
      {/* Background kinetic grid lines */}
      <div
        className="pressure-grid absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(243,241,234,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,241,234,0.15) 1px, transparent 1px)",
          backgroundSize: isPortrait ? "60px 60px" : "60px 60px",
        }}
      />

      {/* Incoming threat notification shards */}
      <div
        className={`pressure-shard-1 absolute ${
          isPortrait ? "top-28 left-[6%] right-[6%] p-7 rounded-2xl" : "top-20 left-16 max-w-md p-4 rounded-xl"
        } bg-[#1a1a1a]/95 border-2 border-[#E9362F]/50 shadow-2xl backdrop-blur-md z-10`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-[#E9362F] animate-ping" />
          <span
            className={`font-mono tracking-widest uppercase text-[#E9362F] font-bold ${
              isPortrait ? "text-sm" : "text-[10px]"
            }`}
          >
            NOMOR BARU · MENDESAK
          </span>
        </div>
        <p
          className={`font-sans text-[#F3F1EA]/95 font-medium leading-snug ${
            isPortrait ? "text-xl" : "text-xs sm:text-sm"
          }`}
        >
          &quot;Ma, ini nomor baru. Tolong transfer sekarang juga, mendesak!&quot;
        </p>
      </div>

      <div
        className={`pressure-shard-2 absolute ${
          isPortrait ? "bottom-32 left-[6%] right-[6%] p-7 rounded-2xl" : "bottom-24 right-16 max-w-md p-4 rounded-xl"
        } bg-[#1a1a1a]/95 border-2 border-[#E9362F]/50 shadow-2xl backdrop-blur-md z-10`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="w-3 h-3 rounded-full bg-[#E9362F]" />
          <span
            className={`font-mono tracking-widest uppercase text-[#E9362F] font-bold ${
              isPortrait ? "text-sm" : "text-[10px]"
            }`}
          >
            MENUTUP AKSES KONFIRMASI
          </span>
        </div>
        <p
          className={`font-sans text-[#F3F1EA]/95 font-medium leading-snug ${
            isPortrait ? "text-xl" : "text-xs sm:text-sm"
          }`}
        >
          &quot;Jangan telepon dulu, lagi di ruang rapat! Kirim ke rekening ini…&quot;
        </p>
      </div>

      {/* Central kinetic typographic impact words */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center uppercase tracking-tighter font-extrabold leading-[0.88] px-4">
        <div
          className="pressure-word-1 text-[#635BFF] drop-shadow-[0_0_50px_rgba(99,91,255,0.45)]"
          style={{ fontSize: isPortrait ? "130px" : "clamp(4.5rem, 9vw, 8.5rem)" }}
        >
          &quot;SEKARANG&quot;
        </div>
        <div
          className="pressure-word-2 text-[#F3F1EA] my-2 sm:my-3 drop-shadow-[0_0_50px_rgba(243,241,234,0.25)]"
          style={{ fontSize: isPortrait ? "130px" : "clamp(4.5rem, 9vw, 8.5rem)" }}
        >
          &quot;TRANSFER&quot;
        </div>
        <div
          className="pressure-word-3 text-[#E9362F] drop-shadow-[0_0_50px_rgba(233,54,47,0.45)]"
          style={{ fontSize: isPortrait ? "105px" : "clamp(3.8rem, 7.5vw, 7.2rem)" }}
        >
          &quot;JANGAN TELEPON&quot;
        </div>
      </div>
    </div>
  );
}
