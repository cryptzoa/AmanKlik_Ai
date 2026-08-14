"use client";

import { useEffect, useRef } from "react";

type Props = {
  name: string;
  token: string | null;
  status: { message: string; isError: boolean } | null;
  createPending: boolean;
  onNameChange: (name: string) => void;
  onCreate: () => void;
  onCopy: (value: string) => void;
  onDismissToken: () => void;
};

export function PairingSection({
  name,
  token,
  status,
  createPending,
  onNameChange,
  onCreate,
  onCopy,
  onDismissToken,
}: Props) {
  const revealHeadingRef = useRef<HTMLHeadingElement>(null);
  const trimmedLength = name.trim().length;
  const nameError = trimmedLength < 3
    ? "Nama perangkat minimal 3 karakter."
    : trimmedLength > 60
    ? "Nama perangkat maksimal 60 karakter."
    : null;

  useEffect(() => {
    if (token) revealHeadingRef.current?.focus();
  }, [token]);

  return (
    <section className="connect-pairing" aria-labelledby="pairing-heading">
      <div>
        <p className="product-eyebrow text-ai">01 / Pasangkan extension</p>
        <h2 id="pairing-heading" className="connect-section-title">
          Beri nama setiap akses.
        </h2>
        <p className="connect-section-copy">
          Token hanya mengizinkan extension mengirim pemeriksaan ke AmanKlik.
          Token tidak berisi kunci Gemini. Kamu dapat mencabutnya dari browser
          penerbit selama sesi anonim ini masih tersedia.
        </p>
      </div>

      <div className="product-task-surface connect-pairing__surface">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCreate();
          }}
        >
          <label className="product-field-label" htmlFor="device-name">
            Nama perangkat
          </label>
          <input
            id="device-name"
            className="product-field mt-3"
            value={name}
            minLength={3}
            maxLength={60}
            autoComplete="off"
            aria-invalid={Boolean(nameError)}
            aria-describedby="device-name-help device-name-error"
            onChange={(event) => onNameChange(event.target.value)}
          />
          <p id="device-name-help" className="product-field-help">
            Gunakan nama yang membantumu mengenali perangkat saat mencabut
            akses. Jangan masukkan token atau data rahasia.
          </p>
          <p id="device-name-error" className="product-field-error">
            {nameError ?? "\u00a0"}
          </p>
          <button
            type="submit"
            className="product-button product-button--primary mt-5"
            disabled={createPending || Boolean(nameError)}
          >
            {createPending ? "Membuat token…" : "Buat token extension"}
          </button>
        </form>

        {token ? (
          <section
            className="connect-token-reveal"
            aria-labelledby="token-reveal-heading"
          >
            <p className="product-eyebrow text-ai-soft">Tampil satu kali</p>
            <h3
              id="token-reveal-heading"
              ref={revealHeadingRef}
              tabIndex={-1}
            >
              Salin sebelum menutup tampilan ini.
            </h3>
            <code>{token}</code>
            <div className="connect-token-reveal__actions">
              <button
                type="button"
                className="product-button bg-ai text-white"
                onClick={() => onCopy(token)}
              >
                Salin token
              </button>
              <button
                type="button"
                className="product-button border border-white/35 text-surface"
                onClick={onDismissToken}
              >
                Selesai dan tutup
              </button>
            </div>
          </section>
        ) : null}

        {status ? (
          <p
            className={`mt-4 text-sm ${status.isError ? "text-risk" : "text-muted"}`}
            role={status.isError ? "alert" : "status"}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
