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
    }));

    expect(response.status).toBe(415);
    expect((await response.json()).error.code).toBe("UNSUPPORTED_FILE");
  });

  it("recomputes simulator input on the server boundary", async () => {
    const response = await postSimulator(new Request("http://localhost/api/simulator/evaluate", {
      method: "POST",
      body: JSON.stringify({ scenarioId: "family-new-number", choiceIds: ["known-channel", "wait-verify"] }),
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
});
