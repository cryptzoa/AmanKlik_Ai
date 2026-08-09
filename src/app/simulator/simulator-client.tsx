"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { SIMULATOR_SCENARIOS, evaluateScenario } from "@/lib/simulator/scenarios";
import type { PersonalizedPractice } from "@/lib/simulator/personalized";

gsap.registerPlugin(useGSAP);

export function SimulatorClient() {
  const root = useRef<HTMLDivElement>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof evaluateScenario>>(null);
  const [practice, setPractice] = useState<PersonalizedPractice | null>(null);
  const scenario = practice?.scenario ?? SIMULATOR_SCENARIOS[scenarioIndex];
  const step = scenario.steps[stepIndex];

  useEffect(() => {
    const sourceScanId = new URLSearchParams(window.location.search).get("from");
    if (!sourceScanId) return;
    let active = true;
    void fetch(`/api/scans/${encodeURIComponent(sourceScanId)}/practice`)
      .then((response) => response.ok ? response.json() : null)
      .then((body: { ok?: boolean; data?: { practice: PersonalizedPractice } } | null) => {
        if (active && body?.ok && body.data?.practice) setPractice(body.data.practice);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-simulator-panel]", { autoAlpha: 0, y: 24, duration: 0.4, ease: "power3.out" });
    gsap.from("[data-simulator-choice]", { autoAlpha: 0, x: 22, stagger: 0.07, duration: 0.35, ease: "power2.out" });
  }, { scope: root, dependencies: [scenarioIndex, stepIndex, Boolean(result)], revertOnUpdate: true });

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
    setPractice(null);
    setScenarioIndex(index);
    setStepIndex(0);
    setChoiceIds([]);
    setResult(null);
  }

  return (
    <div ref={root} className="mt-12 grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Pilih skenario</p>
        <div className="mt-4 space-y-2">
          {SIMULATOR_SCENARIOS.map((item, index) => (
            <button key={item.id} type="button" className={`lift-link grid w-full grid-cols-[36px_1fr] items-center border px-4 py-4 text-left text-sm ${index === scenarioIndex ? "border-ink bg-ink text-surface" : "border-transparent bg-surface text-muted hover:border-line hover:text-ink"}`} onClick={() => changeScenario(index)}>
              <span className="font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span><span className="font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
      </aside>
      <section data-simulator-panel className="motion-surface p-5 sm:p-8">
        {practice ? <div className="mb-6 border-l-4 border-ai bg-ai-soft p-4 text-sm leading-6"><strong>{practice.title}</strong><p className="mt-1 text-muted">{practice.learningObjective}</p></div> : null}
        <div className="flex items-start justify-between gap-5 border-b border-line pb-6">
          <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Skenario sintetis</p><h2 className="mt-3 text-2xl font-semibold">{scenario.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{scenario.description}</p></div>
          <span className="shrink-0 border border-line px-3 py-2 font-mono text-xs text-muted">{result ? "Selesai" : `${stepIndex + 1} / ${scenario.steps.length}`}</span>
        </div>

        <div className="relative z-10 mt-5 h-1 overflow-hidden bg-canvas" aria-hidden="true">
          <span className="block h-full origin-left bg-ai transition-transform duration-500" style={{ transform: `scaleX(${result ? 1 : (stepIndex + 1) / scenario.steps.length})` }} />
        </div>

        {result ? (
          <div className="relative z-10 py-10">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-safe">Selesai</p>
            <div className="mt-4 text-8xl font-semibold leading-none tracking-[-0.08em] text-safe">{result.score}</div>
            <p className="mt-2 text-muted">{result.correctCount} dari {result.totalSteps} pilihan membantu memindahkan verifikasi ke kanal independen.</p>
            <div className="mt-8 space-y-3">{result.feedback.map((item, index) => <p key={`${index}-${item}`} className="border-t border-line pt-3 text-sm leading-6 text-muted">{item}</p>)}</div>
            <button type="button" className="lift-link mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface hover:bg-ai" onClick={() => changeScenario(scenarioIndex)}>Ulangi skenario</button>
          </div>
        ) : (
          <div className="relative z-10 py-8">
            <p className="border-l-4 border-risk bg-canvas p-6 text-xl leading-8 tracking-[-0.02em] sm:text-2xl">“{step.message}”</p>
            <div className="mt-6 grid gap-3">{step.choices.map((choice, index) => <button data-simulator-choice key={choice.id} type="button" className="lift-link group grid min-h-14 grid-cols-[38px_1fr_auto] items-center border border-line bg-surface px-4 py-4 text-left text-sm font-semibold hover:border-ai hover:bg-ai-soft" onClick={() => choose(choice.id)}><span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span><span>{choice.label}</span><span className="text-ai transition-transform group-hover:translate-x-1">→</span></button>)}</div>
          </div>
        )}
      </section>
    </div>
  );
}
