import { z } from "zod";

export const AiSemanticResultSchema = z.object({
  semanticRisk: z.number().int().min(0).max(100),
  confidence: z.enum(["low", "medium", "high"]),
  category: z.enum([
    "impersonation",
    "credential_theft",
    "otp_theft",
    "payment_request",
    "fake_prize",
    "investment",
    "delivery",
    "account_takeover",
    "social_engineering",
    "benign_or_unclear",
    "unknown",
  ]),
  summary: z.string().min(1).max(500),
  extractedText: z.string().max(10_000).optional(),
  claimedBrands: z.array(z.string().trim().min(1).max(80)).max(10),
  indicators: z
    .array(
      z.object({
        category: z.enum([
          "urgency",
          "credential_request",
          "otp_request",
          "payment_request",
          "impersonation",
          "threat",
          "prize",
          "investment",
          "remote_access",
          "brand_domain_mismatch",
          "url_obfuscation",
          "secrecy",
          "verification_link",
          "other",
        ]),
        label: z.string().trim().min(1).max(120),
        technique: z.string().trim().min(1).max(120),
        severity: z.enum(["low", "medium", "high"]),
        evidence: z.string().max(280),
        explanation: z.string().trim().min(1).max(500),
      }),
    )
    .max(12),
  uncertainty: z.string().trim().min(1).max(500),
  recommendedActionTags: z
    .array(
      z.enum([
        "do_not_click",
        "do_not_share_credentials",
        "do_not_share_otp",
        "verify_independently",
        "contact_provider",
        "secure_account",
        "preserve_evidence",
        "report_officially",
      ]),
    )
    .max(8),
});

export type AiSemanticResult = z.infer<typeof AiSemanticResultSchema>;

export const AiSemanticJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "semanticRisk",
    "confidence",
    "category",
    "summary",
    "claimedBrands",
    "indicators",
    "uncertainty",
    "recommendedActionTags",
  ],
  properties: {
    semanticRisk: { type: "integer", minimum: 0, maximum: 100 },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    category: {
      type: "string",
      enum: [
        "impersonation",
        "credential_theft",
        "otp_theft",
        "payment_request",
        "fake_prize",
        "investment",
        "delivery",
        "account_takeover",
        "social_engineering",
        "benign_or_unclear",
        "unknown",
      ],
    },
    summary: { type: "string", minLength: 1, maxLength: 500 },
    extractedText: { type: "string", maxLength: 10_000 },
    claimedBrands: { type: "array", maxItems: 10, items: { type: "string", minLength: 1, maxLength: 80 } },
    indicators: {
      type: "array",
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "label", "technique", "severity", "evidence", "explanation"],
        properties: {
          category: {
            type: "string",
            enum: [
              "urgency",
              "credential_request",
              "otp_request",
              "payment_request",
              "impersonation",
              "threat",
              "prize",
              "investment",
              "remote_access",
              "brand_domain_mismatch",
              "url_obfuscation",
              "secrecy",
              "verification_link",
              "other",
            ],
          },
          label: { type: "string", minLength: 1, maxLength: 120 },
          technique: { type: "string", minLength: 1, maxLength: 120 },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          evidence: { type: "string", maxLength: 280 },
          explanation: { type: "string", minLength: 1, maxLength: 500 },
        },
      },
    },
    uncertainty: { type: "string", minLength: 1, maxLength: 500 },
    recommendedActionTags: {
      type: "array",
      maxItems: 8,
      items: {
        type: "string",
        enum: [
          "do_not_click",
          "do_not_share_credentials",
          "do_not_share_otp",
          "verify_independently",
          "contact_provider",
          "secure_account",
          "preserve_evidence",
          "report_officially",
        ],
      },
    },
  },
} as const;
