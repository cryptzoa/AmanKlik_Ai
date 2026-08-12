import { analyzeImage } from "@/server/scan/analyze-image";
import { analyzeText } from "@/server/scan/analyze-text";
import { analyzeSubmittedUrl } from "@/server/scan/analyze-url";
import { analyzeUrl } from "@/server/url/analyzer";
import { consumeRateLimit } from "@/server/rate-limit/limiter";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import type { UploadFile } from "@/server/image/preprocess";
import { textScanRequestSchema, urlScanRequestSchema } from "@/lib/validation";
import { env } from "@/lib/env";
import { assertMultipartBodySize } from "@/lib/request-security";
import { reportServerError } from "@/server/observability/report-error";

export const dynamic = "force-dynamic";

function textValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site") throw new Error("Cross-site share rejected");
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.startsWith("multipart/form-data")) throw new Error("Invalid share payload");
    assertMultipartBodySize(request, env.MAX_UPLOAD_BYTES + 256_000);
    const sessionId = await getAnonymousSessionId();
    await consumeRateLimit(`share:${sessionId}`, 2, request);
    const formData = await request.formData();
    const file = formData.get("image");
    let scanId: string;

    if (file && typeof file === "object" && "arrayBuffer" in file && "size" in file && Number(file.size) > 0) {
      scanId = (await analyzeImage({ file: file as UploadFile, sessionId })).result.scanId;
    } else {
      const title = textValue(formData, "title");
      const sharedText = textValue(formData, "text");
      const sharedUrl = textValue(formData, "url");
      const combined = [title, sharedText].filter(Boolean).join("\n").slice(0, 8_000);
      const exactUrl = sharedUrl || (/^https?:\/\/\S+$/i.test(sharedText) ? sharedText : "");
      if (exactUrl) {
        const parsed = urlScanRequestSchema.parse({ url: exactUrl });
        analyzeUrl(parsed.url);
        scanId = (await analyzeSubmittedUrl({ url: parsed.url, sessionId })).result.scanId;
      } else {
        const parsed = textScanRequestSchema.parse({ text: combined });
        scanId = (await analyzeText({ text: parsed.text, sessionId })).result.scanId;
      }
    }

    return Response.redirect(new URL(`/result/${scanId}`, request.url), 303);
  } catch (error) {
    reportServerError("share-target.request", error);
    return Response.redirect(new URL("/scan?share=failed", request.url), 303);
  }
}
