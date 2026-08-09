import { publicErrorResponse } from "@/lib/api";
import { scanIdSchema } from "@/lib/validation";
import { getScanForSession } from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { getPersonalizedPractice } from "@/lib/simulator/personalized";
import { NotFoundError } from "@/lib/errors";
import { assertSameOrigin } from "@/lib/request-security";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const { id } = await params;
    scanIdSchema.parse(id);
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) throw new NotFoundError();
    const scan = await getScanForSession(id, sessionId);
    if (!scan) throw new NotFoundError();

    const practice = getPersonalizedPractice(scan.resultJson);
    return Response.json({ ok: true, data: { practice } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
