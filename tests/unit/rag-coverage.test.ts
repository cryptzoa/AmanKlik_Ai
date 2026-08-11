import { describe, expect, it } from "vitest";

import { getKnowledgeIndex, retrieveKnowledge } from "@/server/rag/retriever";
import { detectMessageSignals } from "@/server/risk/signals";

const COVERAGE_CASES = [
  {
    id: "ojk-apk-file-scam",
    query: "Kurir mengirim file APK bernama resi paket dan meminta saya install aplikasi.",
  },
  {
    id: "ojk-part-time-task-scam",
    query: "Lowongan kerja paruh waktu memberi tugas like lalu meminta deposit tugas.",
  },
  {
    id: "ojk-investment-legality",
    query: "Robot trading menjanjikan profit pasti tanpa risiko dan meminta deposit USDT.",
  },
  {
    id: "bi-qris-quishing",
    query: "Saya mendapat QRIS palsu dan nama merchant berubah setelah scan QR.",
  },
  {
    id: "ojk-marketplace-transaction-scam",
    query: "Pembeli marketplace mengirim bukti transfer palsu lalu meminta transaksi di luar aplikasi.",
  },
  {
    id: "google-security-alert-verification",
    query: "Ada peringatan login perangkat baru di akun Google dan kode verifikasi Google.",
  },
] as const;

describe("expanded RAG coverage", () => {
  it.each(COVERAGE_CASES)("retrieves $id for its topic", async ({ id, query }) => {
    const result = await retrieveKnowledge(query);

    expect(result.mode).toBe("keyword");
    expect(result.matches[0]?.documentId).toBe(id);
    expect(result.matches[0]?.score).toBeGreaterThanOrEqual(5);
  });

  it("does not force guidance for an unrelated everyday message", async () => {
    const result = await retrieveKnowledge("Besok rapat desain pukul sepuluh di ruang utama.");

    expect(result).toEqual({ mode: "none", matches: [] });
  });

  it("can explain a legitimate account alert without turning retrieval into a risk signal", async () => {
    const message = "Google memberi peringatan login perangkat baru; saya akan memeriksanya langsung lewat pengaturan akun.";
    const result = await retrieveKnowledge(message);

    expect(result.matches[0]?.documentId).toBe("google-security-alert-verification");
    expect(detectMessageSignals(message)).toEqual([]);
  });

  it("keeps every curated source on the reviewed publisher allowlist", () => {
    const allowedHosts = new Set(["iasc.ojk.go.id", "ojk.go.id", "www.ojk.go.id", "sikapiuangmu.ojk.go.id", "www.bi.go.id", "support.google.com"]);

    expect(getKnowledgeIndex().chunks.length).toBe(11);
    expect(getKnowledgeIndex().chunks.every((chunk) => allowedHosts.has(new URL(chunk.sourceUrl).hostname))).toBe(true);
  });
});
