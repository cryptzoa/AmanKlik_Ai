import { describe, expect, it } from "vitest";

import { buildResponsePlan } from "@/lib/response/build-response-plan";

describe("already-acted response planner", () => {
  it("deduplicates shared actions and orders urgent steps", () => {
    const plan = buildResponsePlan(["money_transferred", "otp_or_pin_shared"]);

    expect(plan.immediate.map((step) => step.id)).toEqual(["stop-contact-and-payment", "contact-financial-provider", "secure-credentials"]);
    expect(plan.soon.map((step) => step.id)).toEqual(["preserve-evidence", "check-account-activity"]);
    expect(plan.disclaimer).toContain("bukan layanan darurat");
  });

  it("does not produce steps for an empty selection", () => {
    const plan = buildResponsePlan([]);
    expect(plan.immediate).toHaveLength(0);
    expect(plan.soon).toHaveLength(0);
    expect(plan.monitor).toHaveLength(0);
  });
});
