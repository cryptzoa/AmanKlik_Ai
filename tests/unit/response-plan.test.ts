import { afterEach, describe, expect, it } from "vitest";

import { buildResponsePlan } from "@/lib/response/build-response-plan";
import {
  affectedAssetsForIncidents,
  OFFICIAL_SOURCE_HOSTS,
  RESPONSE_CATALOG,
} from "@/lib/response/catalog";
import type { IncidentType, ResponseStep } from "@/lib/response/types";

const originalCatalogLength = RESPONSE_CATALOG.length;

afterEach(() => {
  RESPONSE_CATALOG.splice(originalCatalogLength);
});

describe("already-acted response planner", () => {
  it.each<[IncidentType, string[]]>([
    ["money_transferred", ["contact-financial-provider", "report-iasc-transfer", "file-police-report"]],
    ["unauthorized_transaction", ["contact-financial-provider", "block-unauthorized-access", "document-unauthorized-transaction"]],
    ["credential_or_card_shared", ["secure-account-fallback", "revoke-sessions", "review-recovery-methods"]],
    ["suspicious_app_installed", ["disconnect-suspicious-app", "remove-suspicious-app", "secure-from-clean-device"]],
    ["account_or_number_lost", ["secure-account-fallback", "contain-account-takeover", "warn-after-account-takeover"]],
    ["identity_data_shared", ["stop-sharing-identity", "preserve-identity-evidence", "check-ideb"]],
    ["link_or_qr_opened", ["close-link-and-stop", "classify-link-impact", "inspect-downloads-and-permissions"]],
    ["goods_released_fake_payment", ["verify-real-balance", "stop-goods-handover", "contact-marketplace-or-logistics"]],
    ["unsure", ["pause-when-unsure", "verify-official-activity", "ask-trusted-person"]],
  ])("gives %s three concrete first actions", (incident, expected) => {
    const plan = buildResponsePlan([incident]);
    expect(plan.immediate.slice(0, 3).map((step) => step.id)).toEqual(expected);
  });

  it("replaces generic account recovery with the selected affected service", () => {
    const plan = buildResponsePlan(["account_or_number_lost"], ["phone_number"]);

    expect(plan.selectedAssets).toEqual(["phone_number"]);
    expect(plan.immediate.slice(0, 3).map((step) => step.id)).toEqual([
      "secure-phone-number",
      "contain-account-takeover",
      "warn-after-account-takeover",
    ]);
    expect(plan.immediate.some((step) => step.id === "secure-account-fallback")).toBe(false);
  });

  it("only offers services relevant to the selected incidents", () => {
    expect(affectedAssetsForIncidents(["money_transferred"])).toEqual([
      "bank_or_wallet",
      "marketplace",
    ]);
    expect(affectedAssetsForIncidents(["identity_data_shared"])).toEqual([]);
    expect(affectedAssetsForIncidents(["money_transferred", "account_or_number_lost"]))
      .toEqual([
        "bank_or_wallet",
        "email",
        "whatsapp",
        "marketplace",
        "social_media",
        "phone_number",
        "device",
      ]);
  });

  it("rejects an affected service that does not match the selected incident", () => {
    const plan = buildResponsePlan(["money_transferred"], ["email", "bank_or_wallet"]);

    expect(plan.selectedAssets).toEqual(["bank_or_wallet"]);
  });

  it("deduplicates shared actions and keeps ordering stable across repeated input", () => {
    const plan = buildResponsePlan([
      "money_transferred",
      "credential_or_card_shared",
      "money_transferred",
    ]);
    const ids = plan.immediate.map((step) => step.id);

    expect(plan.selectedIncidents).toEqual(["money_transferred", "credential_or_card_shared"]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      "contact-financial-provider",
      "report-iasc-transfer",
      "secure-account-fallback",
      "revoke-sessions",
      "file-police-report",
      "review-recovery-methods",
    ]);
    expect(plan.disclaimer).toContain("bukan layanan darurat");
  });

  it("only exposes allowlisted HTTPS sources", () => {
    const plan = buildResponsePlan([
      "money_transferred",
      "credential_or_card_shared",
      "suspicious_app_installed",
      "identity_data_shared",
    ]);
    const steps = [...plan.immediate, ...plan.soon, ...plan.monitor];

    for (const step of steps) {
      if (!step.sourceUrl) continue;
      const url = new URL(step.sourceUrl);
      expect(url.protocol).toBe("https:");
      expect(OFFICIAL_SOURCE_HOSTS.has(url.hostname)).toBe(true);
    }
  });

  it("drops a catalog action whose source points to an untrusted user URL", () => {
    const maliciousStep: ResponseStep = {
      id: "user-controlled-source",
      incidentTypes: ["money_transferred"],
      urgency: "immediate",
      order: 0,
      title: "Buka tautan dari pesan",
      body: "Tidak boleh muncul.",
      sourceTitle: "Sumber kiriman pengguna",
      sourceUrl: "https://example.invalid/recovery",
    };
    RESPONSE_CATALOG.push(maliciousStep);

    const plan = buildResponsePlan(["money_transferred"]);
    expect(plan.immediate.some((step) => step.id === maliciousStep.id)).toBe(false);
  });

  it("does not produce steps for an empty selection", () => {
    const plan = buildResponsePlan([]);
    expect(plan.schemaVersion).toBe(2);
    expect(plan.immediate).toHaveLength(0);
    expect(plan.soon).toHaveLength(0);
    expect(plan.monitor).toHaveLength(0);
  });
});
