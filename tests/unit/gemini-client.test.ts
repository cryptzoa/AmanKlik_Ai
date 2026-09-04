import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateContent } = vi.hoisted(() => ({
  generateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
  ThinkingLevel: {
    LOW: "LOW",
    MINIMAL: "MINIMAL",
  },
}));

vi.mock("@/lib/env", () => ({
  env: {
    AI_MAX_CONCURRENCY: 2,
    AI_MAX_QUEUE: 8,
    AI_TIMEOUT_MS: 1_000,
    GEMINI_API_KEY: "test-key",
    GEMINI_MODEL: "gemini-3.8-flash",
    GEMINI_RECOVERY_MODEL: "gemini-2.5-flash-lite",
    GEMINI_FALLBACK_MODEL: "gemini-3.5-flash-lite",
  },
}));

import { GeminiAiClient } from "@/server/ai/gemini-client";

const validResponse = JSON.stringify({
  semanticRisk: 42,
  confidence: "medium",
  category: "benign_or_unclear",
  summary: "Pesan perlu diperiksa lewat sumber resmi.",
  claimedBrands: [],
  indicators: [],
  uncertainty: "Yang belum bisa dipastikan: identitas pengirim.",
  recommendedActionTags: ["verify_independently"],
});

const input = {
  normalizedText: "Pesan pengujian yang cukup panjang untuk dianalisis.",
  deterministicSignals: [],
  urlAnalysis: null,
  knowledge: [],
};

describe("Gemini client model strategy", () => {
  beforeEach(() => {
    generateContent.mockReset();
  });

  it("reduces thinking latency for the configured Gemini 3 primary model", async () => {
    generateContent.mockResolvedValue({ text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.8-flash",
      attemptedFallback: false,
    });
    expect(generateContent).toHaveBeenCalledOnce();
    expect(generateContent.mock.calls[0]?.[0]).toMatchObject({
      model: "gemini-3.8-flash",
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: "LOW" },
      },
    });
    expect(generateContent.mock.calls[0]?.[0].config).not.toHaveProperty("temperature");
  });

  it("uses the low-latency recovery model after a primary provider outage", async () => {
    generateContent
      .mockRejectedValueOnce(new Error("503 UNAVAILABLE: high demand"))
      .mockResolvedValueOnce({ text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-2.5-flash-lite",
      attemptedFallback: true,
    });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(generateContent.mock.calls[1]?.[0]).toMatchObject({
      model: "gemini-2.5-flash-lite",
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
  });

  it("continues to the configured fallback when primary and recovery models fail", async () => {
    generateContent
      .mockRejectedValueOnce(new Error("503 UNAVAILABLE: high demand"))
      .mockRejectedValueOnce(new Error("429 RESOURCE_EXHAUSTED"))
      .mockResolvedValueOnce({ text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.5-flash-lite",
      attemptedFallback: true,
    });
    expect(generateContent).toHaveBeenCalledTimes(3);
    expect(generateContent.mock.calls[2]?.[0]).toMatchObject({
      model: "gemini-3.5-flash-lite",
      config: {
        thinkingConfig: { thinkingLevel: "MINIMAL" },
      },
    });
  });
});
