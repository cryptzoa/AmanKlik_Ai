import { describe, expect, it, vi } from "vitest";

import { analyzeUrl } from "@/server/url/analyzer";

describe("analyzeUrl", () => {
  it("decomposes a deceptive subdomain without network access", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const result = analyzeUrl("https://brand.secure-login.example.net/account");

    expect(result.domain).toBe("example.net");
    expect(result.subdomain).toBe("brand.secure-login");
    expect(result.path).toBe("/account");
    expect(result.signals.map((signal) => signal.category)).toContain("brand_domain_mismatch");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("detects an IP host and plain HTTP", () => {
    const result = analyzeUrl("http://192.0.2.10/verify-account");

    expect(result.isIpHost).toBe(true);
    expect(result.signals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining(["url-ip-host", "url-plain-http"]),
    );
  });

  it("rejects unsupported protocols", () => {
    expect(() => analyzeUrl("javascript:alert(1)")).toThrow(/HTTP atau HTTPS/);
    expect(() => analyzeUrl("file:///etc/passwd")).toThrow(/HTTP atau HTTPS/);
  });

  it("does not treat a reserved benign URL as automatically malicious", () => {
    const result = analyzeUrl("https://example.com/help/account");

    expect(result.structuralScore).toBe(0);
    expect(result.signals).toHaveLength(0);
  });
});
