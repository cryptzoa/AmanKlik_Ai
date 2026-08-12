"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ConversationMessageInput,
  ConversationSpeaker,
} from "@/types/conversation";

const initialMessages: ConversationMessageInput[] = [
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

export function ConversationClient() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateMessage(id: string, patch: Partial<ConversationMessageInput>) {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, ...patch } : message
      )
    );
  }

  function addMessage() {
    if (messages.length >= 12) return;
    const order = messages.length + 1;
    setMessages((
      current,
    ) => [...current, { id: `m${order}`, speaker: "sender", text: "", order }]);
  }

  function removeMessage(id: string) {
    if (messages.length <= 2) return;
    setMessages((current) =>
      current.filter((message) => message.id !== id).map((message, index) => ({
        ...message,
        id: `m${index + 1}`,
        order: index + 1,
      }))
    );
  }

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/scans/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(
          body.error?.message ?? "Percakapan belum bisa dianalisis.",
        );
      }
      router.push(`/result/${body.data.scanId}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Percakapan belum bisa dianalisis.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <article
              key={message.id}
              className="border border-line bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  className="font-mono text-xs uppercase tracking-[0.14em] text-ai"
                  htmlFor={`conversation-${message.id}`}
                >
                  Pesan {String(index + 1).padStart(2, "0")}
                </label>
                <div className="flex items-center gap-3">
                  <select
                    aria-label={`Pengirim pesan ${index + 1}`}
                    className="border border-line bg-canvas px-3 py-2 text-xs font-semibold"
                    value={message.speaker}
                    onChange={(event) =>
                      updateMessage(message.id, {
                        speaker: event.target.value as ConversationSpeaker,
                      })}
                  >
                    <option value="sender">Pengirim</option>
                    <option value="user">Saya</option>
                  </select>
                  {messages.length > 2
                    ? (
                      <button
                        type="button"
                        className="text-xs text-muted underline underline-offset-4 hover:text-risk"
                        onClick={() => removeMessage(message.id)}
                      >
                        Hapus
                      </button>
                    )
                    : null}
                </div>
              </div>
              <textarea
                id={`conversation-${message.id}`}
                className="mt-4 min-h-28 w-full resize-y border border-line bg-canvas p-4 text-sm leading-7 outline-none focus:border-ai"
                maxLength={4_000}
                value={message.text}
                onChange={(event) =>
                  updateMessage(message.id, { text: event.target.value })}
                placeholder="Tempel satu pesan yang sudah dihapus datanya…"
              />
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="min-h-11 border border-line bg-surface px-4 py-3 text-sm font-semibold hover:border-ai hover:text-ai"
            onClick={addMessage}
            disabled={messages.length >= 12}
          >
            + Tambah pesan
          </button>
          <span className="font-mono text-xs text-muted">
            {messages.length} / 12 pesan · maksimum 16.000 karakter
          </span>
        </div>
        <div className="mt-8 border-t border-line pt-5">
          <button
            type="button"
            className="min-h-12 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai disabled:cursor-not-allowed disabled:opacity-40"
            disabled={loading ||
              messages.some((message) => message.text.trim().length < 1)}
            onClick={() => void submit()}
          >
            {loading ? "Menganalisis urutan…" : "Analisis percakapan"}
          </button>
          {error
            ? (
              <p
                className="mt-4 border border-risk/30 bg-risk-soft px-4 py-3 text-sm"
                role="alert"
              >
                {error}
              </p>
            )
            : null}
        </div>
      </div>
      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">
          Batas analisis
        </p>
        <ul className="mt-5 divide-y divide-line border-b border-line text-sm leading-6 text-muted">
          <li className="py-4">Maksimum 12 pesan.</li>
          <li className="py-4">Urutan dibaca, bukan identitas orang.</li>
          <li className="py-4">URL tetap dianalisis statis.</li>
          <li className="py-4">Pesan mentah tidak dipersistenkan.</li>
        </ul>
      </aside>
    </div>
  );
}
