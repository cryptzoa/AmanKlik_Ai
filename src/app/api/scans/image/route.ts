import { publicErrorResponse } from "@/lib/api";
import { ValidationError } from "@/lib/errors";
import { env } from "@/lib/env";
import { analyzeImage } from "@/server/scan/analyze-image";
import type { UploadFile } from "@/server/image/preprocess";
import { consumeRateLimit } from "@/server/rate-limit/limiter";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { assertMultipartBodySize, assertSameOrigin } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let stage = "request-security";

  try {
    assertSameOrigin(request);
    stage = "content-type";
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.startsWith("multipart/form-data")) {
      throw new ValidationError("Pilih screenshot terlebih dahulu.");
    }

    assertMultipartBodySize(request, env.MAX_UPLOAD_BYTES + 256_000);

    stage = "session";
    const sessionId = await getAnonymousSessionId();
    stage = "rate-limit";
    await consumeRateLimit(sessionId, 2, request);

    stage = "form-data";
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file) || !("size" in file)) {
      return publicErrorResponse(new ValidationError("Pilih screenshot terlebih dahulu."));
    }

    stage = "analysis";
    const result = await analyzeImage({ file: file as UploadFile, sessionId });
    return Response.json(
      { ok: true, data: { scanId: result.result.scanId, result: result.result, degraded: result.degraded } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return publicErrorResponse(error, `api.scan.image.${stage}`);
  }
}
