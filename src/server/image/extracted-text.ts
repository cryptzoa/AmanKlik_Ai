import type { AnalysisResult } from "@/types/analysis";
import { normalizeText } from "@/server/risk/signals";

const NON_MESSAGE_TEXT = [
  /\bkontak\s+sintetis\s*[·.]\s*fixture\s+demo\b/giu,
  /\baman\s*klik\s*[·.]\s*demo\b/giu,
  /\bsemua\s+nama\s+dan\s+isi\s+pesan\s+bersifat\s+fiktif\.?/giu,
  /\btulis\s+balasan(?:…|\.\.\.)?/giu,
];

export function sanitizeExtractedImageText(input: string): string {
  const withoutUiText = NON_MESSAGE_TEXT.reduce((text, pattern) => text.replace(pattern, " "), input);
  return normalizeText(withoutUiText);
}

export function sanitizeStoredImageResult(result: AnalysisResult): AnalysisResult {
  if (result.inputType !== "image") return result;

  return {
    ...result,
    previewRedacted: result.previewRedacted ? sanitizeExtractedImageText(result.previewRedacted) || null : null,
    indicators: result.indicators.map((indicator) => ({
      ...indicator,
      evidence: indicator.evidence ? sanitizeExtractedImageText(indicator.evidence) || undefined : undefined,
    })),
  };
}
