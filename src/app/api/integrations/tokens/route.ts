import { listIntegrationTokens, revokeIntegrationToken } from "@/db/repositories/integration-token-repository";
import { publicErrorResponse } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { assertJsonRequest, assertSameOrigin } from "@/lib/request-security";
import { integrationTokenRevokeSchema, integrationTokenSchema } from "@/lib/validation";
import { issueIntegrationToken } from "@/server/integrations/token";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) return Response.json({ ok: true, data: { items: [] } }, { headers: { "Cache-Control": "no-store" } });
    const items = await listIntegrationTokens(sessionId);
    return Response.json({ ok: true, data: { items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), lastUsedAt: item.lastUsedAt?.toISOString() ?? null })) } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const body = integrationTokenSchema.parse(await request.json());
    const sessionId = await getAnonymousSessionId();
    const issued = await issueIntegrationToken({ sessionId, name: body.name });
    return Response.json({ ok: true, data: { token: issued.token, item: { ...issued.record, createdAt: issued.record?.createdAt.toISOString() } } }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const body = integrationTokenRevokeSchema.parse(await request.json());
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId || !(await revokeIntegrationToken(body.id, sessionId))) throw new NotFoundError();
    return Response.json({ ok: true, data: { revoked: true } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
