"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_IMAGE_FIXTURES, DEMO_TEXT_FIXTURES, DEMO_URL_FIXTURES } from "@/lib/demo/scan-fixtures";

type ScanMode = "text" | "image" | "url";
type ScanStatus = "idle" | "loading" | "error";

const tabs: Array<{ id: ScanMode; label: string }> = [
  { id: "text", label: "Pesan" },
  { id: "image", label: "Screenshot" },
  { id: "url", label: "Tautan" },
];

export function ScanClient() {
  const router = useRouter();
  const [mode, setMode] = useState<ScanMode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

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
    <div className="mt-12 max-w-4xl">
      <div className="flex flex-wrap gap-2 border-b border-line" role="tablist" aria-label="Jenis input">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            className={`min-h-11 border-b-2 px-4 text-sm font-semibold transition ${mode === tab.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            onClick={() => selectMode(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-[24px] border border-line bg-surface p-5 sm:p-8">
        {mode === "text" ? (
          <label className="block" htmlFor="scan-text">
            <span className="text-sm font-semibold">Tempel pesan yang ingin diperiksa</span>
            <textarea
              id="scan-text"
              className="mt-3 min-h-52 w-full resize-y rounded-2xl border border-line bg-canvas p-4 text-base leading-7 outline-none transition focus:border-ai"
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
              className="mt-3 min-h-14 w-full rounded-2xl border border-line bg-canvas px-4 text-base outline-none transition focus:border-ai"
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
              className="mt-3 flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-canvas px-5 text-center transition hover:border-ai"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="max-h-64 max-w-full rounded-xl object-contain" src={previewUrl} alt="Preview screenshot yang dipilih" />
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
            className="min-h-11 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-ai disabled:cursor-not-allowed disabled:opacity-40"
            onClick={submit}
          >
            {disabled ? "Menganalisis…" : "Analisis sekarang"}
          </button>
        </div>
      </div>

      {status === "loading" ? <p className="mt-5 text-sm text-muted" role="status">Memvalidasi input dan menyusun penjelasan…</p> : null}
      {error ? <p className="mt-5 rounded-2xl border border-risk/30 bg-risk-soft px-4 py-3 text-sm text-ink" role="alert">{error}</p> : null}
      <div className="mt-6" aria-label="Fixture demo sintetis">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Contoh sintetis · tanpa data nyata</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mode === "text" ? DEMO_TEXT_FIXTURES.map((fixture) => (
            <button key={fixture.id} type="button" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition hover:border-ai hover:text-ai" onClick={() => setText(fixture.text)}>
              {fixture.id} · {fixture.title}
            </button>
          )) : mode === "url" ? DEMO_URL_FIXTURES.map((fixture) => (
            <button key={fixture.id} type="button" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition hover:border-ai hover:text-ai" onClick={() => setUrl(fixture.url)}>
              {fixture.id} · {fixture.title}
            </button>
          )) : DEMO_IMAGE_FIXTURES.map((fixture) => (
            <button key={fixture.id} type="button" disabled={demoLoading} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition hover:border-ai hover:text-ai disabled:opacity-50" onClick={() => selectImageDemo(fixture.path, fixture.title)}>
              {fixture.id} · {fixture.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
