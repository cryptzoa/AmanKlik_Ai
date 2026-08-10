import { getScanOutcome, upsertScanOutcome } from "@/db/repositories/outcome-repository";
import { getScanForSession } from "@/db/repositories/scan-repository";
import { publicErrorResponse } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { assertJsonRequest, assertSameOrigin } from "@/lib/request-security";
import { outcomeSchema, scanIdSchema } from "@/lib/validation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

async function context(id: string) {
  scanIdSchema.parse(id);
  const sessionId = await getAnonymousSessionId({ create: false });
  if (!sessionId || !(await getScanForSession(id, sessionId))) throw new NotFoundError();
  return sessionId;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sessionId = await context(id);
    const outcome = await getScanOutcome(id, sessionId);
    return Response.json({ ok: true, data: { outcome } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const { id } = await params;
    const sessionId = await context(id);
    const body = outcomeSchema.parse(await request.json());
    const outcome = await upsertScanOutcome({ scanId: id, sessionId, ...body });
    return Response.json({ ok: true, data: { outcome: { verdict: outcome?.verdict, impact: outcome?.impact, updatedAt: outcome?.updatedAt.toISOString() } } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
