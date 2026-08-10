"use client";

import { useEffect, useState } from "react";

type TokenItem = { id: string; name: string; createdAt: string; lastUsedAt: string | null };

export function ConnectClient({ appBaseUrl }: { appBaseUrl: string }) {
  const [items, setItems] = useState<TokenItem[]>([]);
  const [name, setName] = useState("Browser utama");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    try {
      const response = await fetch("/api/integrations/tokens", { cache: "no-store" });
      const body = await response.json();
      if (response.ok && body.ok) setItems(body.data.items);
    } catch { setStatus("Daftar koneksi belum tersedia."); }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function create() {
    setStatus("Membuat token…");
    setToken(null);
    try {
      const response = await fetch("/api/integrations/tokens", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error?.message ?? "Token belum dibuat.");
      setToken(body.data.token);
      setStatus("Token dibuat. Salin sekarang—nilai ini tidak ditampilkan lagi.");
      await load();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Token belum dibuat."); }
  }

  async function revoke(id: string) {
    try {
      const response = await fetch("/api/integrations/tokens", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (!response.ok) throw new Error("Gagal mencabut token");
      setStatus("Koneksi dicabut.");
      await load();
    } catch { setStatus("Koneksi belum dapat dicabut."); }
  }

  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setStatus("Tersalin."); } catch { setStatus("Clipboard tidak tersedia."); }
  }

  return <div className="grid gap-14">
    <section data-reveal className="grid gap-8 border-b border-line pb-12 lg:grid-cols-[0.4fr_0.6fr]"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Extension pairing</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Satu token, satu perangkat.</h2><p className="mt-4 text-sm leading-7 text-muted">Token hanya memberi akses membuat pemeriksaan ke sesi anonim ini. Token tidak berisi Gemini key dan bisa dicabut kapan saja.</p></div><div className="motion-surface p-6 sm:p-8"><label className="block text-sm font-semibold">Nama perangkat<input className="mt-3 min-h-12 w-full border border-line bg-surface px-4" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} /></label><button type="button" className="mt-5 min-h-12 rounded-full bg-ink px-6 font-semibold text-surface hover:bg-ai" onClick={() => void create()}>Buat token extension</button>{token ? <div className="mt-6 border border-ai bg-ai-soft p-4"><p className="text-xs font-semibold text-ai">TAMPIL SEKALI</p><code className="mt-3 block break-all text-sm">{token}</code><button type="button" className="mt-4 min-h-11 rounded-full bg-ai px-4 text-xs font-semibold text-white" onClick={() => void copy(token)}>Salin token</button></div> : null}{status ? <p className="mt-4 text-sm text-muted" role="status">{status}</p> : null}</div></section>
    <section data-reveal className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Setup</p><h2 className="mt-4 text-3xl font-semibold">Konfigurasi side panel</h2><ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-muted"><li>Buka <code>chrome://extensions</code> dan aktifkan Developer mode.</li><li>Pilih Load unpacked, lalu pilih folder <code>extension/</code> di repository.</li><li>Buka ikon AmanKlik, isi Base URL dan token di atas.</li><li>Blok pesan atau klik kanan tautan, lalu pilih “Periksa dengan AmanKlik”.</li></ol></div><div className="border border-line bg-ink p-6 text-surface sm:p-8"><p className="font-mono text-xs uppercase text-surface/60">Base URL</p><code className="mt-3 block break-all text-ai-soft">{appBaseUrl}</code><button type="button" className="mt-4 min-h-11 rounded-full border border-white/30 px-4 text-xs font-semibold" onClick={() => void copy(appBaseUrl)}>Salin Base URL</button><div className="mt-8 border-t border-white/20 pt-5 text-sm leading-7 text-surface/70">Extension memakai permission <strong className="text-surface">activeTab</strong>: akses halaman bersifat sementara setelah tindakan pengguna, bukan membaca semua tab terus-menerus.</div></div></section>
    <section data-reveal><p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Connected devices</p><div className="mt-5 divide-y divide-line border-y border-line">{items.length ? items.map((item) => <div key={item.id} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong>{item.name}</strong><p className="mt-1 text-xs text-muted">Dibuat {new Date(item.createdAt).toLocaleString("id-ID")} · terakhir dipakai {item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleString("id-ID") : "belum pernah"}</p></div><button type="button" className="min-h-11 rounded-full border border-risk/30 px-4 text-xs font-semibold text-risk hover:bg-risk-soft" onClick={() => void revoke(item.id)}>Cabut akses</button></div>) : <p className="py-6 text-sm text-muted">Belum ada perangkat terhubung.</p>}</div></section>
  </div>;
}
