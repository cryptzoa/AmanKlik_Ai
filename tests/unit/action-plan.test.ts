import { describe, expect, it } from "vitest";

import { actionPlanFor } from "@/server/scan/actions";
import { retrieveKnowledge } from "@/server/rag/retriever";

describe("knowledge-backed action plan", () => {
  it("attaches only curated official references", async () => {
    const knowledge = await retrieveKnowledge("Saya sudah terlanjur transfer dan punya bukti transaksi.");
    const actions = actionPlanFor(["preserve_evidence", "report_officially"], knowledge.matches);
    const sourced = actions.filter((action) => action.sourceUrl);

    expect(sourced.length).toBeGreaterThan(0);
    expect(sourced.every((action) => new URL(action.sourceUrl ?? "https://invalid.example").hostname.endsWith("ojk.go.id"))).toBe(true);
  });
});
