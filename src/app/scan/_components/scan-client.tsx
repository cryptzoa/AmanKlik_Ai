"use client";

import type {
  ChangeEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEMO_IMAGE_FIXTURES,
  DEMO_TEXT_FIXTURES,
  DEMO_URL_FIXTURES,
} from "@/lib/demo/scan-fixtures";
import {
  StatusBand,
  TaskSurface,
} from "@/components/product/primitives";

type ScanMode = "text" | "image" | "url";
type ScanStatus = "idle" | "submitting";
type DemoSelection = { mode: ScanMode; id: string };
type ScanErrors = Partial<Record<ScanMode, string>>;

type ApiEnvelope = {
  ok?: boolean;
  data?: { scanId?: string };
  error?: { message?: string };
};

const MAX_TEXT_LENGTH = 8_000;
const MAX_URL_LENGTH = 2_048;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const tabs: Array<{ id: ScanMode; label: string }> = [
  { id: "text", label: "Pesan" },
  { id: "image", label: "Tangkapan layar" },
  { id: "url", label: "Tautan" },
];

function validateText(value: string): string | null {
  const length = value.trim().length;
  if (!length) return "Tempel pesan yang ingin diperiksa.";
  if (length < 8) return "Pesan perlu berisi sedikitnya 8 karakter.";
  if (value.length > MAX_TEXT_LENGTH) {
    return "Pesan melebihi batas 8.000 karakter.";
  }
  return null;
}

function validateUrl(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return "Masukkan tautan yang ingin diperiksa.";
  if (normalized.length > MAX_URL_LENGTH) {
    return "Tautan melebihi batas 2.048 karakter.";
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Gunakan tautan yang diawali http:// atau https://.";
    }
    if (!parsed.hostname) return "Nama domain pada tautan belum terbaca.";
  } catch {
    return "Format tautan belum valid. Periksa domain dan tanda bacanya.";
  }

  return null;
}

function validateImage(candidate: File | null): string | null {
  if (!candidate) return "Pilih satu tangkapan layar terlebih dahulu.";
  if (!candidate.size) return "File tangkapan layar kosong.";
  if (!ALLOWED_IMAGE_TYPES.has(candidate.type)) {
    return "Gunakan file PNG, JPG, atau WEBP.";
  }
  if (candidate.size > MAX_IMAGE_BYTES) {
    return "Ukuran tangkapan layar melebihi batas 5 MB.";
  }
  return null;
}

async function readApiEnvelope(response: Response): Promise<ApiEnvelope> {
  try {
    return await response.json() as ApiEnvelope;
  } catch {
    return {};
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ScanClient(
  { initialError = null }: { initialError?: string | null },
) {
  const router = useRouter();
  const [mode, setMode] = useState<ScanMode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [demoLoading, setDemoLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<ScanErrors>({});
  const [requestError, setRequestError] = useState<string | null>(initialError);
  const [selectedDemo, setSelectedDemo] = useState<DemoSelection | null>(null);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageButtonRef = useRef<HTMLButtonElement>(null);
  const requestErrorRef = useRef<HTMLDivElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const submitInFlightRef = useRef(false);
  const submitAbortRef = useRef<AbortController | null>(null);
  const demoAbortRef = useRef<AbortController | null>(null);
  const dragDepthRef = useRef(0);

  const busy = status === "submitting" || demoLoading;

  useEffect(() => {
    return () => {
      submitAbortRef.current?.abort();
      demoAbortRef.current?.abort();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  function revokePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }

  function clearImage() {
    revokePreview();
    setFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function clearCurrentInput() {
    demoAbortRef.current?.abort();
    setDemoLoading(false);
    setSelectedDemo(null);
    setRequestError(null);
    setErrors((current) => ({ ...current, [mode]: undefined }));

    if (mode === "text") setText("");
    if (mode === "url") setUrl("");
    if (mode === "image") clearImage();
  }

  function selectMode(nextMode: ScanMode) {
    if (busy || nextMode === mode) return;

    demoAbortRef.current?.abort();
    setDemoLoading(false);
    if (mode === "image") clearImage();
    if (selectedDemo?.mode === mode) {
      if (mode === "text") setText("");
      if (mode === "url") setUrl("");
    }

    setMode(nextMode);
    setSelectedDemo(null);
    setRequestError(null);
    setErrors({});
    setDragActive(false);
    dragDepthRef.current = 0;
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    if (busy) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    selectMode(tabs[nextIndex].id);
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  }

  function focusModeControl(targetMode: ScanMode) {
    window.requestAnimationFrame(() => {
      if (targetMode === "text") textRef.current?.focus();
      if (targetMode === "url") urlRef.current?.focus();
      if (targetMode === "image") imageButtonRef.current?.focus();
    });
  }

  function applyImage(candidate: File, demo?: DemoSelection) {
    const imageError = validateImage(candidate);
    if (imageError) {
      clearImage();
      setSelectedDemo(null);
      setErrors((current) => ({ ...current, image: imageError }));
      focusModeControl("image");
      return;
    }

    revokePreview();
    const objectUrl = URL.createObjectURL(candidate);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setFile(candidate);
    setSelectedDemo(demo ?? null);
    setRequestError(null);
    setErrors((current) => ({ ...current, image: undefined }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const candidate = event.target.files?.[0];
    if (!candidate) return;
    applyImage(candidate);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (busy || !event.dataTransfer.types.includes("Files")) return;
    dragDepthRef.current += 1;
    setDragActive(true);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (busy) return;
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (busy) return;
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (!dragDepthRef.current) setDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepthRef.current = 0;
    setDragActive(false);
    if (busy) return;

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length !== 1) {
      setErrors((current) => ({
        ...current,
        image: "Tarik satu tangkapan layar saja untuk diperiksa.",
      }));
      focusModeControl("image");
      return;
    }

    applyImage(droppedFiles[0]);
  }

  async function selectImageDemo(path: string, title: string, id: string) {
    demoAbortRef.current?.abort();
    const controller = new AbortController();
    demoAbortRef.current = controller;
    setRequestError(null);
    setErrors((current) => ({ ...current, image: undefined }));
    setDemoLoading(true);

    try {
      const response = await fetch(path, { signal: controller.signal });
      if (!response.ok) throw new Error("Contoh tangkapan layar belum tersedia.");
      const blob = await response.blob();
      const candidate = new File(
        [blob],
        `${title.toLocaleLowerCase("id-ID").replace(/[^a-z0-9]+/g, "-")}.png`,
        { type: blob.type || "image/png" },
      );
      applyImage(candidate, { mode: "image", id });
    } catch (error) {
      if (isAbortError(error)) return;
      setRequestError(
        error instanceof Error
          ? error.message
          : "Contoh tangkapan layar belum tersedia.",
      );
      window.requestAnimationFrame(() => requestErrorRef.current?.focus());
    } finally {
      if (demoAbortRef.current === controller) {
        demoAbortRef.current = null;
        setDemoLoading(false);
      }
    }
  }

  function validateActiveMode(): string | null {
    if (mode === "text") return validateText(text);
    if (mode === "url") return validateUrl(url);
    return validateImage(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitInFlightRef.current || demoLoading) return;

    const validationError = validateActiveMode();
    if (validationError) {
      setErrors({ [mode]: validationError });
      setRequestError(null);
      focusModeControl(mode);
      return;
    }

    submitInFlightRef.current = true;
    const controller = new AbortController();
    submitAbortRef.current = controller;
    setErrors({});
    setRequestError(null);
    setStatus("submitting");
    let navigating = false;

    try {
      let response: Response;
      if (mode === "image") {
        const formData = new FormData();
        formData.set("file", file as File);
        response = await fetch("/api/scans/image", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      } else if (mode === "url") {
        response = await fetch("/api/scans/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
          signal: controller.signal,
        });
      } else {
        response = await fetch("/api/scans/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });
      }

      const body = await readApiEnvelope(response);
      const scanId = body.data?.scanId;
      if (!response.ok || !body.ok || !scanId) {
        throw new Error(body.error?.message ?? "Pemeriksaan belum berhasil.");
      }

      navigating = true;
      router.push(`/result/${scanId}`);
    } catch (error) {
      if (isAbortError(error)) return;
      setRequestError(
        !navigator.onLine
          ? "Koneksi terputus. Inputmu tetap ada; sambungkan jaringan lalu coba lagi."
          : error instanceof TypeError
          ? "Jaringan belum dapat menjangkau AmanKlik. Inputmu tetap ada; coba lagi setelah koneksi stabil."
          : error instanceof Error
          ? error.message
          : "Pemeriksaan belum berhasil.",
      );
      window.requestAnimationFrame(() => requestErrorRef.current?.focus());
    } finally {
      if (submitAbortRef.current === controller) submitAbortRef.current = null;
      if (!navigating) {
        submitInFlightRef.current = false;
        setStatus("idle");
      }
    }
  }

  const hasCurrentInput = mode === "text"
    ? Boolean(text)
    : mode === "url"
    ? Boolean(url)
    : Boolean(file);
  return (
    <TaskSurface className="mt-8 sm:mt-10">
      <form noValidate onSubmit={(event) => void submit(event)}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
          <div className="min-w-0 p-5 sm:p-8 lg:p-10">
            <div
              className="product-tablist"
              role="tablist"
              aria-label="Jenis yang ingin diperiksa"
              aria-orientation="horizontal"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`scan-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-controls={`scan-panel-${tab.id}`}
                  aria-selected={mode === tab.id}
                  disabled={busy}
                  tabIndex={mode === tab.id ? 0 : -1}
                  className="product-tab"
                  onClick={() => selectMode(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              id="scan-panel-text"
              role="tabpanel"
              aria-labelledby="scan-tab-text"
              hidden={mode !== "text"}
              className="mt-7"
            >
              <label className="product-field-label" htmlFor="scan-text">
                Tempel pesan yang ingin diperiksa
              </label>
              <textarea
                ref={textRef}
                id="scan-text"
                name="text"
                className="product-textarea mt-3 min-h-52 sm:min-h-60"
                value={text}
                minLength={8}
                maxLength={MAX_TEXT_LENGTH}
                required
                disabled={busy}
                aria-invalid={Boolean(errors.text)}
                aria-describedby={`scan-text-help scan-text-count${
                  errors.text ? " scan-text-error" : ""
                }`}
                onBlur={() => {
                  const message = validateText(text);
                  if (message) {
                    setErrors((current) => ({ ...current, text: message }));
                  }
                }}
                onChange={(event) => {
                  setText(event.target.value);
                  setSelectedDemo((current) =>
                    current?.mode === "text" ? null : current
                  );
                  setErrors((current) => ({ ...current, text: undefined }));
                }}
                placeholder="Contoh: pesan yang meminta OTP, transfer, atau membuka tautan…"
              />
              <p id="scan-text-help" className="product-field-help">
                Sisakan bagian yang diperlukan. Hapus nama, nomor, dan data
                rahasia sebelum mengirim.
              </p>
              {errors.text ? (
                <p id="scan-text-error" className="product-field-error">
                  {errors.text}
                </p>
              ) : null}
              <span
                id="scan-text-count"
                className={`product-character-count ${
                  text.length >= MAX_TEXT_LENGTH * 0.9 ? "text-warning" : ""
                }`}
              >
                {text.length.toLocaleString("id-ID")} / 8.000
              </span>
            </div>

            <div
              id="scan-panel-url"
              role="tabpanel"
              aria-labelledby="scan-tab-url"
              hidden={mode !== "url"}
              className="mt-7"
            >
              <label className="product-field-label" htmlFor="scan-url">
                Tautan yang ingin diperiksa
              </label>
              <input
                ref={urlRef}
                id="scan-url"
                name="url"
                type="url"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="product-field mt-3 font-mono"
                value={url}
                maxLength={MAX_URL_LENGTH}
                required
                disabled={busy}
                aria-invalid={Boolean(errors.url)}
                aria-describedby={`scan-url-help scan-url-count${
                  errors.url ? " scan-url-error" : ""
                }`}
                onBlur={() => {
                  const message = validateUrl(url);
                  if (message) {
                    setErrors((current) => ({ ...current, url: message }));
                  }
                }}
                onChange={(event) => {
                  setUrl(event.target.value);
                  setSelectedDemo((current) =>
                    current?.mode === "url" ? null : current
                  );
                  setErrors((current) => ({ ...current, url: undefined }));
                }}
                placeholder="https://contoh.com/akun"
              />
              <p id="scan-url-help" className="product-field-help">
                AmanKlik membaca susunan alamat dan teksnya tanpa membuka situs
                tujuan.
              </p>
              {errors.url ? (
                <p id="scan-url-error" className="product-field-error">
                  {errors.url}
                </p>
              ) : null}
              <span
                id="scan-url-count"
                className={`product-character-count ${
                  url.length >= MAX_URL_LENGTH * 0.9 ? "text-warning" : ""
                }`}
              >
                {url.length.toLocaleString("id-ID")} / 2.048
              </span>
            </div>

            <div
              id="scan-panel-image"
              role="tabpanel"
              aria-labelledby="scan-tab-image"
              hidden={mode !== "image"}
              className="mt-7"
            >
              <span className="product-field-label">Unggah tangkapan layar pesan</span>
              <div
                className={`mt-3 flex min-h-60 flex-col items-center justify-center border border-dashed px-5 py-7 text-center transition-colors ${
                  dragActive
                    ? "border-ai bg-ai-soft"
                    : errors.image
                    ? "border-risk bg-risk-soft"
                    : "border-line bg-canvas"
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <>
                    <img
                      className="max-h-64 max-w-full object-contain shadow-[8px_8px_0_rgba(17,17,17,0.1)]"
                      src={previewUrl}
                      alt="Pratinjau tangkapan layar yang dipilih"
                    />
                    <p className="mt-4 break-all text-sm text-muted">
                      {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-semibold">
                      Tarik satu tangkapan layar ke area ini
                    </span>
                    <span className="mt-2 max-w-sm text-sm leading-6 text-muted">
                      atau pilih PNG, JPG, atau WEBP hingga 5 MB
                    </span>
                  </>
                )}
                <button
                  ref={imageButtonRef}
                  type="button"
                  className="product-button product-button--secondary mt-5"
                  disabled={busy}
                  aria-describedby={`scan-image-help${
                    errors.image ? " scan-image-error" : ""
                  }`}
                  onClick={() => imageInputRef.current?.click()}
                >
                  {previewUrl ? "Ganti tangkapan layar" : "Pilih tangkapan layar"}
                </button>
              </div>
              <input
                ref={imageInputRef}
                id="scan-image"
                name="file"
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={busy}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={`scan-image-help${
                  errors.image ? " scan-image-error" : ""
                }`}
                onChange={handleImageChange}
              />
              <p id="scan-image-help" className="product-field-help">
                File divalidasi berdasarkan ukuran dan format sebenarnya di
                server. Gambar asli tidak ditampilkan kembali di riwayat.
              </p>
              {errors.image ? (
                <p id="scan-image-error" className="product-field-error">
                  {errors.image}
                </p>
              ) : null}
            </div>

            <fieldset className="mt-7 border-t border-line pt-5">
              <legend className="product-eyebrow text-muted">
                Contoh buatan · tanpa data nyata
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {mode === "text"
                  ? DEMO_TEXT_FIXTURES.map((fixture) => (
                    <button
                      key={fixture.id}
                      type="button"
                      aria-pressed={selectedDemo?.mode === "text" &&
                        selectedDemo.id === fixture.id}
                      disabled={busy}
                      className="min-h-11 border border-line bg-surface px-4 py-2 text-left text-sm font-semibold hover:border-ai hover:text-ai disabled:opacity-50"
                      onClick={() => {
                        setText(fixture.text);
                        setSelectedDemo({ mode: "text", id: fixture.id });
                        setRequestError(null);
                        setErrors({});
                      }}
                    >
                      {fixture.id} · {fixture.title}
                    </button>
                  ))
                  : mode === "url"
                  ? DEMO_URL_FIXTURES.map((fixture) => (
                    <button
                      key={fixture.id}
                      type="button"
                      aria-pressed={selectedDemo?.mode === "url" &&
                        selectedDemo.id === fixture.id}
                      disabled={busy}
                      className="min-h-11 border border-line bg-surface px-4 py-2 text-left text-sm font-semibold hover:border-ai hover:text-ai disabled:opacity-50"
                      onClick={() => {
                        setUrl(fixture.url);
                        setSelectedDemo({ mode: "url", id: fixture.id });
                        setRequestError(null);
                        setErrors({});
                      }}
                    >
                      {fixture.id} · {fixture.title}
                    </button>
                  ))
                  : DEMO_IMAGE_FIXTURES.map((fixture) => (
                    <button
                      key={fixture.id}
                      type="button"
                      aria-pressed={selectedDemo?.mode === "image" &&
                        selectedDemo.id === fixture.id}
                      disabled={busy}
                      className="min-h-11 border border-line bg-surface px-4 py-2 text-left text-sm font-semibold hover:border-ai hover:text-ai disabled:opacity-50"
                      onClick={() =>
                        void selectImageDemo(
                          fixture.path,
                          fixture.title,
                          fixture.id,
                        )}
                    >
                      {fixture.id} · {fixture.title}
                    </button>
                  ))}
              </div>
              {hasCurrentInput ? (
                <button
                  type="button"
                  className="mt-4 min-h-11 text-sm font-semibold text-muted underline underline-offset-4 hover:text-ink"
                  disabled={busy}
                  onClick={clearCurrentInput}
                >
                  Hapus bahan yang dipilih
                </button>
              ) : null}
            </fieldset>

            <div className="mt-8 border-t border-line pt-6">
              <p className="max-w-2xl text-sm leading-7 text-muted">
                Saat pemeriksaan AI digunakan, isi yang kamu kirim dapat
                diproses oleh Google Gemini. Kirim hanya bagian yang diperlukan
                dan hapus data pribadi serta rahasia.
              </p>
              <button
                type="submit"
                className="product-button product-button--primary mt-5 w-full sm:w-auto"
                disabled={busy}
              >
                {status === "submitting"
                  ? "Sedang memeriksa…"
                  : demoLoading
                  ? "Memuat contoh…"
                  : "Periksa sekarang"}
              </button>
            </div>

            {status === "submitting" ? (
              <div className="mt-5">
                <StatusBand tone="loading" role="status">
                  <strong>Membaca isi → mencari tanda bahaya → menyiapkan hasil</strong>
                  <p className="mt-1 text-sm">
                    Jangan tutup halaman. Input tetap terlihat sampai hasil
                    berhasil dibuat.
                  </p>
                </StatusBand>
              </div>
            ) : null}

            {requestError ? (
              <div
                ref={requestErrorRef}
                className="mt-5 outline-none"
                tabIndex={-1}
              >
                <StatusBand tone="error" role="alert">
                  <strong>Pemeriksaan belum selesai.</strong>
                  <p className="mt-1 text-sm">{requestError}</p>
                </StatusBand>
              </div>
            ) : null}
          </div>

          <aside className="border-t border-line bg-canvas p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-8">
            <p className="product-eyebrow text-ai">Yang diperiksa</p>
            <ol className="mt-5 divide-y divide-line border-y border-line">
              <li className="py-4">
                <strong className="block text-sm">Format dan batas</strong>
                <span className="mt-1 block text-sm leading-6 text-muted">
                  Ukuran, jenis file, panjang, dan susunan isi diperiksa.
                </span>
              </li>
              <li className="py-4">
                <strong className="block text-sm">Tanda bahaya yang dapat dijelaskan</strong>
                <span className="mt-1 block text-sm leading-6 text-muted">
                  Pola pesan, susunan tautan, dan konteks dijelaskan secara
                  terpisah agar mudah diperiksa kembali.
                </span>
              </li>
            </ol>
            <p className="product-eyebrow mt-8 text-muted">Yang tidak dilakukan</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>• Tidak membuka situs di dalam tautan.</li>
              <li>• Tidak menjamin sebuah pesan aman atau pasti penipuan.</li>
              <li>• Tidak meminta OTP, kata sandi, PIN, atau identitas.</li>
            </ul>
          </aside>
        </div>
      </form>
    </TaskSurface>
  );
}
