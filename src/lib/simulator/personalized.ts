import type { AnalysisResult } from "@/types/analysis";
import { SIMULATOR_SCENARIOS, type SimulatorScenario } from "@/lib/simulator/scenarios";

export type PracticeFamily =
  | "identity_verification"
  | "credential_secrecy"
  | "payment_pause"
  | "urgency_resistance"
  | "claim_verification"
  | "domain_recognition"
  | "remote_access_refusal";

export type PersonalizedPractice = {
  schemaVersion: 1;
  templateId: string;
  family: PracticeFamily;
  matchedSignalIds: string[];
  title: string;
  learningObjective: string;
  scenario: SimulatorScenario;
};

const FAMILY_RULES: Array<{ categories: string[]; family: PracticeFamily; templateId: string; objective: string }> = [
  { categories: ["remote_access"], family: "remote_access_refusal", templateId: "bank-otp", objective: "Rahasia akun dan kendali perangkat harus tetap berada di tanganmu." },
  { categories: ["otp_request", "credential_request"], family: "credential_secrecy", templateId: "bank-otp", objective: "OTP, PIN, dan password tidak pernah menjadi bahan verifikasi lewat pesan." },
  { categories: ["payment_request"], family: "payment_pause", templateId: "family-new-number", objective: "Permintaan uang perlu dikonfirmasi melalui kanal yang sudah dipercaya." },
  { categories: ["impersonation", "secrecy"], family: "identity_verification", templateId: "family-new-number", objective: "Pergantian identitas atau nomor harus diuji lewat kanal independen." },
  { categories: ["threat", "urgency"], family: "urgency_resistance", templateId: "bank-otp", objective: "Tekanan waktu bukan bukti; jeda memberi ruang untuk verifikasi." },
  { categories: ["verification_link", "brand_domain_mismatch", "url_obfuscation"], family: "domain_recognition", templateId: "parcel-link", objective: "Baca domain utama dan gunakan aplikasi atau alamat resmi secara mandiri." },
  { categories: ["prize", "investment"], family: "claim_verification", templateId: "parcel-link", objective: "Janji hadiah atau keuntungan perlu diperiksa, bukan dibayar untuk dibuktikan." },
];

const FALLBACK = FAMILY_RULES[3];

export function getPersonalizedPractice(result: AnalysisResult): PersonalizedPractice {
  const categories = new Set(result.indicators.map((signal) => signal.category));
  const matched = FAMILY_RULES.find((rule) => rule.categories.some((category) => categories.has(category))) ?? FALLBACK;
  const matchedSignalIds = result.indicators
    .filter((signal) => matched.categories.includes(signal.category))
    .map((signal) => signal.id)
    .slice(0, 5);
  const scenario = SIMULATOR_SCENARIOS.find((item) => item.id === matched.templateId) ?? SIMULATOR_SCENARIOS[0];

  return {
    schemaVersion: 1,
    templateId: scenario.id,
    family: matched.family,
    matchedSignalIds,
    title: "Latihan dari pola yang baru diperiksa",
    learningObjective: matched.objective,
    scenario,
  };
}
