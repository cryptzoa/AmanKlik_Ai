import { readFile } from "node:fs/promises";
import path from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_TEXT_FIXTURES, DEMO_URL_FIXTURES } from "@/lib/demo/scan-fixtures";

const repositoryMocks = vi.hoisted(() => ({
  createScan: vi.fn(),
  findCacheByHash: vi.fn(),
  upsertCache: vi.fn(),
}));

vi.mock("@/db/repositories/scan-repository", () => repositoryMocks);

import { analyzeImage } from "@/server/scan/analyze-image";
import { analyzeText } from "@/server/scan/analyze-text";
import { analyzeSubmittedUrl } from "@/server/scan/analyze-url";
import { analyzeConversation } from "@/server/scan/analyze-conversation";

const sessionId = "38ddd831-6835-4621-84d4-8df06a00c3a4";

describe("mock scan pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repositoryMocks.createScan.mockResolvedValue({ id: "scan-id" });
    repositoryMocks.findCacheByHash.mockResolvedValue(null);
    repositoryMocks.upsertCache.mockResolvedValue(undefined);
  });

  it("runs the compound OTP fixture through rules, AI mock, RAG, and persistence", async () => {
    const fixture = DEMO_TEXT_FIXTURES.find((item) => item.id === "T2");
    const output = await analyzeText({ text: fixture?.text ?? "", sessionId });

    expect(output.result.riskLevel).toBe("VERY_HIGH");
    expect(output.result.analysisMode).toBe("hybrid");
    expect(output.result.actionPlan.some((action) => action.sourceUrl?.includes("ojk.go.id"))).toBe(true);
    expect(repositoryMocks.createScan).toHaveBeenCalledOnce();
  });

  it("runs a reserved URL without any network-fetch dependency", async () => {
    const fixture = DEMO_URL_FIXTURES.find((item) => item.id === "U1");
    const output = await analyzeSubmittedUrl({ url: fixture?.url ?? "", sessionId });

    expect(output.result.inputType).toBe("url");
    expect(output.result.urlAnalysis?.domain).toBe("example.net");
    expect(output.result.actionPlan.find((action) => action.id === "do_not_click")?.sourceUrl).toContain("ojk.go.id");
  });

  it("runs a generated screenshot through magic-byte validation and the mock image path", async () => {
    const bytes = await readFile(path.join(process.cwd(), "public/demo/otp-verification.png"));
    const output = await analyzeImage({
      sessionId,
      file: {
        size: bytes.byteLength,
        arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      },
    });

    expect(output.result.inputType).toBe("image");
    expect(output.result.aiAvailable).toBe(true);
    expect(repositoryMocks.createScan).toHaveBeenCalledOnce();
  });

  it("materializes a cache hit with a fresh scan ID without calling the provider path", async () => {
    const fixture = DEMO_TEXT_FIXTURES.find((item) => item.id === "T1");
    const initial = await analyzeText({ text: fixture?.text ?? "", sessionId });
    repositoryMocks.findCacheByHash.mockResolvedValue({
      inputType: "text",
      analysisMode: "hybrid",
      modelId: initial.result.modelId,
      resultJson: initial.result,
    });
    repositoryMocks.createScan.mockClear();
    repositoryMocks.upsertCache.mockClear();

    const cached = await analyzeText({ text: fixture?.text ?? "", sessionId });

    expect(cached.result.scanId).not.toBe(initial.result.scanId);
    expect(cached.result.analysisMode).toBe("cached_hybrid");
    expect(cached.result.cacheHit).toBe(true);
    expect(repositoryMocks.createScan).toHaveBeenCalledOnce();
    expect(repositoryMocks.upsertCache).not.toHaveBeenCalled();
  });

  it("analyzes conversation progression with mock AI and persists only the result contract", async () => {
    const output = await analyzeConversation({
      sessionId,
      messages: [
        { id: "m1", speaker: "sender", text: "Ini nomor baru aku, nomor lama rusak.", order: 1 },
        { id: "m2", speaker: "sender", text: "Tolong transfer sekarang dan jangan telepon dulu.", order: 2 },
      ],
    });

    expect(output.result.inputType).toBe("conversation");
    expect(output.result.conversationAnalysis?.messageCount).toBe(2);
    expect(output.result.conversationAnalysis?.progressionSummary).toContain("eskalasi");
    expect(output.result.previewRedacted).toBeNull();
    expect(repositoryMocks.createScan).toHaveBeenCalledOnce();
  });
});
