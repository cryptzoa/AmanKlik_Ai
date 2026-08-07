import Link from "next/link";
import { InteriorShell } from "@/components/site/interior-shell";

export default function NotFound() {
  return (
    <InteriorShell
      eyebrow="404 / Tidak ditemukan"
      title="Jalurnya berhenti di sini."
      description="Alamat ini tidak mengarah ke halaman AmanKlik yang tersedia. Kembali ke beranda atau langsung periksa sebuah pesan."
      marker="SALAH ALAMAT / AMAN"
      fragments={["404", "CEK URL", "KEMBALI"]}
      compact
    >
      <div data-reveal className="motion-surface grid min-h-72 place-items-center p-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-risk">Alamat tidak dikenali</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Pilih jalur yang aman.</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link className="lift-link inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-surface hover:bg-ai" href="/">Kembali ke beranda</Link>
            <Link className="lift-link inline-flex rounded-full border border-line bg-surface px-6 py-3 font-semibold hover:border-ai hover:text-ai" href="/scan">Buka scanner</Link>
          </div>
        </div>
      </div>
    </InteriorShell>
  );
}
