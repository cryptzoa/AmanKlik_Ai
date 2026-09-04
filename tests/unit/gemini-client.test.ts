import { beforeEach, describe, expect, it, vi } from "vitest";

const { createInteraction, generateContent } = vi.hoisted(() => ({
  createInteraction: vi.fn(),
  generateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    interactions = { create: createInteraction };
    models = { generateContent };
  },
  ThinkingLevel: {
    LOW: "LOW",
  },
}));

vi.mock("@/lib/env", () => ({
  env: {
    AI_MAX_CONCURRENCY: 2,
    AI_MAX_QUEUE: 8,
    AI_TIMEOUT_MS: 1_000,
    GEMINI_API_KEY: "test-key",
    GEMINI_MODEL: "gemini-3.8-flash",
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
    createInteraction.mockReset();
    generateContent.mockReset();
  });

  it("uses the responsive primary model through Generate Content", async () => {
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
        responseJsonSchema: expect.any(Object),
        thinkingConfig: { thinkingLevel: "LOW" },
        maxOutputTokens: 4_096,
      },
    });
    expect(createInteraction).not.toHaveBeenCalled();
  });

  it("uses the fallback model after a primary provider outage", async () => {
    generateContent.mockRejectedValueOnce(new Error("503 UNAVAILABLE: high demand"));
    createInteraction.mockResolvedValueOnce({ output_text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.5-flash-lite",
      attemptedFallback: true,
    });
    expect(generateContent).toHaveBeenCalledOnce();
    expect(createInteraction).toHaveBeenCalledOnce();
    expect(createInteraction.mock.calls[0]?.[0]).toMatchObject({
      model: "gemini-3.5-flash-lite",
      store: false,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: expect.any(Object),
      },
      generation_config: {
        thinking_level: "minimal",
      },
    });
    expect(createInteraction.mock.calls[0]?.[1]).toEqual({
      timeout: 1_000,
      maxRetries: 0,
    });
  });

  it("retries without a JSON schema when the provider rejects the schema", async () => {
    generateContent
      .mockRejectedValueOnce(new Error("400 INVALID_ARGUMENT: invalid schema"))
      .mockResolvedValueOnce({ text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.8-flash",
      attemptedFallback: false,
    });
    expect(generateContent).toHaveBeenCalledTimes(2);
    expect(generateContent.mock.calls[1]?.[0]).toMatchObject({
      model: "gemini-3.8-flash",
      config: {
        responseMimeType: "application/json",
      },
    });
    expect(generateContent.mock.calls[1]?.[0].config).not.toHaveProperty("responseJsonSchema");
  });

  it("sends image bytes as multimodal Generate Content input", async () => {
    generateContent.mockResolvedValue({ text: validResponse });

    await new GeminiAiClient().analyzeImage({
      bytes: Uint8Array.from([1, 2, 3]),
      mimeType: "image/png",
    });

    expect(generateContent.mock.calls[0]?.[0].contents).toEqual([{
      role: "user",
      parts: [
        { text: expect.any(String) },
        { inlineData: { data: "AQID", mimeType: "image/png" } },
      ],
    }]);
  });
});
