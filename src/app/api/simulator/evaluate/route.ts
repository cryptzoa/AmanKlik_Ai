import { publicErrorResponse } from "@/lib/api";
import { ValidationError } from "@/lib/errors";
import { evaluateScenario } from "@/lib/simulator/scenarios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body.scenarioId !== "string" || !Array.isArray(body.choiceIds) || body.choiceIds.some((item: unknown) => typeof item !== "string")) {
      throw new ValidationError("Invalid simulator input");
    }

    const result = evaluateScenario(body.scenarioId, body.choiceIds);
    if (!result) throw new ValidationError("Unknown scenario");
    return Response.json({ ok: true, data: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return publicErrorResponse(error);
  }
}
