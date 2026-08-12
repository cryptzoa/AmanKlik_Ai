import { publicErrorResponse } from "@/lib/api";
import { ValidationError } from "@/lib/errors";
import { evaluateScenario } from "@/lib/simulator/scenarios";
import { assertJsonRequest, assertSameOrigin, readJsonBody } from "@/lib/request-security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertJsonRequest(request);
    const body = await readJsonBody(request);
    if (!body || typeof body !== "object" || !("scenarioId" in body) || !("choiceIds" in body) || typeof body.scenarioId !== "string" || !Array.isArray(body.choiceIds) || body.choiceIds.some((item: unknown) => typeof item !== "string")) {
      throw new ValidationError("Invalid simulator input");
    }

    const result = evaluateScenario(body.scenarioId, body.choiceIds);
    if (!result) throw new ValidationError("Unknown scenario");
    return Response.json({ ok: true, data: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
