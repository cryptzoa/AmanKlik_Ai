import { publicErrorResponse } from "@/lib/api";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sessionId = await getAnonymousSessionId({ create: false });
    if (!sessionId) return Response.json({ ok: true, data: { items: [] } }, { headers: { "Cache-Control": "no-store" } });

    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 20;
    const items = await listScansForSession(sessionId, Number.isFinite(limit) ? limit : 20);

    return Response.json(
      {
        ok: true,
        data: {
          items: items.map((item) => ({
            id: item.id,
            inputType: item.inputType,
            preview: item.previewRedacted,
            finalScore: item.finalScore,
            riskLevel: item.riskLevel,
            createdAt: item.createdAt.toISOString(),
          })),
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return publicErrorResponse(error);
  }
}
