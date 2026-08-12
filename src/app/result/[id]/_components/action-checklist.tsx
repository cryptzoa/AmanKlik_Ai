"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

import type { ActionItem } from "@/types/analysis";
import type { ActionProgressState } from "@/types/action-progress";

const priorityLabels: Record<ActionItem["priority"], string> = {
  now: "Sekarang",
  next: "Berikutnya",
  if_already_acted: "Jika sudah bertindak",
};

export function ActionChecklist(
  { scanId, actions, initialProgress }: {
    scanId: string;
    actions: ActionItem[];
    initialProgress: Record<string, ActionProgressState>;
  },
) {
  const [progress, setProgress] = useState(initialProgress);
  const [saving, setSaving] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });
    gsap.from("[data-action-row]", {
      autoAlpha: 0,
      y: 30,
      stagger: 0.07,
      duration: 0.58,
      scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
    });
  }, { scope: root });

  const [message, setMessage] = useState<string | null>(null);
  const completed = useMemo(
    () =>
      actions.filter((action) => progress[action.id] === "completed").length,
    [actions, progress],
  );
  const percent = actions.length
    ? Math.round((completed / actions.length) * 100)
    : 0;

  async function update(actionId: string, state: ActionProgressState) {
    const previous = progress[actionId] ?? "pending";
    setProgress((current) => ({ ...current, [actionId]: state }));
    setSaving(actionId);
    setMessage(null);
    try {
      const response = await fetch(`/api/scans/${scanId}/actions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId, state }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body.error?.message ?? "Progres belum tersimpan.");
      }
      setMessage(
        state === "completed"
          ? "Langkah ditandai selesai."
          : "Status langkah diperbarui.",
      );
    } catch (error) {
      setProgress((current) => ({ ...current, [actionId]: previous }));
      setMessage(
        error instanceof Error ? error.message : "Progres belum tersimpan.",
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <section
      ref={root}
      className="border-t border-line py-16"
      aria-labelledby="action-heading"
    >
      <div className="grid gap-7 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
        <div>
          <p className="eyebrow-label text-risk">04 / Langkah aman</p>
          <h2 id="action-heading" className="section-title mt-4 max-w-3xl">
            Yang sebaiknya dilakukan sekarang
          </h2>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em]">
            <span>Progres</span>
            <span>{completed}/{actions.length}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-safe transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
      <ol className="mt-9 border-y border-line">
        {actions.map((action, index) => {
          const state = progress[action.id] ?? "pending";
          return (
            <li
              key={action.id}
              data-action-row
              className={`editorial-row grid gap-3 py-7 sm:grid-cols-[64px_1fr] sm:px-5 ${
                state === "completed"
                  ? "bg-safe-soft"
                  : state === "skipped"
                  ? "bg-canvas text-muted"
                  : "bg-surface"
              }`}
            >
              <span className="font-mono text-sm text-muted">
                {state === "completed"
                  ? "✓"
                  : String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ai">
                  {priorityLabels[action.priority]}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  {action.title}
                </h3>
                <p className="mt-2 flex-1 leading-7 text-muted">
                  {action.body}
                </p>
                {action.sourceTitle && action.sourceUrl
                  ? (
                    <a
                      className="mt-3 inline-flex text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai"
                      href={action.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Sumber resmi: {action.sourceTitle}
                    </a>
                  )
                  : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={saving === action.id}
                    className={`min-h-11 rounded-full px-4 text-xs font-semibold ${
                      state === "completed"
                        ? "border border-ink bg-transparent text-ink"
                        : "bg-ink text-surface hover:bg-ai"
                    }`}
                    onClick={() =>
                      void update(
                        action.id,
                        state === "completed" ? "pending" : "completed",
                      )}
                  >
                    {state === "completed"
                      ? "Batalkan selesai"
                      : "Tandai selesai"}
                  </button>
                  <button
                    type="button"
                    disabled={saving === action.id}
                    className="min-h-11 rounded-full border border-line px-4 text-xs font-semibold hover:border-ai"
                    onClick={() =>
                      void update(
                        action.id,
                        state === "skipped" ? "pending" : "skipped",
                      )}
                  >
                    {state === "skipped" ? "Aktifkan lagi" : "Tidak relevan"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      {message
        ? <p className="mt-4 text-sm text-muted" role="status">{message}</p>
        : null}
    </section>
  );
}
