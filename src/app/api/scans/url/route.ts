import { publicErrorResponse } from "@/lib/api";
import { urlScanRequestSchema } from "@/lib/validation";
import { analyzeSubmittedUrl } from "@/server/scan/analyze-url";
import { analyzeUrl } from "@/server/url/analyzer";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { consumeRateLimit } from "@/server/rate-limit/limiter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = urlScanRequestSchema.parse(await request.json());
    analyzeUrl(body.url);
    const sessionId = await getAnonymousSessionId();
    consumeRateLimit(sessionId);
    const result = await analyzeSubmittedUrl({ url: body.url, sessionId });

    return Response.json(
      { ok: true, data: { scanId: result.result.scanId, result: result.result, degraded: result.degraded } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return publicErrorResponse(error);
  }
}
