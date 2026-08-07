import { publicErrorResponse } from "@/lib/api";
import { feedbackSchema, scanIdSchema } from "@/lib/validation";
import { getScanForSession } from "@/db/repositories/scan-repository";
import { createFeedback } from "@/db/repositories/feedback-repository";
import { NotFoundError } from "@/lib/errors";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    scanIdSchema.parse(id);
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId || !(await getScanForSession(id, sessionId))) throw new NotFoundError();
    const body = feedbackSchema.parse(await request.json());

    const feedback = await createFeedback({
      scanId: id,
      sessionId,
      verdict: body.verdict,
      comment: body.comment,
    });

    return Response.json({ ok: true, data: { feedbackId: feedback.id } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
