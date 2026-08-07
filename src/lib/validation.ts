import { z } from "zod";

export const textScanRequestSchema = z.object({
  text: z.string().trim().min(8).max(8_000),
});

export const urlScanRequestSchema = z.object({
  url: z.string().trim().min(1).max(2_048),
});

export const scanIdSchema = z.string().uuid();

export const feedbackSchema = z.object({
  verdict: z.enum(["helpful", "not_helpful", "seems_incorrect"]),
  comment: z.string().trim().max(500).optional(),
});

export type TextScanRequest = z.infer<typeof textScanRequestSchema>;
export type UrlScanRequest = z.infer<typeof urlScanRequestSchema>;
