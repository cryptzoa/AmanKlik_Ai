import { publicErrorResponse } from "@/lib/api";
import { textScanRequestSchema } from "@/lib/validation";
import { analyzeText } from "@/server/scan/analyze-text";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { consumeRateLimit } from "@/server/rate-limit/limiter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = textScanRequestSchema.parse(await request.json());
    const sessionId = await getAnonymousSessionId();
    consumeRateLimit(sessionId);
    const result = await analyzeText({ text: body.text, sessionId });

    return Response.json(
      { ok: true, data: { scanId: result.result.scanId, result: result.result, degraded: result.degraded } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return publicErrorResponse(error);
  }
}
