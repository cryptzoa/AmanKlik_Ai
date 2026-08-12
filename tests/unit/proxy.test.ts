import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { proxy } from "@/proxy";

describe("security proxy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses a strict nonce policy in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = proxy(new NextRequest("https://amanklik.example/"));
    const policy = response.headers.get("content-security-policy") ?? "";
    const scriptPolicy = policy.split(";").find((directive) => directive.trim().startsWith("script-src ")) ?? "";

    expect(scriptPolicy).toContain("'nonce-");
    expect(scriptPolicy).toContain("'strict-dynamic'");
    expect(scriptPolicy).not.toContain("'unsafe-inline'");
    expect(policy).toContain("upgrade-insecure-requests");
  });

  it("generates a different nonce for every request", () => {
    vi.stubEnv("NODE_ENV", "production");
    const first = proxy(new NextRequest("https://amanklik.example/")).headers.get("content-security-policy");
    const second = proxy(new NextRequest("https://amanklik.example/")).headers.get("content-security-policy");

    expect(first).not.toBe(second);
  });
});
