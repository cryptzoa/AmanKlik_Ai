import { describe, expect, it } from "vitest";

import { formatKnowledgeForPrompt, retrieveKnowledge } from "@/server/rag/retriever";

describe("local knowledge retrieval", () => {
  it("retrieves credential guidance for an OTP request", async () => {
    const result = await retrieveKnowledge("Petugas bank meminta kode OTP agar akun tidak diblokir.");

    expect(result.mode).toBe("keyword");
    expect(result.matches[0]?.documentId).toBe("ojk-credential-secrets");
    expect(result.matches[0]?.sourceUrl).toMatch(/^https:\/\/(?:www\.)?ojk\.go\.id\//);
  });

  it("retrieves IASC guidance after a transfer", async () => {
    const result = await retrieveKnowledge("Saya terlanjur transfer ke rekening penipu dan punya bukti transfer.");

    expect(result.matches[0]?.documentId).toBe("iasc-after-transfer");
    expect(result.matches[0]?.actionTags).toContain("preserve_evidence");
  });

  it("retrieves domain caution for a suspicious URL", async () => {
    const result = await retrieveKnowledge("Periksa link login dengan subdomain dan alamat IP ini");

    expect(result.matches[0]?.documentId).toBe("ojk-domain-caution");
  });

  it("never formats a user-supplied URL as a knowledge source", async () => {
    const suspicious = "https://login-bank.example.net/ambil-akun";
    const result = await retrieveKnowledge(`Klik ${suspicious} untuk login`);
    const promptKnowledge = formatKnowledgeForPrompt(result.matches).join("\n");

    expect(promptKnowledge).not.toContain(suspicious);
    expect(result.matches.every((match) => !match.sourceUrl.includes("example.net"))).toBe(true);
  });
});
