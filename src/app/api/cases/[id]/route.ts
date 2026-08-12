import { addScanToInvestigation, getInvestigationCase } from "@/db/repositories/investigation-repository";
import { publicErrorResponse } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { assertJsonRequest, assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { investigationAddScanSchema, scanIdSchema } from "@/lib/validation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { consumeRateLimit } from "@/server/rate-limit/limiter";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    scanIdSchema.parse(id);
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) throw new NotFoundError();
    const investigation = await getInvestigationCase(id, sessionId);
    if (!investigation) throw new NotFoundError();
    return Response.json({ ok: true, data: { investigation } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const { id } = await params;
    scanIdSchema.parse(id);
    const body = investigationAddScanSchema.parse(await readJsonBody(request));
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) throw new NotFoundError();
    await consumeRateLimit(`case:${sessionId}`, 1, request);
    const investigation = await addScanToInvestigation({ caseId: id, sessionId, scanId: body.scanId });
    return Response.json({ ok: true, data: { investigation } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
