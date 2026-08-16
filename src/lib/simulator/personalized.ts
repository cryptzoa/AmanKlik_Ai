import type { AnalysisResult } from "@/types/analysis";
import { SIMULATOR_SCENARIOS, type SimulatorScenario } from "@/lib/simulator/scenarios";

export type PracticeFamily =
  | "identity_verification"
  | "credential_secrecy"
  | "payment_pause"
  | "urgency_resistance"
  | "claim_verification"
  | "domain_recognition"
  | "remote_access_refusal"
  | "identity_data_protection";

export type PersonalizedPractice = {
  schemaVersion: 2;
  templateId: string;
  family: PracticeFamily;
  matchedSignalIds: string[];
  title: string;
  learningObjective: string;
  scenario: SimulatorScenario;
};

type FamilyRule = {
  categories: string[];
  family: PracticeFamily;
  templateId: string;
  objective: string;
};

const FAMILY_RULES: FamilyRule[] = [
  {
    categories: ["remote_access"],
    family: "remote_access_refusal",
    templateId: "apk-document",
    objective: "Kendali perangkat dan izin sensitif harus tetap berada di tanganmu.",
  },
  {
    categories: ["otp_request", "credential_request"],
    family: "credential_secrecy",
    templateId: "bank-otp",
    objective: "OTP, PIN, kata sandi, dan data kartu tidak boleh dipakai untuk membuktikan identitas melalui telepon atau pesan.",
  },
  {
    categories: ["identity_document"],
    family: "identity_data_protection",
    templateId: "part-time-task",
    objective: "Data identitas hanya diberikan setelah tujuan dan pihak penerimanya dipastikan melalui sumber resmi.",
  },
  {
    categories: ["verification_link", "brand_domain_mismatch", "url_obfuscation", "shortener", "excessive_subdomain", "plain_http", "ip_host"],
    family: "domain_recognition",
    templateId: "parcel-link",
    objective: "Gunakan aplikasi resmi dan baca alamat utama situs sebelum memasukkan data atau membayar.",
  },
  {
    categories: ["prize", "investment"],
    family: "claim_verification",
    templateId: "investment-deepfake",
    objective: "Uji legalitas dan kewajaran klaim; figur, testimoni, dan saldo aplikasi bukan bukti.",
  },
  {
    categories: ["payment_request"],
    family: "payment_pause",
    templateId: "family-new-number",
    objective: "Permintaan uang harus dihentikan sampai identitas dan tujuan pembayaran dapat dipastikan.",
  },
  {
    categories: ["impersonation", "secrecy", "unexpected_channel"],
    family: "identity_verification",
    templateId: "family-new-number",
    objective: "Identitas harus diperiksa melalui nomor lama atau orang tepercaya lain.",
  },
  {
    categories: ["threat", "urgency"],
    family: "urgency_resistance",
    templateId: "bank-otp",
    objective: "Tekanan waktu bukan bukti; berhenti sejenak memberi ruang untuk membuka aplikasi atau situs resmi.",
  },
];

const FALLBACK = FAMILY_RULES[6];

export function getPersonalizedPractice(result: AnalysisResult): PersonalizedPractice {
  const categories = new Set(result.indicators.map((signal) => signal.category));
  const matched = FAMILY_RULES.find((rule) => rule.categories.some((category) => categories.has(category))) ?? FALLBACK;
  const matchedSignalIds = result.indicators
    .filter((signal) => matched.categories.includes(signal.category))
    .map((signal) => signal.id)
    .slice(0, 5);
  const scenario = SIMULATOR_SCENARIOS.find((item) => item.id === matched.templateId) ?? SIMULATOR_SCENARIOS[0];

  return {
    schemaVersion: 2,
    templateId: scenario.id,
    family: matched.family,
    matchedSignalIds,
    title: "Latihan dari pola yang baru diperiksa",
    learningObjective: matched.objective,
    scenario,
  };
}
