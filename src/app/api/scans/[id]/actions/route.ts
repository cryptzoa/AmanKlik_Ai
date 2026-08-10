import { listActionProgress, setActionProgress } from "@/db/repositories/action-progress-repository";
import { getScanForSession } from "@/db/repositories/scan-repository";
import { publicErrorResponse } from "@/lib/api";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { assertJsonRequest, assertSameOrigin } from "@/lib/request-security";
import { actionProgressSchema, scanIdSchema } from "@/lib/validation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

async function ownedScan(id: string) {
  scanIdSchema.parse(id);
  const sessionId = await getAnonymousSessionId({ create: false });
  if (!sessionId) throw new NotFoundError();
  const scan = await getScanForSession(id, sessionId);
  if (!scan) throw new NotFoundError();
  return { scan, sessionId };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { sessionId } = await ownedScan(id);
    const items = await listActionProgress(id, sessionId);
    return Response.json({ ok: true, data: { items } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const { id } = await params;
    const { scan, sessionId } = await ownedScan(id);
    const body = actionProgressSchema.parse(await request.json());
    if (!scan.resultJson.actionPlan.some((action) => action.id === body.actionId)) {
      throw new ValidationError("Action tidak tersedia untuk hasil ini.");
    }
    const item = await setActionProgress({ scanId: id, sessionId, ...body });
    return Response.json({ ok: true, data: { item } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
