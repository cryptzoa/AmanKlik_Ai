import { beforeEach, describe, expect, it, vi } from "vitest";

const { createInteraction } = vi.hoisted(() => ({
  createInteraction: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    interactions = { create: createInteraction };
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
  });

  it("uses the responsive primary model through the Interactions API", async () => {
    createInteraction.mockResolvedValue({ output_text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.8-flash",
      attemptedFallback: false,
    });
    expect(createInteraction).toHaveBeenCalledOnce();
    expect(createInteraction.mock.calls[0]?.[0]).toMatchObject({
      model: "gemini-3.8-flash",
      store: false,
      system_instruction: expect.any(String),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: expect.any(Object),
      },
      generation_config: {
        max_output_tokens: 4_096,
        thinking_level: "low",
      },
    });
    expect(createInteraction.mock.calls[0]?.[1]).toEqual({
      timeout: 1_000,
      maxRetries: 0,
    });
  });

  it("uses the fallback model after a primary provider outage", async () => {
    createInteraction
      .mockRejectedValueOnce(new Error("503 UNAVAILABLE: high demand"))
      .mockResolvedValueOnce({ output_text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.5-flash-lite",
      attemptedFallback: true,
    });
    expect(createInteraction).toHaveBeenCalledTimes(2);
    expect(createInteraction.mock.calls[1]?.[0]).toMatchObject({
      model: "gemini-3.5-flash-lite",
      generation_config: {
        thinking_level: "minimal",
      },
    });
  });

  it("retries without a JSON schema when the provider rejects the schema", async () => {
    createInteraction
      .mockRejectedValueOnce(new Error("400 INVALID_ARGUMENT: invalid schema"))
      .mockResolvedValueOnce({ output_text: validResponse });

    const analysis = await new GeminiAiClient().analyzeText(input);

    expect(analysis.meta).toMatchObject({
      modelId: "gemini-3.8-flash",
      attemptedFallback: false,
    });
    expect(createInteraction).toHaveBeenCalledTimes(2);
    expect(createInteraction.mock.calls[1]?.[0]).toMatchObject({
      model: "gemini-3.8-flash",
      response_format: {
        type: "text",
        mime_type: "application/json",
      },
    });
    expect(createInteraction.mock.calls[1]?.[0].response_format).not.toHaveProperty("schema");
  });

  it("sends image bytes as multimodal Interactions input", async () => {
    createInteraction.mockResolvedValue({ output_text: validResponse });

    await new GeminiAiClient().analyzeImage({
      bytes: Uint8Array.from([1, 2, 3]),
      mimeType: "image/png",
    });

    expect(createInteraction.mock.calls[0]?.[0].input).toEqual([
      { type: "text", text: expect.any(String) },
      { type: "image", data: "AQID", mime_type: "image/png" },
    ]);
  });
});
