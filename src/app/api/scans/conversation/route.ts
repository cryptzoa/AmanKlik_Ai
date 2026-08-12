import { publicErrorResponse } from "@/lib/api";
import { conversationScanRequestSchema } from "@/lib/validation";
import { analyzeConversation } from "@/server/scan/analyze-conversation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { consumeRateLimit } from "@/server/rate-limit/limiter";
import { assertJsonRequest, assertSameOrigin, readJsonBody } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const body = conversationScanRequestSchema.parse(await readJsonBody(request));
    const sessionId = await getAnonymousSessionId();
    await consumeRateLimit(sessionId, 2, request);
    const result = await analyzeConversation({ messages: body.messages, sessionId });
    return Response.json({ ok: true, data: { scanId: result.result.scanId, result: result.result, degraded: result.degraded } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
