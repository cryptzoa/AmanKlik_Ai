import type { ActionItem } from "@/types/analysis";
import type { KnowledgeMatch } from "@/server/rag/types";

const ACTIONS: Record<string, ActionItem> = {
  do_not_click: {
    id: "do_not_click",
    priority: "now",
    title: "Hindari membuka tautan dari pesan",
    body: "Jika perlu memeriksa akun atau pesanan, buka aplikasi atau alamat resmi secara mandiri.",
  },
  do_not_share_credentials: {
    id: "do_not_share_credentials",
    priority: "now",
    title: "Jangan bagikan kata sandi atau PIN",
    body: "Jangan meneruskan kata sandi atau PIN kepada pengirim.",
  },
  do_not_share_otp: {
    id: "do_not_share_otp",
    priority: "now",
    title: "Jangan bagikan OTP",
    body: "Jangan meneruskan kode OTP, PIN, atau kata sandi kepada pengirim.",
  },
  verify_independently: {
    id: "verify_independently",
    priority: "next",
    title: "Periksa lewat sumber lain",
    body: "Buka sendiri aplikasi atau situs resmi, atau hubungi nomor yang sudah kamu percaya. Jangan memakai kontak dari pesan mencurigakan.",
  },
  contact_provider: {
    id: "contact_provider",
    priority: "if_already_acted",
    title: "Hubungi penyedia terkait",
    body: "Jika sudah memberikan data atau mengirim uang, segera hubungi penyedia melalui aplikasi, nomor, atau situs resminya.",
  },
  secure_account: {
    id: "secure_account",
    priority: "if_already_acted",
    title: "Amankan akun",
    body: "Ganti kata sandi atau PIN melalui aplikasi resmi. Periksa aktivitas akun jika ada data yang sudah terlanjur diberikan.",
  },
  preserve_evidence: {
    id: "preserve_evidence",
    priority: "if_already_acted",
    title: "Simpan bukti",
    body: "Simpan tangkapan layar, urutan kejadian, informasi transaksi, dan rincian yang diperlukan untuk laporan resmi.",
  },
  report_officially: {
    id: "report_officially",
    priority: "if_already_acted",
    title: "Gunakan layanan pelaporan resmi",
    body: "Buka layanan pelaporan dari aplikasi atau situs resmi lembaga terkait, bukan dari tautan dalam pesan mencurigakan.",
  },
};

const DEFAULT_ACTION_TAGS = ["verify_independently", "do_not_share_credentials", "contact_provider"];

export function actionPlanFor(tags: string[] = [], knowledge: KnowledgeMatch[] = []): ActionItem[] {
  const merged = [...tags, ...DEFAULT_ACTION_TAGS];
  const uniqueTags = [...new Set(merged)];
  return uniqueTags.map((tag) => {
    const action = ACTIONS[tag];
    if (!action) return null;

    const source = knowledge.find((match) => match.actionTags.includes(tag));
    return source ? {
      ...action,
      sourceTitle: `${source.documentTitle}  (${source.publisher}`,
      sourceUrl: source.sourceUrl,
    } : { ...action };
  }).filter((action): action is ActionItem => Boolean(action));
}
