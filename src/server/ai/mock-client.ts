import type { AiAnalysis, AiClient, AnalyzeConversationInput, AnalyzeImageInput, AnalyzeTextInput, ConversationAiAnalysis } from "@/server/ai/client";
import type { AiSemanticResult } from "@/server/ai/schemas";

function resultForText(text: string): AiSemanticResult {
  const normalized = text.toLocaleLowerCase("id-ID");
  const otp = /\b(?:otp|kode\s+(?:verifikasi|keamanan))\b/.test(normalized);
  const transfer = /\b(?:transfer|rekening|kirim\s+(?:uang|dana))\b/.test(normalized);
  const newNumber = /\bnomor\s+baru\b/.test(normalized);
  const benign = !otp && !transfer && !newNumber && !/\b(?:pin|password|anydesk|teamviewer)\b/.test(normalized);

  if (benign) {
    return {
      semanticRisk: 8,
      confidence: "high",
      category: "benign_or_unclear",
      summary: "Tidak terlihat permintaan sensitif yang jelas dari konteks yang diberikan.",
      claimedBrands: [],
      indicators: [],
      uncertainty: "Penilaian tetap bukan jaminan bahwa pesan selalu aman.",
      recommendedActionTags: ["verify_independently"],
    };
  }

  const indicators: AiSemanticResult["indicators"] = [];
  if (otp) {
    indicators.push({
      category: "otp_request",
      label: "Permintaan kode rahasia",
      technique: "credential harvesting",
      severity: "high",
      evidence: "kode OTP",
      explanation: "Pesan mengarahkan pengguna untuk memberikan kode yang seharusnya bersifat rahasia.",
    });
  }
  if (transfer) {
    indicators.push({
      category: "payment_request",
      label: "Permintaan uang",
      technique: "payment pressure",
      severity: "high",
      evidence: "transfer",
      explanation: "Pesan mengaitkan tindakan segera dengan pengiriman uang atau rekening.",
    });
  }
  if (newNumber) {
    indicators.push({
      category: "impersonation",
      label: "Perubahan identitas",
      technique: "identity switch",
      severity: "medium",
      evidence: "nomor baru",
      explanation: "Perubahan nomor mendadak dapat dipakai untuk menyamarkan identitas pengirim.",
    });
  }

  return {
    semanticRisk: Math.min(100, 58 + indicators.length * 9),
    confidence: "high",
    category: otp ? "otp_theft" : transfer ? "payment_request" : "impersonation",
    summary: "Konteks memuat pola sosial yang perlu diverifikasi secara independen.",
    claimedBrands: [],
    indicators,
    uncertainty: "Analisis mock hanya digunakan untuk pengujian lokal dan bukan hasil Gemini live.",
    recommendedActionTags: [
      ...(otp ? ["do_not_share_otp" as const] : []),
      ...(transfer ? ["contact_provider" as const] : []),
      "verify_independently",
    ],
  };
}

export class MockAiClient implements AiClient {
  async analyzeText(input: AnalyzeTextInput): Promise<AiAnalysis> {
    return {
      result: resultForText(input.normalizedText),
      meta: {
        provider: "mock",
        modelId: "mock-fixture-v1",
        latencyMs: 1,
        attemptedFallback: false,
      },
    };
  }

  async analyzeImage(input: AnalyzeImageInput): Promise<AiAnalysis> {
    void input;
    return {
      result: {
        semanticRisk: 62,
        confidence: "low",
        category: "social_engineering",
        summary: "Screenshot sintetis memerlukan pemeriksaan konteks dan verifikasi independen.",
        claimedBrands: [],
        indicators: [
          {
            category: "other",
            label: "Konteks visual perlu diperiksa",
            technique: "multimodal review",
            severity: "medium",
            evidence: "Screenshot sintetis",
            explanation: "Hasil gambar lokal ini adalah fixture untuk pengujian alur multimodal.",
          },
        ],
        uncertainty: "Mode mock tidak membaca gambar secara semantik.",
        recommendedActionTags: ["verify_independently"],
      },
      meta: {
        provider: "mock",
        modelId: "mock-fixture-v1",
        latencyMs: 1,
        attemptedFallback: false,
      },
    };
  }

  async analyzeConversation(input: AnalyzeConversationInput): Promise<ConversationAiAnalysis> {
    const text = input.messages.map((message) => message.text).join(" ");
    const base = resultForText(text);
    return {
      result: {
        semanticRisk: base.semanticRisk,
        confidence: base.confidence,
        summary: base.summary,
        indicators: base.indicators.map((indicator) => ({ ...indicator, messageIds: [input.messages[0]?.id ?? "m1"] })),
        progressionSummary: input.progressionSummary,
        uncertainty: "Analisis mock hanya digunakan untuk pengujian lokal dan bukan hasil Gemini live.",
        recommendedActionTags: base.recommendedActionTags,
      },
      meta: { provider: "mock", modelId: "mock-fixture-v1", latencyMs: 1, attemptedFallback: false },
    };
  }
}
