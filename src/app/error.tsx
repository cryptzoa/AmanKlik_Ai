"use client";

import { InteriorShell } from "@/components/site/interior-shell";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <InteriorShell
      eyebrow="Error / Pemulihan"
      title="Ada yang tersendat."
      description="Halaman belum bisa ditampilkan, tetapi tidak ada tindakan lanjutan yang dilakukan atas namamu. Coba muat ulang bagian ini."
      marker="BERHENTI / COBA ULANG"
      fragments={["AMAN", "TIDAK TERKIRIM", "RETRY"]}
      compact
    >
      <div className="motion-surface grid min-h-72 place-items-center p-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-risk">Terjadi kendala</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Halaman belum bisa ditampilkan.</h2>
          <button className="lift-link mt-7 rounded-full bg-ink px-6 py-3 font-semibold text-surface hover:bg-ai" onClick={reset}>Coba lagi</button>
        </div>
      </div>
    </InteriorShell>
  );
}
