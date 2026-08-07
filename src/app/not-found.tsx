import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Halaman tidak ditemukan.</h1>
        <Link className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-surface" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
