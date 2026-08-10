"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DEMO_IMAGE_FIXTURES, DEMO_TEXT_FIXTURES, DEMO_URL_FIXTURES } from "@/lib/demo/scan-fixtures";

gsap.registerPlugin(useGSAP);

type ScanMode = "text" | "image" | "url";
type ScanStatus = "idle" | "loading" | "error";

const tabs: Array<{ id: ScanMode; label: string }> = [
  { id: "text", label: "Pesan" },
  { id: "image", label: "Screenshot" },
  { id: "url", label: "Tautan" },
];

export function ScanClient({ initialError = null }: { initialError?: string | null }) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [mode, setMode] = useState<ScanMode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-scan-panel]", { autoAlpha: 0, x: 24, duration: 0.38, ease: "power2.out" });
    gsap.from("[data-fixture-chip]", { autoAlpha: 0, y: 10, stagger: 0.035, duration: 0.28, ease: "power2.out" });
  }, { scope: root, dependencies: [mode], revertOnUpdate: true });

  function selectMode(nextMode: ScanMode) {
    setMode(nextMode);
    setError(null);
  }

  async function selectImageDemo(path: string, title: string) {
    setError(null);
    setDemoLoading(true);
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Fixture screenshot belum tersedia.");
      const blob = await response.blob();
      setFile(new File([blob], `${title.toLocaleLowerCase("id-ID").replace(/[^a-z0-9]+/g, "-")}.png`, { type: "image/png" }));
    } catch (demoError) {
      setError(demoError instanceof Error ? demoError.message : "Fixture screenshot belum tersedia.");
    } finally {
      setDemoLoading(false);
    }
  }

  async function submit() {
    setError(null);
    setStatus("loading");

    try {
      let response: Response;
      if (mode === "image") {
        if (!file) throw new Error("Pilih screenshot terlebih dahulu.");
        const formData = new FormData();
        formData.set("file", file);
        response = await fetch("/api/scans/image", { method: "POST", body: formData });
      } else if (mode === "url") {
        response = await fetch("/api/scans/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } else {
        response = await fetch("/api/scans/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }

      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body.error?.message ?? "Pemeriksaan belum berhasil.");
      }

      router.push(`/result/${body.data.scanId}`);
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Pemeriksaan belum berhasil.");
    }
  }

  const disabled = status === "loading" || demoLoading;
  const canSubmit = mode === "text" ? text.trim().length >= 8 : mode === "url" ? url.trim().length > 0 : Boolean(file);

  return (
    <div ref={root} className="mt-12 grid gap-8 xl:grid-cols-[1fr_280px]">
      <div>
      <div className="flex flex-wrap gap-2 border-b border-line" role="tablist" aria-label="Jenis input">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            className={`relative min-h-12 border-b-2 px-5 text-sm font-semibold transition ${mode === tab.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            onClick={() => selectMode(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div data-scan-panel className="motion-surface mt-8 p-5 sm:p-8">
        {mode === "text" ? (
          <label className="block" htmlFor="scan-text">
            <span className="text-sm font-semibold">Tempel pesan yang ingin diperiksa</span>
            <textarea
              id="scan-text"
              className="relative z-10 mt-3 min-h-60 w-full resize-y border border-line bg-canvas p-5 text-base leading-7 outline-none transition focus:border-ai focus:bg-surface"
              value={text}
              maxLength={8000}
              onChange={(event) => setText(event.target.value)}
              placeholder="Contoh: pesan yang meminta OTP, transfer, atau membuka tautan..."
            />
            <span className="mt-2 block text-right font-mono text-xs text-muted">{text.length.toLocaleString("id-ID")} / 8.000</span>
          </label>
        ) : mode === "url" ? (
          <label className="block" htmlFor="scan-url">
            <span className="text-sm font-semibold">Tautan yang ingin diperiksa</span>
            <input
              id="scan-url"
              className="relative z-10 mt-3 min-h-16 w-full border border-line bg-canvas px-5 font-mono text-base outline-none transition focus:border-ai focus:bg-surface"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://contoh.com/akun"
              inputMode="url"
            />
            <span className="mt-3 block text-sm leading-6 text-muted">AmanKlik tidak membuka situs ini; kami hanya memeriksa struktur alamat dan konteks yang kamu kirim.</span>
          </label>
        ) : (
          <div>
            <span className="text-sm font-semibold">Upload screenshot pesan</span>
            <button
              type="button"
              className="relative z-10 mt-3 flex min-h-60 w-full flex-col items-center justify-center border border-dashed border-line bg-canvas px-5 text-center transition hover:border-ai hover:bg-ai-soft"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="max-h-64 max-w-full object-contain shadow-[8px_8px_0_rgba(17,17,17,0.1)]" src={previewUrl} alt="Preview screenshot yang dipilih" />
              ) : (
                <>
                  <span className="text-lg font-semibold">Tarik screenshot ke sini</span>
                  <span className="mt-2 text-sm text-muted">atau pilih PNG, JPG, atau WEBP hingga 5 MB</span>
                </>
              )}
            </button>
            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file ? <p className="mt-3 text-sm text-muted">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p> : null}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-muted">Versi demo menggunakan API AI pihak ketiga. Hindari mengunggah percakapan nyata yang berisi data pribadi atau informasi sensitif.</p>
          <button
            type="button"
            disabled={disabled || !canSubmit}
            className="lift-link relative z-10 min-h-12 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-surface hover:bg-ai disabled:cursor-not-allowed disabled:opacity-40"
            onClick={submit}
          >
            {disabled ? "Menganalisis…" : "Analisis sekarang"}
          </button>
        </div>
      </div>

      {status === "loading" ? <div className="mt-5 border border-line bg-ai-soft p-4 text-sm" role="status"><span className="mr-3 inline-block size-2 animate-pulse rounded-full bg-ai" />Memvalidasi input dan menyusun penjelasan…</div> : null}
      {error ? <p className="mt-5 border border-risk/30 bg-risk-soft px-4 py-3 text-sm text-ink" role="alert">{error}</p> : null}
      <div className="mt-6" aria-label="Fixture demo sintetis">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Contoh sintetis · tanpa data nyata</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mode === "text" ? DEMO_TEXT_FIXTURES.map((fixture) => (
            <button data-fixture-chip key={fixture.id} type="button" className="lift-link rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-ai hover:text-ai" onClick={() => setText(fixture.text)}>
              {fixture.id} · {fixture.title}
            </button>
          )) : mode === "url" ? DEMO_URL_FIXTURES.map((fixture) => (
            <button data-fixture-chip key={fixture.id} type="button" className="lift-link rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-ai hover:text-ai" onClick={() => setUrl(fixture.url)}>
              {fixture.id} · {fixture.title}
            </button>
          )) : DEMO_IMAGE_FIXTURES.map((fixture) => (
            <button data-fixture-chip key={fixture.id} type="button" disabled={demoLoading} className="lift-link rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-ai hover:text-ai disabled:opacity-50" onClick={() => selectImageDemo(fixture.path, fixture.title)}>
              {fixture.id} · {fixture.title}
            </button>
          ))}
        </div>
      </div>
      </div>

      <aside data-reveal-card className="self-start border-t border-line pt-5 xl:sticky xl:top-28">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ai">Alur pemeriksaan</p>
        <ol className="mt-5 divide-y divide-line border-b border-line">
          {[
            ["01", "Input divalidasi", "Ukuran, format, dan isi diperiksa sebelum analisis."],
            ["02", "Sinyal dipisahkan", "Rules, URL intelligence, dan konteks AI dibaca terpisah."],
            ["03", "Aksi dijelaskan", "Hasil berisi alasan dan langkah aman, bukan hanya label."],
          ].map(([number, title, body]) => (
            <li key={number} className="py-5">
              <span className="font-mono text-xs text-muted">{number}</span>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
