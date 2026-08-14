"use client";

import { useEffect, useRef } from "react";
import type {
  SimulatorChoice,
  SimulatorEvaluation,
  SimulatorScenario,
  SimulatorStep,
} from "@/lib/simulator/scenarios";
import type { PersonalizedPractice } from "@/lib/simulator/personalized";
import { ChoiceFeedbackSection } from "@/app/simulator/_components/choice-feedback-section";
import { DecisionReviewSection } from "@/app/simulator/_components/decision-review-section";
import { TransferableRuleSection } from "@/app/simulator/_components/transferable-rule-section";

const LEVEL_COPY: Record<
  SimulatorEvaluation["level"],
  { eyebrow: string; title: string; body: string }
> = {
  strong: {
    eyebrow: "Refleks kuat",
    title: "Kamu konsisten memindahkan keputusan ke sumber yang lebih aman.",
    body:
      "Pertahankan pola ini ketika pesan terasa mendesak atau sangat meyakinkan.",
  },
  developing: {
    eyebrow: "Mulai terbentuk",
    title:
      "Beberapa keputusanmu sudah menciptakan jeda, tetapi verifikasinya belum selalu independen.",
    body:
      "Tinjau momen yang bertanda Belum cukup atau Berisiko, lalu ulangi skenarionya.",
  },
  retry: {
    eyebrow: "Perlu diulang",
    title: "Tekanan skenario masih berhasil mengarahkan keputusanmu.",
    body:
      "Ini latihan, bukan kegagalan. Baca aturan utamanya lalu coba lagi tanpa terburu-buru.",
  },
};

type Props = {
  scenario: SimulatorScenario;
  step: SimulatorStep;
  stepIndex: number;
  selectedChoiceId: string | null;
  selectedChoice: SimulatorChoice | null;
  result: SimulatorEvaluation | null;
  practice: PersonalizedPractice | null;
  practiceState: "idle" | "loading" | "loaded" | "unavailable";
  completedCount: number;
  progressValue: number;
  manageFocus: boolean;
  onChoose: (choiceId: string) => void;
  onContinue: () => void;
  onReset: () => void;
  onNext: () => void;
};

export function ScenarioPanelSection(
  {
    scenario,
    step,
    stepIndex,
    selectedChoiceId,
    selectedChoice,
    result,
    practice,
    practiceState,
    completedCount,
    progressValue,
    manageFocus,
    onChoose,
    onContinue,
    onReset,
    onNext,
  }: Props,
) {
  const contentHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!manageFocus) return;
    const frame = window.requestAnimationFrame(() => {
      contentHeadingRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [manageFocus, result, step.id]);

  return (
    <section
      className="product-task-surface p-5 sm:p-8"
      aria-labelledby="simulator-scenario-title"
    >
      {practiceState === "loading" ? (
        <p className="relative z-10 mb-5 rounded-[16px] border-l-4 border-ai bg-ai-soft p-4 text-sm" role="status">
          Menyiapkan latihan dari hasil pemeriksaan…
        </p>
      ) : null}
      {practiceState === "unavailable" ? (
        <p className="relative z-10 mb-5 rounded-[16px] border-l-4 border-warning bg-warning-soft p-4 text-sm leading-6" role="status">
          Personalisasi belum tersedia. Latihan lokal tetap dapat digunakan
          tanpa kehilangan pilihanmu.
        </p>
      ) : null}
      {practice
        ? (
          <div className="relative z-10 mb-6 rounded-[16px] border-l-4 border-ai bg-ai-soft p-4 text-sm leading-6">
            <strong>{practice.title}</strong>
            <p className="mt-1 text-muted">{practice.learningObjective}</p>
          </div>
        )
        : null}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-5 border-b border-line pb-6">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.12em]">
            <span className="text-ai">Skenario sintetis</span>
            <span className="text-muted">
              · {scenario.tag} · ±{scenario.estimatedMinutes} menit
            </span>
          </div>
          <h2
            id="simulator-scenario-title"
            className="mt-3 text-2xl font-semibold sm:text-3xl"
          >
            {scenario.title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            {scenario.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-line px-3 py-2 font-mono text-xs text-muted">
          {result ? "Selesai" : `${stepIndex + 1} / ${scenario.steps.length}`}
        </span>
      </div>
      <div
        className="relative z-10 mt-5 h-1 overflow-hidden bg-canvas"
        role="progressbar"
        aria-label="Kemajuan skenario"
        aria-valuemin={0}
        aria-valuemax={scenario.steps.length}
        aria-valuenow={progressValue}
        aria-valuetext={`${progressValue} dari ${scenario.steps.length} keputusan`}
      >
        <span
          className="block h-full origin-left bg-ai transition-transform duration-300 motion-reduce:transition-none"
          style={{
            transform: `scaleX(${progressValue / scenario.steps.length})`,
          }}
        />
      </div>
      {result
        ? (
          <div className="relative z-10 py-8" aria-live="polite">
            {completedCount === 8 ? (
              <section className="mb-8 rounded-[20px] bg-ai p-5 text-white sm:p-7" aria-labelledby="all-scenarios-complete">
                <p className="product-eyebrow text-white/70">Rangkaian selesai</p>
                <h3 id="all-scenarios-complete" className="mt-3 text-2xl font-semibold">
                  Delapan skenario sudah kamu selesaikan.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
                  Tinjau keputusan pada skenario ini, lalu ulangi skenario yang
                  masih terasa sulit. Tidak ada streak atau peringkat yang perlu
                  dipertahankan.
                </p>
              </section>
            ) : null}
            <div className="grid gap-6 border-b border-line pb-8 sm:grid-cols-[0.32fr_0.68fr] sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-safe">
                  {LEVEL_COPY[result.level].eyebrow}
                </p>
                <p className="mt-3 font-mono text-5xl font-semibold tracking-[-0.06em]">
                  {result.score}
                  <span className="ml-2 text-lg text-muted">/ 100</span>
                </p>
              </div>
              <div>
                <h3
                  ref={contentHeadingRef}
                  tabIndex={-1}
                  className="text-2xl font-semibold tracking-[-0.03em] outline-none"
                >
                  {LEVEL_COPY[result.level].title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {LEVEL_COPY[result.level].body}
                </p>
              </div>
            </div>
            <TransferableRuleSection rule={result.transferableRule} />
            <DecisionReviewSection result={result} />
            <div className="border-t border-line pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Dasar materi
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {scenario.sources.map((source) => (
                  <a
                    key={source.url}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 py-2 text-xs font-semibold text-ai transition hover:border-ai hover:bg-ai-soft"
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {source.title} ↗
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="product-button product-button--primary"
                onClick={onReset}
              >
                Ulangi skenario
              </button>
              <button
                type="button"
                className="product-button product-button--secondary"
                onClick={onNext}
              >
                Skenario berikutnya →
              </button>
            </div>
          </div>
        )
        : (
          <div className="relative z-10 py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai">
              {step.phase}
            </p>
            <h3
              ref={contentHeadingRef}
              tabIndex={-1}
              className="mt-3 text-xl font-semibold outline-none"
            >
              {step.prompt}
            </h3>
            <p className="mt-5 rounded-[18px] border-l-4 border-risk bg-canvas p-5 text-lg leading-8 tracking-[-0.02em] sm:p-6 sm:text-2xl">
              “{step.message}”
            </p>
            <div className="mt-6 grid gap-3" aria-label="Pilihan respons">
              {step.choices.map((choice, index) => {
                const active = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={Boolean(selectedChoiceId)}
                    aria-pressed={active}
                    className={`product-choice-row group grid min-h-14 grid-cols-[38px_1fr_auto] items-center border px-4 py-4 text-left text-sm font-semibold transition ${
                      active
                        ? "border-ink bg-ink text-surface"
                        : selectedChoiceId
                        ? "border-line bg-surface text-muted opacity-55"
                        : "lift-link border-line bg-surface hover:border-ai hover:bg-ai-soft"
                    }`}
                    onClick={() => onChoose(choice.id)}
                  >
                    <span className="font-mono text-xs opacity-60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{choice.label}</span>
                    <span
                      className="text-ai group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      {active ? "✓" : "→"}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedChoice
              ? (
                <ChoiceFeedbackSection
                  key={`${step.id}-${selectedChoice.id}`}
                  choice={selectedChoice}
                  onContinue={onContinue}
                  finalStep={stepIndex === scenario.steps.length - 1}
                />
              )
              : null}
          </div>
        )}
    </section>
  );
}
