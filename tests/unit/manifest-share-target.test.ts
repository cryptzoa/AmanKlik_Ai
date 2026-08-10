import { describe, expect, it } from "vitest";

import manifest from "@/app/manifest";

describe("PWA share target", () => {
  it("accepts text, URL, and supported screenshots through POST", () => {
    const value = manifest();
    expect(value.share_target.method).toBe("POST");
    expect(value.share_target.action).toBe("/api/share-target");
    expect(value.share_target.params.files[0]?.accept).toContain("image/png");
  });
});
