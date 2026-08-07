"use client";

import { useState } from "react";

import { SIMULATOR_SCENARIOS, evaluateScenario } from "@/lib/simulator/scenarios";

export function SimulatorClient() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof evaluateScenario>>(null);
  const scenario = SIMULATOR_SCENARIOS[scenarioIndex];
  const step = scenario.steps[stepIndex];

  function choose(choiceId: string) {
    const nextChoiceIds = [...choiceIds, choiceId];
    setChoiceIds(nextChoiceIds);
    if (stepIndex === scenario.steps.length - 1) {
      setResult(evaluateScenario(scenario.id, nextChoiceIds));
    } else {
      setStepIndex((current) => current + 1);
    }
  }

  function changeScenario(index: number) {
    setScenarioIndex(index);
    setStepIndex(0);
    setChoiceIds([]);
    setResult(null);
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
      <aside className="border-t border-line pt-5">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Pilih skenario</p>
        <div className="mt-4 space-y-2">
          {SIMULATOR_SCENARIOS.map((item, index) => (
            <button key={item.id} type="button" className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition ${index === scenarioIndex ? "bg-ink text-surface" : "bg-surface text-muted hover:text-ink"}`} onClick={() => changeScenario(index)}>
              {item.title}
            </button>
          ))}
        </div>
      </aside>
      <section className="rounded-[24px] border border-line bg-surface p-5 sm:p-8">
        <div className="flex items-start justify-between gap-5 border-b border-line pb-6">
          <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Skenario sintetis</p><h2 className="mt-3 text-2xl font-semibold">{scenario.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{scenario.description}</p></div>
          <span className="font-mono text-xs text-muted">{result ? "Selesai" : `${stepIndex + 1} / ${scenario.steps.length}`}</span>
        </div>

        {result ? (
          <div className="py-10">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-safe">Selesai</p>
            <div className="mt-4 text-6xl font-semibold tracking-[-0.07em]">{result.score}</div>
            <p className="mt-2 text-muted">{result.correctCount} dari {result.totalSteps} pilihan membantu memindahkan verifikasi ke kanal independen.</p>
            <div className="mt-8 space-y-3">{result.feedback.map((item, index) => <p key={`${index}-${item}`} className="border-t border-line pt-3 text-sm leading-6 text-muted">{item}</p>)}</div>
            <button type="button" className="mt-8 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-surface" onClick={() => changeScenario(scenarioIndex)}>Ulangi skenario</button>
          </div>
        ) : (
          <div className="py-8">
            <p className="rounded-2xl bg-canvas p-5 text-lg leading-8">“{step.message}”</p>
            <div className="mt-6 grid gap-3">{step.choices.map((choice) => <button key={choice.id} type="button" className="min-h-12 rounded-xl border border-line px-4 py-3 text-left text-sm font-semibold transition hover:border-ai hover:bg-ai-soft" onClick={() => choose(choice.id)}>{choice.label}</button>)}</div>
          </div>
        )}
      </section>
    </div>
  );
}
