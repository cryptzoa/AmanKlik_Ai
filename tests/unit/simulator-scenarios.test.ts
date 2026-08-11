import { describe, expect, it } from "vitest";

import {
  OFFICIAL_SIMULATOR_SOURCE_HOSTS,
  SIMULATOR_SCENARIOS,
  evaluateScenario,
} from "@/lib/simulator/scenarios";

describe("Indonesian simulator scenarios", () => {
  it("ships eight reviewed scenarios with three decisions each", () => {
    expect(SIMULATOR_SCENARIOS).toHaveLength(8);

    for (const scenario of SIMULATOR_SCENARIOS) {
      expect(scenario.steps).toHaveLength(3);
      expect(scenario.transferableRule.length).toBeGreaterThan(30);
      expect(scenario.sources.length).toBeGreaterThan(0);

      for (const step of scenario.steps) {
        expect(step.choices).toHaveLength(3);
        expect(step.choices.filter((choice) => choice.quality === "safe")).toHaveLength(1);
        expect(new Set(step.choices.map((choice) => choice.id)).size).toBe(step.choices.length);
      }
    }
  });

  it.each(SIMULATOR_SCENARIOS.map((scenario) => [scenario.id] as const))("scores the reviewed safe path for %s at 100", (scenarioId) => {
    const scenario = SIMULATOR_SCENARIOS.find((item) => item.id === scenarioId)!;
    const safeChoices = scenario.steps.map((step) => step.choices.find((choice) => choice.quality === "safe")!.id);
    const evaluation = evaluateScenario(scenario.id, safeChoices);

    expect(evaluation?.score).toBe(100);
    expect(evaluation?.level).toBe("strong");
    expect(evaluation?.safeCount).toBe(scenario.steps.length);
  });

  it("uses graded scoring instead of treating every imperfect choice equally", () => {
    const scenario = SIMULATOR_SCENARIOS.find((item) => item.id === "family-new-number")!;
    const partialChoices = scenario.steps.map((step) => step.choices.find((choice) => choice.quality === "partial")!.id);
    const unsafeChoices = scenario.steps.map((step) => step.choices.find((choice) => choice.quality === "unsafe")!.id);

    const partial = evaluateScenario(scenario.id, partialChoices);
    const unsafe = evaluateScenario(scenario.id, unsafeChoices);
    expect(partial!.score).toBeGreaterThan(unsafe!.score);
    expect(partial!.partialCount).toBe(3);
    expect(unsafe!.unsafeCount).toBe(3);
  });

  it("rejects incomplete, unknown, or mismatched answer sets", () => {
    expect(evaluateScenario("family-new-number", ["call-known-number"])).toBeNull();
    expect(evaluateScenario("family-new-number", ["unknown", "verify-family-channel", "stop-until-confirmed"])).toBeNull();
    expect(evaluateScenario("unknown-scenario", [])).toBeNull();
  });

  it("only links to allowlisted HTTPS sources", () => {
    for (const source of SIMULATOR_SCENARIOS.flatMap((scenario) => scenario.sources)) {
      const url = new URL(source.url);
      expect(url.protocol).toBe("https:");
      expect(OFFICIAL_SIMULATOR_SOURCE_HOSTS.has(url.hostname)).toBe(true);
    }
  });

  it("does not embed live URLs, phone numbers, or account numbers in synthetic messages", () => {
    const messages = SIMULATOR_SCENARIOS.flatMap((scenario) => scenario.steps.map((step) => step.message)).join("\n");
    expect(messages).not.toMatch(/https?:\/\//i);
    expect(messages).not.toMatch(/\b(?:\+62|08)\d{7,}\b/);
    expect(messages).not.toMatch(/\b\d{10,16}\b/);
  });
});
