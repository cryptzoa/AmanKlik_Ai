import { z } from "zod";

import { DomainError } from "@/lib/errors";
import { reportServerError } from "@/server/observability/report-error";

const PUBLIC_MESSAGES: Record<string, string> = {
  INVALID_INPUT: "Data yang dikirim belum valid.",
  FILE_TOO_LARGE: "Ukuran gambar terlalu besar. Maksimum 5 MB.",
  UNSUPPORTED_FILE: "Format gambar tidak didukung. Gunakan PNG, JPG, atau WEBP.",
  INVALID_IMAGE: "Gambar tidak dapat dibaca. Coba file lain.",
  RATE_LIMITED: "Terlalu banyak pemeriksaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.",
  AI_IMAGE_ANALYSIS_UNAVAILABLE: "Analisis gambar dengan AI sedang tidak tersedia. Coba lagi atau tempel isi pesannya sebagai teks.",
  PROVIDER_UNAVAILABLE: "Analisis AI sedang terbatas. Coba lagi sebentar.",
  NOT_FOUND: "Hasil tidak ditemukan atau tidak tersedia untuk sesi ini.",
  INTERNAL_ERROR: "Hasil belum dapat disimpan. Silakan coba lagi.",
  FORBIDDEN: "Permintaan lintas situs tidak diizinkan.",
  UNAUTHORIZED: "Token integrasi tidak valid atau sudah dicabut.",
  UNSUPPORTED_MEDIA_TYPE: "Format permintaan tidak didukung.",
  PAYLOAD_TOO_LARGE: "Ukuran data yang dikirim terlalu besar.",
  LENGTH_REQUIRED: "Ukuran unggahan tidak dapat diverifikasi.",
};

const STATUS_BY_CODE: Record<string, number> = {
  INVALID_INPUT: 400,
  LENGTH_REQUIRED: 411,
  FILE_TOO_LARGE: 413,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_FILE: 415,
  UNSUPPORTED_MEDIA_TYPE: 415,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  AI_IMAGE_ANALYSIS_UNAVAILABLE: 503,
  PROVIDER_UNAVAILABLE: 503,
  INTERNAL_ERROR: 503,
};

export function publicErrorResponse(error: unknown) {
  const domainError = error instanceof DomainError ? error : null;
  const code = domainError?.code ?? (error instanceof z.ZodError || error instanceof SyntaxError ? "INVALID_INPUT" : "INTERNAL_ERROR");
  const retryable = domainError?.retryable ?? code === "INTERNAL_ERROR";
  const status = STATUS_BY_CODE[code] ?? 400;
  if (status >= 500) reportServerError("api.request", error);

  return Response.json(
    {
      ok: false,
      error: {
        code,
        message: PUBLIC_MESSAGES[code] ?? PUBLIC_MESSAGES.INTERNAL_ERROR,
        retryable,
      },
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
