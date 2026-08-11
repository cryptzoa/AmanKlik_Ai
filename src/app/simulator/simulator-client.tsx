"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { SIMULATOR_SCENARIOS, evaluateScenario } from "@/lib/simulator/scenarios";
import type {
  SimulatorChoice,
  SimulatorChoiceQuality,
  SimulatorEvaluation,
} from "@/lib/simulator/scenarios";
import type { PersonalizedPractice } from "@/lib/simulator/personalized";

const QUALITY_COPY: Record<SimulatorChoiceQuality, { label: string; className: string }> = {
  safe: { label: "Langkah aman", className: "border-safe bg-[var(--safe-soft)] text-ink" },
  partial: { label: "Belum cukup", className: "border-warning bg-[var(--warning-soft)] text-ink" },
  unsafe: { label: "Berisiko", className: "border-risk bg-[var(--risk-soft)] text-ink" },
};

const LEVEL_COPY: Record<SimulatorEvaluation["level"], { eyebrow: string; title: string; body: string }> = {
  strong: {
    eyebrow: "Refleks kuat",
    title: "Kamu konsisten memindahkan keputusan ke sumber yang lebih aman.",
    body: "Pertahankan pola ini ketika pesan terasa mendesak atau sangat meyakinkan.",
  },
  developing: {
    eyebrow: "Mulai terbentuk",
    title: "Beberapa keputusanmu sudah menciptakan jeda, tetapi verifikasinya belum selalu independen.",
    body: "Tinjau momen yang bertanda Belum cukup atau Berisiko, lalu ulangi skenarionya.",
  },
  retry: {
    eyebrow: "Perlu diulang",
    title: "Tekanan skenario masih berhasil mengarahkan keputusanmu.",
    body: "Ini latihan, bukan kegagalan. Baca aturan utamanya lalu coba lagi tanpa terburu-buru.",
  },
};

function ChoiceFeedback({ choice, onContinue, finalStep }: { choice: SimulatorChoice; onContinue: () => void; finalStep: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quality = QUALITY_COPY[choice.quality];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className={`mt-5 border-l-4 p-5 sm:p-6 ${quality.className}`} aria-labelledby="decision-feedback-title" aria-live="polite">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">{quality.label} · {choice.points}/100</p>
      <h3 ref={headingRef} tabIndex={-1} id="decision-feedback-title" className="mt-3 text-xl font-semibold outline-none">Kenapa keputusan ini dinilai begitu?</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7">{choice.feedback}</p>
      {choice.saferAction ? <p className="mt-4 border-t border-current/20 pt-4 text-sm leading-7"><strong>Langkah yang lebih aman:</strong> {choice.saferAction}</p> : null}
      <button type="button" className="mt-6 min-h-12 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-ai" onClick={onContinue}>
        {finalStep ? "Lihat hasil latihan" : "Lanjut ke keputusan berikutnya"} →
      </button>
    </section>
  );
}

export function SimulatorClient() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [result, setResult] = useState<SimulatorEvaluation | null>(null);
  const [practice, setPractice] = useState<PersonalizedPractice | null>(null);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>([]);
  const userInteracted = useRef(false);

  const scenario = practice?.scenario ?? SIMULATOR_SCENARIOS[scenarioIndex];
  const step = scenario.steps[stepIndex];
  const selectedChoice = selectedChoiceId
    ? step.choices.find((choice) => choice.id === selectedChoiceId) ?? null
    : null;
  const activeScenarioIndex = useMemo(
    () => Math.max(0, SIMULATOR_SCENARIOS.findIndex((item) => item.id === scenario.id)),
    [scenario.id],
  );

  useEffect(() => {
    const sourceScanId = new URLSearchParams(window.location.search).get("from");
    if (!sourceScanId) return;
    let active = true;
    void fetch(`/api/scans/${encodeURIComponent(sourceScanId)}/practice`)
      .then((response) => response.ok ? response.json() : null)
      .then((body: { ok?: boolean; data?: { practice: PersonalizedPractice } } | null) => {
        if (active && !userInteracted.current && body?.ok && body.data?.practice) {
          setPractice(body.data.practice);
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  function resetRound() {
    setStepIndex(0);
    setChoiceIds([]);
    setSelectedChoiceId(null);
    setResult(null);
  }

  function changeScenario(index: number) {
    userInteracted.current = true;
    setPractice(null);
    setScenarioIndex(index);
    resetRound();
  }

  function choose(choiceId: string) {
    if (selectedChoiceId) return;
    userInteracted.current = true;
    setSelectedChoiceId(choiceId);
  }

  function continueScenario() {
    if (!selectedChoiceId) return;
    const nextChoiceIds = [...choiceIds, selectedChoiceId];

    if (stepIndex === scenario.steps.length - 1) {
      const evaluation = evaluateScenario(scenario.id, nextChoiceIds);
      if (!evaluation) return;
      setChoiceIds(nextChoiceIds);
      setResult(evaluation);
      setCompletedScenarioIds((current) => current.includes(scenario.id) ? current : [...current, scenario.id]);
      setSelectedChoiceId(null);
      return;
    }

    setChoiceIds(nextChoiceIds);
    setStepIndex((current) => current + 1);
    setSelectedChoiceId(null);
  }

  function nextScenario() {
    changeScenario((activeScenarioIndex + 1) % SIMULATOR_SCENARIOS.length);
  }

  const progressValue = result ? scenario.steps.length : stepIndex + (selectedChoice ? 1 : 0);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[0.3fr_0.7fr]">
      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Pilih skenario</p>
          <span className="font-mono text-xs text-ai">{SIMULATOR_SCENARIOS.length} latihan</span>
        </div>

        <label className="mt-4 block text-sm font-semibold lg:hidden">
          Skenario aktif
          <select
            className="mt-2 min-h-12 w-full border border-line bg-surface px-4"
            value={scenario.id}
            onChange={(event) => changeScenario(SIMULATOR_SCENARIOS.findIndex((item) => item.id === event.target.value))}
          >
            {SIMULATOR_SCENARIOS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>

        <div className="mt-4 hidden space-y-2 lg:block">
          {SIMULATOR_SCENARIOS.map((item, index) => {
            const active = item.id === scenario.id;
            const completed = completedScenarioIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                className={`lift-link grid w-full grid-cols-[32px_1fr_auto] items-center gap-2 border px-4 py-3 text-left text-sm ${active ? "border-ink bg-ink text-surface" : "border-transparent bg-surface text-muted hover:border-line hover:text-ink"}`}
                onClick={() => changeScenario(index)}
              >
                <span className="font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>
                <span><strong className="block">{item.title}</strong><small className="mt-1 block font-mono text-[10px] uppercase opacity-65">{item.tag} · {item.estimatedMinutes} menit</small></span>
                <span className="font-mono text-xs" aria-label={completed ? "Selesai" : "Belum selesai"}>{completed ? "✓" : ""}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-line pt-5 text-sm leading-7 text-muted">
          <strong className="text-ink">Bukan tes hafalan.</strong> Pilih respons yang benar-benar akan kamu lakukan. Feedback muncul setelah setiap keputusan.
        </div>
      </aside>

      <section className="motion-surface p-5 sm:p-8" aria-labelledby="simulator-scenario-title">
        {practice ? (
          <div className="relative z-10 mb-6 border-l-4 border-ai bg-ai-soft p-4 text-sm leading-6">
            <strong>{practice.title}</strong>
            <p className="mt-1 text-muted">{practice.learningObjective}</p>
          </div>
        ) : null}

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-5 border-b border-line pb-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.12em]">
              <span className="text-ai">Skenario sintetis</span>
              <span className="text-muted">· {scenario.tag} · ±{scenario.estimatedMinutes} menit</span>
            </div>
            <h2 id="simulator-scenario-title" className="mt-3 text-2xl font-semibold sm:text-3xl">{scenario.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{scenario.description}</p>
          </div>
          <span className="shrink-0 border border-line px-3 py-2 font-mono text-xs text-muted">{result ? "Selesai" : `${stepIndex + 1} / ${scenario.steps.length}`}</span>
        </div>

        <div
          className="relative z-10 mt-5 h-1 overflow-hidden bg-canvas"
          role="progressbar"
          aria-label="Kemajuan skenario"
          aria-valuemin={0}
          aria-valuemax={scenario.steps.length}
          aria-valuenow={progressValue}
        >
          <span className="block h-full origin-left bg-ai transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${progressValue / scenario.steps.length})` }} />
        </div>

        {result ? (
          <div className="relative z-10 py-8" aria-live="polite">
            <div className="grid gap-6 border-b border-line pb-8 sm:grid-cols-[0.32fr_0.68fr] sm:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-safe">{LEVEL_COPY[result.level].eyebrow}</p>
                <p className="mt-3 font-mono text-5xl font-semibold tracking-[-0.06em]">{result.score}<span className="ml-2 text-lg text-muted">/ 100</span></p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{LEVEL_COPY[result.level].title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{LEVEL_COPY[result.level].body}</p>
              </div>
            </div>

            <section className="border-b border-line py-8" aria-labelledby="transferable-rule-title">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Aturan yang dibawa pulang</p>
              <h3 id="transferable-rule-title" className="mt-3 max-w-3xl text-2xl font-semibold leading-snug">{result.transferableRule}</h3>
            </section>

            <section className="py-8" aria-labelledby="decision-review-title">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Review keputusan</p><h3 id="decision-review-title" className="mt-2 text-xl font-semibold">Lihat momen yang masih bisa diperkuat.</h3></div>
                <p className="text-xs text-muted">{result.safeCount} aman · {result.partialCount} belum cukup · {result.unsafeCount} berisiko</p>
              </div>
              <ol className="mt-5 grid gap-px border border-line bg-line">
                {result.decisions.map((decision, index) => {
                  const quality = QUALITY_COPY[decision.quality];
                  return (
                    <li key={decision.stepId} className="bg-surface p-5 sm:grid sm:grid-cols-[42px_1fr] sm:gap-3 sm:p-6">
                      <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="font-semibold">{decision.label}</p>
                        <span className={`mt-2 inline-flex border-l-2 px-2 py-1 font-mono text-[10px] font-semibold uppercase ${quality.className}`}>{quality.label}</span>
                        <p className="mt-3 text-sm leading-7 text-muted">{decision.feedback}</p>
                        {decision.saferAction ? <p className="mt-2 text-sm leading-7"><strong>Lebih aman:</strong> {decision.saferAction}</p> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div className="border-t border-line pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Dasar materi</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {scenario.sources.map((source) => (
                  <a key={source.url} className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-xs font-semibold text-ai transition hover:border-ai hover:bg-ai-soft" href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="min-h-12 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface hover:bg-ai" onClick={resetRound}>Ulangi skenario</button>
              <button type="button" className="min-h-12 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold hover:border-ink" onClick={nextScenario}>Skenario berikutnya →</button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai">{step.phase}</p>
            <h3 className="mt-3 text-xl font-semibold">{step.prompt}</h3>
            <p className="mt-5 border-l-4 border-risk bg-canvas p-5 text-lg leading-8 tracking-[-0.02em] sm:p-6 sm:text-2xl">“{step.message}”</p>
            <div className="mt-6 grid gap-3" aria-label="Pilihan respons">
              {step.choices.map((choice, index) => {
                const active = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={Boolean(selectedChoiceId)}
                    aria-pressed={active}
                    className={`group grid min-h-14 grid-cols-[38px_1fr_auto] items-center border px-4 py-4 text-left text-sm font-semibold transition ${active ? "border-ink bg-ink text-surface" : selectedChoiceId ? "border-line bg-surface text-muted opacity-55" : "lift-link border-line bg-surface hover:border-ai hover:bg-ai-soft"}`}
                    onClick={() => choose(choice.id)}
                  >
                    <span className="font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>
                    <span>{choice.label}</span>
                    <span className="text-ai group-hover:translate-x-1" aria-hidden="true">{active ? "✓" : "→"}</span>
                  </button>
                );
              })}
            </div>
            {selectedChoice ? <ChoiceFeedback key={`${step.id}-${selectedChoice.id}`} choice={selectedChoice} onContinue={continueScenario} finalStep={stepIndex === scenario.steps.length - 1} /> : null}
          </div>
        )}
      </section>
    </div>
  );
}
