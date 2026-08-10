import { publicErrorResponse } from "@/lib/api";
import { env } from "@/lib/env";
import { assertJsonRequest } from "@/lib/request-security";
import { integrationScanSchema } from "@/lib/validation";
import { assertIntegrationOrigin, authenticateIntegrationRequest, integrationCorsHeaders } from "@/server/integrations/token";
import { consumeRateLimit } from "@/server/rate-limit/limiter";
import { analyzeText } from "@/server/scan/analyze-text";
import { analyzeSubmittedUrl } from "@/server/scan/analyze-url";
import { analyzeUrl } from "@/server/url/analyzer";

export const dynamic = "force-dynamic";

function withCors(response: Response, request: Request) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(integrationCorsHeaders(request))) headers.set(name, String(value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export async function OPTIONS(request: Request) {
  try {
    assertIntegrationOrigin(request);
    return new Response(null, { status: 204, headers: integrationCorsHeaders(request) });
  } catch (error) {
    return withCors(publicErrorResponse(error), request);
  }
}

export async function POST(request: Request) {
  try {
    assertIntegrationOrigin(request);
    assertJsonRequest(request);
    const token = await authenticateIntegrationRequest(request);
    const body = integrationScanSchema.parse(await request.json());
    consumeRateLimit(`integration:${token.id}`);
    let analysis;
    if (body.mode === "url") {
      analyzeUrl(body.url);
      analysis = await analyzeSubmittedUrl({ url: body.url, sessionId: token.sessionId });
    } else {
      analysis = await analyzeText({ text: body.text, sessionId: token.sessionId });
    }
    const result = analysis.result;
    return withCors(Response.json({ ok: true, data: {
      scanId: result.scanId,
      resultUrl: new URL(`/result/${result.scanId}`, env.APP_BASE_URL).toString(),
      result: {
        finalScore: result.finalScore,
        riskLevel: result.riskLevel,
        summary: result.summary,
        uncertainty: result.uncertainty,
        indicators: result.indicators.slice(0, 5).map((item) => ({ label: item.label, severity: item.severity, explanation: item.explanation })),
        actions: result.actionPlan.slice(0, 3).map((item) => ({ title: item.title, body: item.body })),
      },
    } }, { headers: { "Cache-Control": "no-store" } }), request);
  } catch (error) {
    return withCors(publicErrorResponse(error), request);
  }
}
