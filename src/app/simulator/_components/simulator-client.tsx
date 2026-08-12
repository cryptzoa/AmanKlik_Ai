"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ScenarioPanelSection } from "@/app/simulator/_components/scenario-panel-section";
import {
  evaluateScenario,
  SIMULATOR_SCENARIOS,
} from "@/lib/simulator/scenarios";
import type { SimulatorEvaluation } from "@/lib/simulator/scenarios";
import type { PersonalizedPractice } from "@/lib/simulator/personalized";

export function SimulatorClient() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [result, setResult] = useState<SimulatorEvaluation | null>(null);
  const [practice, setPractice] = useState<PersonalizedPractice | null>(null);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>(
    [],
  );
  const userInteracted = useRef(false);

  const scenario = practice?.scenario ?? SIMULATOR_SCENARIOS[scenarioIndex];
  const step = scenario.steps[stepIndex];
  const selectedChoice = selectedChoiceId
    ? step.choices.find((choice) => choice.id === selectedChoiceId) ?? null
    : null;
  const activeScenarioIndex = useMemo(
    () =>
      Math.max(
        0,
        SIMULATOR_SCENARIOS.findIndex((item) => item.id === scenario.id),
      ),
    [scenario.id],
  );

  useEffect(() => {
    const sourceScanId = new URLSearchParams(window.location.search).get(
      "from",
    );
    if (!sourceScanId) return;
    let active = true;
    void fetch(`/api/scans/${encodeURIComponent(sourceScanId)}/practice`)
      .then((response) => response.ok ? response.json() : null)
      .then(
        (
          body:
            | { ok?: boolean; data?: { practice: PersonalizedPractice } }
            | null,
        ) => {
          if (
            active && !userInteracted.current && body?.ok && body.data?.practice
          ) {
            setPractice(body.data.practice);
          }
        },
      )
      .catch(() => undefined);
    return () => {
      active = false;
    };
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
      setCompletedScenarioIds((current) =>
        current.includes(scenario.id) ? current : [...current, scenario.id]
      );
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

  const progressValue = result
    ? scenario.steps.length
    : stepIndex + (selectedChoice ? 1 : 0);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[0.3fr_0.7fr]">
      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            Pilih skenario
          </p>
          <span className="font-mono text-xs text-ai">
            {SIMULATOR_SCENARIOS.length} latihan
          </span>
        </div>

        <label className="mt-4 block text-sm font-semibold lg:hidden">
          Skenario aktif
          <select
            className="mt-2 min-h-12 w-full border border-line bg-surface px-4"
            value={scenario.id}
            onChange={(event) =>
              changeScenario(SIMULATOR_SCENARIOS.findIndex((item) =>
                item.id === event.target.value
              ))}
          >
            {SIMULATOR_SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
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
                className={`lift-link grid w-full grid-cols-[32px_1fr_auto] items-center gap-2 border px-4 py-3 text-left text-sm ${
                  active
                    ? "border-ink bg-ink text-surface"
                    : "border-transparent bg-surface text-muted hover:border-line hover:text-ink"
                }`}
                onClick={() => changeScenario(index)}
              >
                <span className="font-mono text-xs opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong className="block">{item.title}</strong>
                  <small className="mt-1 block font-mono text-[10px] uppercase opacity-65">
                    {item.tag} · {item.estimatedMinutes} menit
                  </small>
                </span>
                <span
                  className="font-mono text-xs"
                  aria-label={completed ? "Selesai" : "Belum selesai"}
                >
                  {completed ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-line pt-5 text-sm leading-7 text-muted">
          <strong className="text-ink">Bukan tes hafalan.</strong>{" "}
          Pilih respons yang benar-benar akan kamu lakukan. Feedback muncul
          setelah setiap keputusan.
        </div>
      </aside>

      <ScenarioPanelSection
        scenario={scenario}
        step={step}
        stepIndex={stepIndex}
        selectedChoiceId={selectedChoiceId}
        selectedChoice={selectedChoice}
        result={result}
        practice={practice}
        progressValue={progressValue}
        onChoose={choose}
        onContinue={continueScenario}
        onReset={resetRound}
        onNext={nextScenario}
      />
    </div>
  );
}
