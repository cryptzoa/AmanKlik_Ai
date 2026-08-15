"use client";

import Link from "next/link";

interface PromoControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  ratio: "16x9" | "9x16";
  cut: "master" | "15s";
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
  onRestart: () => void;
  onJumpToLabel?: (label: string) => void;
}

const MASTER_SCENES = [
  { id: "scene-pressure", label: "Tekanan", time: 0 },
  { id: "scene-familiar", label: "Pesan", time: 4.6 },
  { id: "scene-pause", label: "Jeda", time: 10.0 },
  { id: "scene-brand", label: "Brand", time: 14.6 },
  { id: "scene-scan", label: "Scan", time: 19.8 },
  { id: "scene-explain", label: "Kenapa", time: 28.1 },
  { id: "scene-features", label: "Fitur", time: 35.5 },
  { id: "scene-impact", label: "Dampak", time: 42.7 },
  { id: "scene-end", label: "CTA", time: 48.6 },
];

export function PromoControls({
  isPlaying,
  progress,
  duration,
  ratio,
  cut,
  onTogglePlay,
  onSeek,
  onRestart,
  onJumpToLabel,
}: PromoControlsProps) {
  const formatTime = (seconds: number) => {
    const safeSecs = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(safeSecs / 60);
    const secs = safeSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = progress * duration;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      data-testid="promo-controls-bar"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 bg-[#fffefa]/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-2 border-[#111111] min-w-[340px] max-w-2xl w-[92vw] select-none transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            data-testid="promo-play-btn"
            aria-label={isPlaying ? "Jeda animasi" : "Putar animasi"}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#111111] text-white hover:bg-[#635BFF] transition-colors shadow-sm cursor-pointer active:scale-95"
          >
            {isPlaying ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="translate-x-[1px]">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>

          <button
            onClick={onRestart}
            data-testid="promo-restart-btn"
            aria-label="Mulai Ulang Animasi"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#111111]/20 hover:bg-[#111111]/5 transition-colors cursor-pointer active:scale-95 text-[#111111]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>

          <div data-testid="promo-time-display" className="font-mono text-xs font-bold text-[#111111] ml-2 flex items-center gap-1">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[#111111]/40">/</span>
            <span className="text-[#111111]/50">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f7f6f2] border border-[#111111]/15 rounded-lg p-0.5 text-xs font-mono">
            <Link
              href={`/promo?ratio=16x9&cut=${cut}`}
              className={`px-2 py-1 rounded ${ratio === "16x9" ? "bg-[#111111] text-white font-bold" : "text-[#6f6c65] hover:text-[#111111]"}`}
            >
              16:9
            </Link>
            <Link
              href={`/promo?ratio=9x16&cut=${cut}`}
              className={`px-2 py-1 rounded ${ratio === "9x16" ? "bg-[#111111] text-white font-bold" : "text-[#6f6c65] hover:text-[#111111]"}`}
            >
              9:16
            </Link>
          </div>

          <div className="flex items-center bg-[#f7f6f2] border border-[#111111]/15 rounded-lg p-0.5 text-xs font-mono">
            <Link
              href={`/promo?ratio=${ratio}&cut=master`}
              className={`px-2 py-1 rounded ${cut === "master" ? "bg-[#635BFF] text-white font-bold" : "text-[#6f6c65] hover:text-[#111111]"}`}
            >
              55s
            </Link>
            <Link
              href={`/promo?ratio=${ratio}&cut=15s`}
              className={`px-2 py-1 rounded ${cut === "15s" ? "bg-[#635BFF] text-white font-bold" : "text-[#6f6c65] hover:text-[#111111]"}`}
            >
              15s
            </Link>
          </div>

          <button
            onClick={toggleFullscreen}
            data-testid="promo-fullscreen-btn"
            aria-label="Layar Penuh"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#111111]/20 hover:bg-[#111111]/5 transition-colors cursor-pointer text-[#111111]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          data-testid="promo-scrubber"
          value={isNaN(progress) ? 0 : progress}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full accent-[#635BFF] h-2 bg-[#111111]/15 rounded-lg cursor-pointer appearance-none"
        />

        {cut === "master" && (
          <div className="flex items-center justify-between pt-1 overflow-x-auto gap-1">
            {MASTER_SCENES.map((scene) => {
              const sceneProgress = duration > 0 ? scene.time / duration : 0;
              const isActive = Math.abs(progress - sceneProgress) < 0.05;
              return (
                <button
                  key={scene.id}
                  data-testid={`scene-marker-${scene.id}`}
                  onClick={() => {
                    if (onJumpToLabel) {
                      onJumpToLabel(scene.id);
                    } else {
                      onSeek(sceneProgress);
                    }
                  }}
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#635BFF] text-white font-bold"
                      : "text-[#6f6c65] hover:text-[#111111] hover:bg-[#111111]/5"
                  }`}
                >
                  {scene.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#6f6c65] pt-1 border-t border-[#111111]/10">
        <span>Shortcut: [SPACE] Putar/Jeda · [R] Ulang</span>
        <Link
          href={`/promo?ratio=${ratio}&cut=${cut}&mode=record`}
          className="text-[#635BFF] font-bold hover:underline"
        >
          Masuk Mode Rekam →
        </Link>
      </div>
    </div>
  );
}
