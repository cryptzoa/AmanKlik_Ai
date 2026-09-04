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

  it("uses the low-latency classification model without thinking by default", async () => {
    generateContent.mockResolvedValue({ text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-2.5-flash-lite",
      attemptedFallback: false,
    });
    expect(generateContent).toHaveBeenCalledOnce();
    expect(generateContent.mock.calls[0]?.[0]).toMatchObject({
      model: "gemini-2.5-flash-lite",
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    expect(generateContent.mock.calls[0]?.[0].config).not.toHaveProperty("temperature");
  });

  it("falls back to Flash-Lite with minimal thinking after a provider outage", async () => {
    generateContent
      .mockRejectedValueOnce(new Error("503 UNAVAILABLE: high demand"))
      .mockResolvedValueOnce({ text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.5-flash-lite",
      attemptedFallback: true,
    });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(generateContent.mock.calls[1]?.[0]).toMatchObject({
      model: "gemini-3.5-flash-lite",
      config: {
        thinkingConfig: { thinkingLevel: "MINIMAL" },
      },
    });
  });
});
