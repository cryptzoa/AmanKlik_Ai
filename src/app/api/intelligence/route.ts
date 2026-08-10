import { publicErrorResponse } from "@/lib/api";
import { buildIntelligenceSnapshot } from "@/lib/intelligence/build-snapshot";
import { getIntelligenceSnapshot } from "@/server/intelligence/get-snapshot";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getIntelligenceSnapshot();
    return Response.json({ ok: true, data: { snapshot } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      return Response.json({ ok: true, data: { snapshot: buildIntelligenceSnapshot([], 0) } }, { headers: { "Cache-Control": "no-store" } });
    }
    return publicErrorResponse(error);
  }
}
