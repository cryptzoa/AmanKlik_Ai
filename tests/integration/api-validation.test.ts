import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
    set: () => undefined,
  }),
}));

import { POST as postText } from "@/app/api/scans/text/route";
import { POST as postUrl } from "@/app/api/scans/url/route";
import { POST as postImage } from "@/app/api/scans/image/route";
import { POST as postSimulator } from "@/app/api/simulator/evaluate/route";
import { POST as postConversation } from "@/app/api/scans/conversation/route";
import { OPTIONS as optionsIntegration, POST as postIntegration } from "@/app/api/integrations/scan/route";
import { POST as postShareTarget } from "@/app/api/share-target/route";
import { publicErrorResponse } from "@/lib/api";
import { AiProviderError } from "@/lib/errors";

describe("API validation boundaries", () => {
  it("rejects text that is too short before analysis", async () => {
    const response = await postText(new Request("http://localhost/api/scans/text", {
      method: "POST",
      body: JSON.stringify({ text: "pendek" }),
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_INPUT");
  });

  it("rejects JSON endpoints with the wrong media type", async () => {
    const response = await postText(new Request("http://localhost/api/scans/text", {
      method: "POST",
      body: JSON.stringify({ text: "Pesan ini cukup panjang untuk diperiksa." }),
      headers: { "content-type": "text/plain" },
    }));

    expect(response.status).toBe(415);
    expect((await response.json()).error.code).toBe("UNSUPPORTED_MEDIA_TYPE");
  });

  it("returns a validation response for malformed JSON", async () => {
    const response = await postText(new Request("http://localhost/api/scans/text", {
      method: "POST",
      body: "{",
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_INPUT");
  });

  it("stops oversized JSON before parsing it", async () => {
    const response = await postText(new Request("http://localhost/api/scans/text", {
      method: "POST",
      body: JSON.stringify({ text: "x".repeat(70_000) }),
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(413);
    expect((await response.json()).error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("rejects cross-site browser submissions", async () => {
    const response = await postText(new Request("http://localhost/api/scans/text", {
      method: "POST",
      body: JSON.stringify({ text: "Pesan ini cukup panjang untuk diperiksa." }),
      headers: {
        "content-type": "application/json",
        origin: "https://attacker.example",
        "sec-fetch-site": "cross-site",
      },
    }));

    expect(response.status).toBe(403);
    expect((await response.json()).error.code).toBe("FORBIDDEN");
  });

  it("rejects non-http URL protocols", async () => {
    const response = await postUrl(new Request("http://localhost/api/scans/url", {
      method: "POST",
      body: JSON.stringify({ url: "javascript:alert(1)" }),
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_INPUT");
  });

  it("rejects a missing screenshot", async () => {
    const response = await postImage(new Request("http://localhost/api/scans/image", { method: "POST" }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_INPUT");
  });

  it("rejects a disguised image before AI analysis", async () => {
    const formData = new FormData();
    formData.set("file", new Blob(["not an image"], { type: "image/png" }), "fake.png");
    const response = await postImage(new Request("http://localhost/api/scans/image", {
      method: "POST",
      body: formData,
      headers: { "content-length": "1024" },
    }));

    expect(response.status).toBe(415);
    expect((await response.json()).error.code).toBe("UNSUPPORTED_FILE");
  });

  it("rejects multipart uploads whose size cannot be verified", async () => {
    const formData = new FormData();
    formData.set("file", new Blob(["not an image"], { type: "image/png" }), "fake.png");
    const response = await postImage(new Request("http://localhost/api/scans/image", {
      method: "POST",
      body: formData,
    }));

    expect(response.status).toBe(411);
    expect((await response.json()).error.code).toBe("LENGTH_REQUIRED");
  });

  it("maps provider outages to a retryable service response", async () => {
    const response = publicErrorResponse(new AiProviderError("provider failed"));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error.code).toBe("PROVIDER_UNAVAILABLE");
    expect(body.error.retryable).toBe(true);
  });

  it("recomputes simulator input on the server boundary", async () => {
    const response = await postSimulator(new Request("http://localhost/api/simulator/evaluate", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "family-new-number", choiceIds: ["call-known-number", "verify-family-channel", "stop-until-confirmed"] }),
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(200);
    expect((await response.json()).data.score).toBe(100);
  });

  it("rejects conversations outside the bounded message contract", async () => {
    const response = await postConversation(new Request("http://localhost/api/scans/conversation", {
      method: "POST",
      body: JSON.stringify({ messages: [{ id: "m1", speaker: "sender", text: "Satu pesan", order: 1 }] }),
      headers: { "content-type": "application/json" },
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe("INVALID_INPUT");
  });

  it("rejects integration requests from regular web origins", async () => {
    const response = await optionsIntegration(new Request("http://localhost/api/integrations/scan", {
      method: "OPTIONS",
      headers: { origin: "https://attacker.example" },
    }));
    expect(response.status).toBe(403);
  });

  it("allows extension preflight but requires a valid revocable token", async () => {
    const origin = "chrome-extension://abcdefghijklmnop";
    const preflight = await optionsIntegration(new Request("http://localhost/api/integrations/scan", { method: "OPTIONS", headers: { origin } }));
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("access-control-allow-origin")).toBe(origin);

    const response = await postIntegration(new Request("http://localhost/api/integrations/scan", {
      method: "POST",
      headers: { origin, "content-type": "application/json", authorization: "Bearer invalid" },
      body: JSON.stringify({ mode: "text", text: "Pesan cukup panjang untuk diperiksa." }),
    }));
    expect(response.status).toBe(401);
    expect((await response.json()).error.code).toBe("UNAUTHORIZED");
  });

  it("rejects regular cross-site form posts to the PWA share target", async () => {
    const formData = new FormData();
    formData.set("text", "Pesan yang cukup panjang untuk dianalisis.");
    const response = await postShareTarget(new Request("http://localhost/api/share-target", {
      method: "POST",
      body: formData,
      headers: { "sec-fetch-site": "cross-site" },
    }));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toContain("/scan?share=failed");
  });
});
