import { z } from "zod";

export const textScanRequestSchema = z.object({
  text: z.string().trim().min(8).max(8_000),
});

export const urlScanRequestSchema = z.object({
  url: z.string().trim().min(1).max(2_048),
});

export const conversationMessageSchema = z.object({
  id: z.string().trim().regex(/^m\d+$/).max(8),
  speaker: z.enum(["user", "sender"]),
  text: z.string().trim().min(1).max(4_000),
  order: z.number().int().min(1).max(12),
});

export const conversationScanRequestSchema = z.object({
  messages: z.array(conversationMessageSchema).min(2).max(12),
}).superRefine((value, context) => {
  const total = value.messages.reduce((sum, message) => sum + message.text.length, 0);
  if (total > 16_000) context.addIssue({ code: "custom", path: ["messages"], message: "Conversation terlalu panjang." });
  if (new Set(value.messages.map((message) => message.id)).size !== value.messages.length) context.addIssue({ code: "custom", path: ["messages"], message: "ID pesan harus unik." });
});

export const scanIdSchema = z.string().uuid();

export const feedbackSchema = z.object({
  verdict: z.enum(["helpful", "not_helpful", "seems_incorrect"]),
  comment: z.string().trim().max(500).optional(),
});

export type TextScanRequest = z.infer<typeof textScanRequestSchema>;
export type UrlScanRequest = z.infer<typeof urlScanRequestSchema>;
export type ConversationScanRequest = z.infer<typeof conversationScanRequestSchema>;
