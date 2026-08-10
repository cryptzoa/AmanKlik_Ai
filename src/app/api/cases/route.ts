import { listInvestigationCases, createInvestigationCase } from "@/db/repositories/investigation-repository";
import { publicErrorResponse } from "@/lib/api";
import { assertJsonRequest, assertSameOrigin } from "@/lib/request-security";
import { investigationCaseSchema } from "@/lib/validation";
import { consumeRateLimit } from "@/server/rate-limit/limiter";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) return Response.json({ ok: true, data: { items: [] } }, { headers: { "Cache-Control": "no-store" } });
    const items = await listInvestigationCases(sessionId);
    return Response.json({ ok: true, data: { items: items.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      finalScore: item.finalScore,
      riskLevel: item.riskLevel,
      summary: item.summary,
      scanCount: item.scanCount,
      updatedAt: item.updatedAt.toISOString(),
    })) } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const body = investigationCaseSchema.parse(await request.json());
    const sessionId = await getAnonymousSessionId();
    consumeRateLimit(sessionId);
    const investigation = await createInvestigationCase({ sessionId, ...body });
    return Response.json({ ok: true, data: { investigation } }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
