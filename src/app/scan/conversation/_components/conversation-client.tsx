"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  StatusBand,
  TaskSurface,
} from "@/components/product/primitives";
import type {
  ConversationMessageInput,
  ConversationSpeaker,
} from "@/types/conversation";

type ApiEnvelope = {
  ok?: boolean;
  data?: { scanId?: string };
  error?: { message?: string };
};

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 4_000;
const MAX_TOTAL_LENGTH = 16_000;

const speakerOptions: ReadonlyArray<{
  label: string;
  value: ConversationSpeaker;
}> = [
  { value: "sender", label: "Pengirim" },
  { value: "user", label: "Saya" },
];

const syntheticMessages: ConversationMessageInput[] = [
  {
    id: "m1",
    speaker: "sender",
    text: "Ini nomor baru aku. Nomor lama rusak.",
    order: 1,
  },
  {
    id: "m2",
    speaker: "sender",
    text:
      "Aku lagi ada masalah. Tolong transfer sekarang dan jangan telepon dulu.",
    order: 2,
  },
];

function blankMessages(): ConversationMessageInput[] {
  return [
    { id: "m1", speaker: "sender", text: "", order: 1 },
    { id: "m2", speaker: "sender", text: "", order: 2 },
  ];
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

type SpeakerMenuProps = {
  disabled: boolean;
  id: string;
  onChange: (speaker: ConversationSpeaker) => void;
  value: ConversationSpeaker;
};

function SpeakerMenu({ disabled, id, onChange, value }: SpeakerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = `${id}-label`;
  const menuId = `${id}-menu`;
  const selectedLabel = speakerOptions.find((option) => option.value === value)
    ?.label ?? "Pengirim";

  useEffect(() => {
    if (!isOpen) return;

    function closeWhenOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    window.addEventListener("pointerdown", closeWhenOutside);
    return () => window.removeEventListener("pointerdown", closeWhenOutside);
  }, [isOpen]);

  function focusOption(speaker: ConversationSpeaker) {
    window.requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector<HTMLButtonElement>(`[data-speaker="${speaker}"]`)
        ?.focus();
    });
  }

  function openMenu() {
    if (disabled) return;
    setIsOpen(true);
  }

  function selectSpeaker(speaker: ConversationSpeaker) {
    onChange(speaker);
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
      focusOption(value);
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    speaker: ConversationSpeaker,
  ) {
    const currentIndex = speakerOptions.findIndex(
      (option) => option.value === speaker,
    );

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % speakerOptions.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + speakerOptions.length) % speakerOptions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = speakerOptions.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      focusOption(speakerOptions[nextIndex].value);
    }
  }

  return (
    <div ref={rootRef} className="product-speaker-menu">
      <span id={labelId} className="product-speaker-menu__label">
        Pengirim
      </span>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="product-speaker-menu__trigger"
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selectedLabel}</span>
        <span className="product-speaker-menu__chevron" aria-hidden="true">
          ↓
        </span>
      </button>
      {isOpen ? (
        <div
          id={menuId}
          className="product-speaker-menu__popup"
          role="menu"
          aria-labelledby={labelId}
        >
          {speakerOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="product-speaker-menu__option"
              data-speaker={option.value}
              role="menuitemradio"
              aria-checked={value === option.value}
              onClick={() => selectSpeaker(option.value)}
              onKeyDown={(event) => handleOptionKeyDown(event, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ConversationClient() {
  const router = useRouter();
  const [messages, setMessages] = useState<ConversationMessageInput[]>(() =>
    syntheticMessages.map((message) => ({ ...message }))
  );
  const [isSyntheticExample, setIsSyntheticExample] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState(
    "Dua pesan contoh sintetis dimuat.",
  );
  const [focusMessageId, setFocusMessageId] = useState<string | null>(null);

  const textareaRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const requestErrorRef = useRef<HTMLDivElement>(null);
  const formErrorRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(3);
  const submitInFlightRef = useRef(false);
  const submitAbortRef = useRef<AbortController | null>(null);

  const totalCharacters = messages.reduce(
    (sum, message) => sum + message.text.length,
    0,
  );
  const totalTooLong = totalCharacters > MAX_TOTAL_LENGTH;

  useEffect(() => {
    if (!focusMessageId) return;
    const frame = window.requestAnimationFrame(() => {
      textareaRefs.current.get(focusMessageId)?.focus();
      setFocusMessageId(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusMessageId, messages]);

  useEffect(() => {
    return () => submitAbortRef.current?.abort();
  }, []);

  function markAsDraft() {
    setIsSyntheticExample(false);
    setRequestError(null);
  }

  function updateMessage(
    id: string,
    patch: Partial<ConversationMessageInput>,
  ) {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, ...patch } : message
      )
    );
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setFormError(null);
    markAsDraft();
  }

  function startBlank() {
    if (loading) return;
    setMessages(blankMessages());
    nextIdRef.current = 3;
    setIsSyntheticExample(false);
    setFieldErrors({});
    setFormError(null);
    setRequestError(null);
    setAnnouncement("Contoh dibersihkan. Dua pesan kosong siap diisi.");
    setFocusMessageId("m1");
  }

  function addMessage() {
    if (loading || messages.length >= MAX_MESSAGES) return;
    const id = `m${nextIdRef.current}`;
    nextIdRef.current += 1;
    const order = messages.length + 1;
    setMessages((current) => [
      ...current,
      { id, speaker: "sender", text: "", order },
    ]);
    setIsSyntheticExample(false);
    setFormError(null);
    setRequestError(null);
    setAnnouncement(`Pesan ${order} ditambahkan.`);
    setFocusMessageId(id);
  }

  function removeMessage(id: string) {
    if (loading || messages.length <= 2) return;
    const removedIndex = messages.findIndex((message) => message.id === id);
    if (removedIndex < 0) return;

    const nextMessages = messages
      .filter((message) => message.id !== id)
      .map((message, index) => ({ ...message, order: index + 1 }));
    const focusTarget = nextMessages[
      Math.min(removedIndex, nextMessages.length - 1)
    ];

    setMessages(nextMessages);
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setIsSyntheticExample(false);
    setFormError(null);
    setRequestError(null);
    setAnnouncement(
      `Pesan ${removedIndex + 1} dihapus. Fokus berpindah ke pesan ${
        Math.min(removedIndex, nextMessages.length - 1) + 1
      }.`,
    );
    setFocusMessageId(focusTarget.id);
  }

  function validateDraft(): {
    messageErrors: Record<string, string>;
    generalError: string | null;
  } {
    const messageErrors: Record<string, string> = {};
    for (const message of messages) {
      if (!message.text.trim()) {
        messageErrors[message.id] = "Isi pesan tidak boleh kosong.";
      } else if (message.text.length > MAX_MESSAGE_LENGTH) {
        messageErrors[message.id] = "Pesan melebihi batas 4.000 karakter.";
      }
    }

    let generalError: string | null = null;
    if (messages.length < 2 || messages.length > MAX_MESSAGES) {
      generalError = "Percakapan harus berisi 2–12 pesan.";
    } else if (totalTooLong) {
      generalError = "Total percakapan melebihi batas 16.000 karakter.";
    }

    return { messageErrors, generalError };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitInFlightRef.current) return;

    const validation = validateDraft();
    setFieldErrors(validation.messageErrors);
    setFormError(validation.generalError);
    setRequestError(null);

    const firstInvalidId = messages.find((message) =>
      Boolean(validation.messageErrors[message.id])
    )?.id;
    if (firstInvalidId) {
      setFocusMessageId(firstInvalidId);
      return;
    }
    if (validation.generalError) {
      window.requestAnimationFrame(() => formErrorRef.current?.focus());
      return;
    }

    submitInFlightRef.current = true;
    const controller = new AbortController();
    submitAbortRef.current = controller;
    setLoading(true);
    let navigating = false;

    try {
      const payload = messages.map((message, index) => ({
        ...message,
        order: index + 1,
      }));
      const response = await fetch("/api/scans/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
        signal: controller.signal,
      });
      const body = await readApiEnvelope(response);
      const scanId = body.data?.scanId;
      if (!response.ok || !body.ok || !scanId) {
        throw new Error(
          body.error?.message ?? "Percakapan belum bisa dianalisis.",
        );
      }

      navigating = true;
      router.push(`/result/${scanId}`);
    } catch (error) {
      if (isAbortError(error)) return;
      setRequestError(
        !navigator.onLine
          ? "Koneksi terputus. Draft tetap tersimpan di halaman ini; sambungkan jaringan lalu coba lagi."
          : error instanceof TypeError
          ? "Jaringan belum dapat menjangkau AmanKlik. Draft tetap tersimpan; coba lagi setelah koneksi stabil."
          : error instanceof Error
          ? error.message
          : "Percakapan belum bisa dianalisis.",
      );
      window.requestAnimationFrame(() => requestErrorRef.current?.focus());
    } finally {
      if (submitAbortRef.current === controller) submitAbortRef.current = null;
      if (!navigating) {
        submitInFlightRef.current = false;
        setLoading(false);
      }
    }
  }

  return (
    <TaskSurface className="mt-8 sm:mt-10">
      <form noValidate onSubmit={(event) => void submit(event)}>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 p-5 sm:p-8 lg:p-10">
            {isSyntheticExample ? (
              <StatusBand tone="info" role="status">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6">
                    <strong>Contoh sintetis.</strong> Dua pesan ini hanya
                    menunjukkan bentuk timeline dan bukan data milikmu.
                  </p>
                  <button
                    type="button"
                    className="min-h-11 shrink-0 text-sm font-semibold text-ai underline underline-offset-4"
                    disabled={loading}
                    onClick={startBlank}
                  >
                    Mulai kosong
                  </button>
                </div>
              </StatusBand>
            ) : null}

            <ol className="mt-7 border-y border-line">
              {messages.map((message, index) => {
                const error = fieldErrors[message.id];
                const countId = `conversation-${message.id}-count`;
                const helpId = `conversation-${message.id}-help`;
                const errorId = `conversation-${message.id}-error`;
                return (
                  <li
                    key={message.id}
                    className="grid grid-cols-[42px_minmax(0,1fr)] border-t border-line py-6 first:border-t-0 sm:grid-cols-[56px_minmax(0,1fr)]"
                  >
                    <span
                      className="pt-1 font-mono text-xs text-ai"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <label
                          className="product-field-label"
                          htmlFor={`conversation-${message.id}`}
                        >
                          Pesan {index + 1}
                        </label>
                        <div className="flex flex-wrap items-end gap-3">
                          <SpeakerMenu
                            id={`conversation-${message.id}-speaker`}
                            value={message.speaker}
                            disabled={loading}
                            onChange={(speaker) =>
                              updateMessage(message.id, { speaker })}
                          />
                          <button
                            type="button"
                            className="min-h-11 px-2 text-xs font-semibold text-muted underline underline-offset-4 hover:text-risk disabled:cursor-not-allowed disabled:opacity-45"
                            disabled={loading || messages.length <= 2}
                            aria-label={`Hapus pesan ${index + 1}`}
                            aria-describedby={messages.length <= 2
                              ? "conversation-minimum-note"
                              : undefined}
                            onClick={() => removeMessage(message.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <textarea
                        ref={(node) => {
                          if (node) textareaRefs.current.set(message.id, node);
                          else textareaRefs.current.delete(message.id);
                        }}
                        id={`conversation-${message.id}`}
                        name={`message-${index + 1}`}
                        className="product-textarea mt-3 min-h-32"
                        value={message.text}
                        maxLength={MAX_MESSAGE_LENGTH}
                        required
                        disabled={loading}
                        aria-invalid={Boolean(error)}
                        aria-describedby={`${helpId} ${countId}${
                          error ? ` ${errorId}` : ""
                        }`}
                        onBlur={() => {
                          if (!message.text.trim()) {
                            setFieldErrors((current) => ({
                              ...current,
                              [message.id]: "Isi pesan tidak boleh kosong.",
                            }));
                          }
                        }}
                        onChange={(event) =>
                          updateMessage(message.id, { text: event.target.value })}
                        placeholder="Tempel satu pesan yang sudah dihapus data sensitifnya…"
                      />
                      <p id={helpId} className="product-field-help">
                        Masukkan satu pesan sesuai posisi kronologisnya.
                      </p>
                      {error ? (
                        <p id={errorId} className="product-field-error">
                          {error}
                        </p>
                      ) : null}
                      <span
                        id={countId}
                        className={`product-character-count ${
                          message.text.length >= MAX_MESSAGE_LENGTH * 0.9
                            ? "text-warning"
                            : ""
                        }`}
                      >
                        {message.text.length.toLocaleString("id-ID")} / 4.000
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="product-button product-button--secondary"
                disabled={loading || messages.length >= MAX_MESSAGES}
                onClick={addMessage}
              >
                + Tambah pesan
              </button>
              <span className="font-mono text-xs text-muted">
                {messages.length} / 12 pesan
              </span>
            </div>
            <p id="conversation-minimum-note" className="mt-3 text-xs text-muted">
              Minimal dua pesan diperlukan. Maksimal dua belas pesan.
            </p>

            {totalTooLong || formError ? (
              <div
                ref={formErrorRef}
                className="mt-5 outline-none"
                tabIndex={-1}
              >
                <StatusBand tone="error" role="alert">
                  <strong>Panjang percakapan perlu disesuaikan.</strong>
                  <p className="mt-1 text-sm">
                    {formError ??
                      "Total percakapan melebihi batas 16.000 karakter."}
                  </p>
                </StatusBand>
              </div>
            ) : null}

            <div className="product-dark-inset mt-8 p-5 sm:p-6">
              <p className="product-eyebrow text-ai-soft">Sebelum mengirim</p>
              <p className="mt-3 text-sm leading-7 text-surface/75">
                Dalam mode AI aktif, isi percakapan diproses oleh layanan AI
                pihak ketiga Google. Hapus OTP, password, nomor rekening,
                identitas, dan detail transaksi; kirim hanya konteks minimum.
              </p>
              <button
                type="submit"
                className="product-button product-button--secondary mt-5 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Menganalisis urutan…" : "Analisis percakapan"}
              </button>
            </div>

            {loading ? (
              <div className="mt-5">
                <StatusBand tone="loading" role="status">
                  <strong>Menerima urutan → memeriksa pola → menyusun hasil</strong>
                  <p className="mt-1 text-sm">
                    Draft tetap berada di halaman sampai hasil berhasil dibuat.
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
                  <strong>Analisis belum selesai.</strong>
                  <p className="mt-1 text-sm">{requestError}</p>
                </StatusBand>
              </div>
            ) : null}
          </div>

          <aside className="border-t border-line bg-canvas p-5 sm:p-8 lg:sticky lg:top-24 lg:self-start lg:border-l lg:border-t-0">
            <p className="product-eyebrow text-ai">Ringkasan urutan</p>
            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-muted">Jumlah pesan</dt>
                <dd className="font-mono font-semibold">{messages.length} / 12</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-muted">Total karakter</dt>
                <dd
                  className={`font-mono font-semibold ${
                    totalCharacters >= MAX_TOTAL_LENGTH * 0.9
                      ? "text-warning"
                      : ""
                  } ${totalTooLong ? "text-risk" : ""}`}
                >
                  {totalCharacters.toLocaleString("id-ID")} / 16.000
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-muted">Urutan pengirim</dt>
                <dd className="mt-2 break-words font-mono text-xs leading-6">
                  {messages.map((message) =>
                    message.speaker === "user" ? "Saya" : "Pengirim"
                  ).join(" → ")}
                </dd>
              </div>
            </dl>
            <p className="product-eyebrow mt-8 text-muted">Batas analisis</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>• Urutan dibaca, bukan identitas orang.</li>
              <li>• Tautan tetap dianalisis tanpa dibuka.</li>
              <li>• Hasil dapat keliru dan perlu verifikasi resmi.</li>
            </ul>
          </aside>
        </div>
      </form>
    </TaskSurface>
  );
}
