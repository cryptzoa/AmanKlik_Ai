"use client";

interface PromoControlsProps {
  isPlaying: boolean;
  progress: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
  onRestart: () => void;
}

export function PromoControls({
  isPlaying,
  progress,
  duration,
  onTogglePlay,
  onSeek,
  onRestart,
}: PromoControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = progress * duration;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-black/10 min-w-[320px]">
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#111111] text-white hover:bg-[#635BFF] transition-colors"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[1px]">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        <button
          onClick={onRestart}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 hover:bg-black/5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        </button>

        <div className="font-mono text-sm font-medium ml-auto flex gap-1">
          <span>{formatTime(currentTime)}</span>
          <span className="text-black/40">/</span>
          <span className="text-black/40">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full accent-[#635BFF] cursor-pointer"
        />
      </div>
    </div>
  );
}
