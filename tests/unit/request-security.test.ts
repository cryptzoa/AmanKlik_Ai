import { describe, expect, it } from "vitest";
import { assertSameOrigin } from "@/lib/request-security";
import { DomainError } from "@/lib/errors";

describe("assertSameOrigin security checks", () => {
  it("allows requests matching production domain amanklik.id", () => {
    const request = new Request("http://localhost:3000/api/scans/image", {
      method: "POST",
      headers: {
        origin: "https://amanklik.id",
        "sec-fetch-site": "same-origin",
      },
    });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it("allows requests matching www.amanklik.id subdomain", () => {
    const request = new Request("http://localhost:3000/api/scans/image", {
      method: "POST",
      headers: {
        origin: "https://www.amanklik.id",
        "sec-fetch-site": "same-site",
      },
    });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it("allows requests with x-forwarded-host and x-forwarded-proto", () => {
    const request = new Request("http://127.0.0.1:3000/api/scans/image", {
      method: "POST",
      headers: {
        origin: "https://proxy-domain.com",
        "x-forwarded-host": "proxy-domain.com",
        "x-forwarded-proto": "https",
        "sec-fetch-site": "same-origin",
      },
    });

    expect(() => assertSameOrigin(request)).not.toThrow();
  });

  it("strictly rejects cross-site attacker origin", () => {
    const request = new Request("http://localhost:3000/api/scans/image", {
      method: "POST",
      headers: {
        origin: "https://malicious-phishing.com",
        "sec-fetch-site": "cross-site",
      },
    });

    expect(() => assertSameOrigin(request)).toThrow(DomainError);
    try {
      assertSameOrigin(request);
    } catch (error) {
      expect((error as DomainError).code).toBe("FORBIDDEN");
    }
  });

  it("strictly rejects cross-site fetch-site even with spoofed origin", () => {
    const request = new Request("http://localhost:3000/api/scans/image", {
      method: "POST",
      headers: {
        origin: "https://amanklik.id",
        "sec-fetch-site": "cross-site",
      },
    });

    expect(() => assertSameOrigin(request)).toThrow(DomainError);
  });
});
