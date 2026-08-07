"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-risk">Terjadi kendala</p>
        <h1 className="mt-4 text-3xl font-semibold">Halaman belum bisa ditampilkan.</h1>
        <button className="mt-6 rounded-full bg-ink px-5 py-3 font-semibold text-surface" onClick={reset}>
          Coba lagi
        </button>
      </div>
    </main>
  );
}
