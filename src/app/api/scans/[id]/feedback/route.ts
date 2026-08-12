import { publicErrorResponse } from "@/lib/api";
import { feedbackSchema, scanIdSchema } from "@/lib/validation";
import { getScanForSession } from "@/db/repositories/scan-repository";
import { createFeedback } from "@/db/repositories/feedback-repository";
import { NotFoundError } from "@/lib/errors";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { assertJsonRequest, assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { consumeRateLimit } from "@/server/rate-limit/limiter";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const { id } = await params;
    scanIdSchema.parse(id);
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) throw new NotFoundError();
    const scan = await getScanForSession(id, sessionId);
    if (!scan) throw new NotFoundError();
    await consumeRateLimit(`feedback:${sessionId}`, 1, request);
    const body = feedbackSchema.parse(await readJsonBody(request));

    const feedback = await createFeedback({
      scanId: scan.id,
      sessionId,
      verdict: body.verdict,
      comment: body.comment,
    });

    return Response.json({ ok: true, data: { feedbackId: feedback.id } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
