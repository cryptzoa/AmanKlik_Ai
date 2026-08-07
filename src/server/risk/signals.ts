import type { RiskSignal } from "@/types/analysis";

export function normalizeText(input: string): string {
  return input.normalize("NFKC").replace(/\s+/g, " ").trim();
}

type RuleDefinition = {
  id: string;
  category: string;
  label: string;
  severity: RiskSignal["severity"];
  weight: number;
  explanation: string;
  patterns: RegExp[];
};

const RULES: RuleDefinition[] = [
  {
    id: "otp-request",
    category: "otp_request",
    label: "Permintaan kode OTP",
    severity: "high",
    weight: 28,
    explanation: "Kode OTP adalah rahasia dan tidak seharusnya dikirimkan kepada pengirim pesan.",
    patterns: [
      /\b(?:otp|kode\s+(?:verifikasi|keamanan))\b.{0,80}\b(?:balas|kirim|bagikan|berikan|sebutkan|share|masukkan)\b/i,
      /\b(?:balas|kirim|bagikan|berikan|sebutkan|share)\b.{0,80}\b(?:otp|kode\s+(?:verifikasi|keamanan))\b/i,
    ],
  },
  {
    id: "credential-request",
    category: "credential_request",
    label: "Permintaan password atau PIN",
    severity: "high",
    weight: 26,
    explanation: "Password dan PIN tidak boleh dibagikan melalui percakapan seperti ini.",
    patterns: [
      /\b(?:password|kata\s+sandi|pin|passcode)\b.{0,70}\b(?:kirim|bagikan|berikan|balas|masukkan|sebutkan)\b/i,
      /\b(?:kirim|bagikan|berikan|balas|masukkan|sebutkan)\b.{0,70}\b(?:password|kata\s+sandi|pin|passcode)\b/i,
    ],
  },
  {
    id: "remote-access-request",
    category: "remote_access",
    label: "Permintaan akses jarak jauh",
    severity: "high",
    weight: 30,
    explanation: "Aplikasi akses jarak jauh dapat memberi pihak lain kendali atas perangkat atau akun.",
    patterns: [
      /\b(?:anydesk|teamviewer|rustdesk|remote\s+access|akses\s+jarak\s+jauh|kendali\s+jarak\s+jauh)\b/i,
    ],
  },
  {
    id: "money-transfer",
    category: "payment_request",
    label: "Permintaan transfer atau pembayaran",
    severity: "high",
    weight: 18,
    explanation: "Permintaan uang yang datang lewat pesan perlu diverifikasi melalui kanal yang sudah dipercaya.",
    patterns: [
      /\b(?:transfer|kirim|bayar|rekening|nomor\s+rekening|uang|dana)\b.{0,80}\b(?:sekarang|segera|hari\s+ini|secepatnya|ini)\b/i,
      /\b(?:transfer|kirim|bayar|isi\s+saldo)\b/i,
    ],
  },
  {
    id: "guaranteed-return",
    category: "investment",
    label: "Janji keuntungan pasti",
    severity: "high",
    weight: 18,
    explanation: "Janji keuntungan pasti, apalagi disertai tekanan waktu, adalah indikator risiko.",
    patterns: [
      /\b(?:keuntungan|return|profit|cuan)\b.{0,70}\b(?:pasti|dijamin|tanpa\s+rugi|100%)\b/i,
      /\b(?:pasti|dijamin|tanpa\s+rugi|100%)\b.{0,70}\b(?:untung|keuntungan|return|profit|cuan)\b/i,
    ],
  },
  {
    id: "new-number",
    category: "impersonation",
    label: "Perubahan identitas atau nomor",
    severity: "medium",
    weight: 14,
    explanation: "Pergantian nomor atau identitas mendadak perlu diverifikasi lewat kanal lama yang sudah dipercaya.",
    patterns: [
      /\b(?:nomor|no\.)\s+(?:baru|baru\s+aku)\b/i,
      /\b(?:nomor|hp)\s+lama\s+(?:rusak|hilang|mati|nggak\s+aktif)\b/i,
    ],
  },
  {
    id: "urgency-pressure",
    category: "urgency",
    label: "Tekanan waktu",
    severity: "medium",
    weight: 12,
    explanation: "Tekanan untuk bertindak segera dapat mengurangi kesempatan memeriksa informasi secara mandiri.",
    patterns: [
      /\b(?:segera|secepatnya|sekarang|hari\s+ini|terbatas|deadline|sebelum\s+terlambat)\b/i,
    ],
  },
  {
    id: "account-threat",
    category: "threat",
    label: "Ancaman pemblokiran atau pembatasan",
    severity: "high",
    weight: 12,
    explanation: "Ancaman akun diblokir sering dipakai untuk mendorong keputusan tergesa-gesa.",
    patterns: [
      /\b(?:akun|rekening)\b.{0,60}\b(?:blokir|dibatasi|ditutup|dinonaktifkan|terancam)\b/i,
      /\b(?:blokir|dibatasi|ditutup|dinonaktifkan)\b.{0,60}\b(?:akun|rekening)\b/i,
    ],
  },
  {
    id: "prize-payment",
    category: "prize",
    label: "Hadiah yang meminta tindakan atau biaya",
    severity: "medium",
    weight: 12,
    explanation: "Hadiah yang meminta pembayaran atau data sensitif perlu diverifikasi melalui sumber resmi.",
    patterns: [
      /\b(?:menang|hadiah|undian|kupon)\b.{0,100}\b(?:transfer|bayar|biaya|pajak|kirim|klik)\b/i,
      /\b(?:transfer|bayar|biaya|pajak)\b.{0,100}\b(?:hadiah|undian|menang)\b/i,
    ],
  },
  {
    id: "channel-move",
    category: "unexpected_channel",
    label: "Ajakan berpindah kanal secara mendadak",
    severity: "low",
    weight: 8,
    explanation: "Perpindahan kanal dapat mengurangi konteks dan mempersulit verifikasi identitas pengirim.",
    patterns: [
      /\b(?:pindah|lanjut|hubungi)\b.{0,60}\b(?:whatsapp|telegram|nomor\s+ini|akun\s+ini)\b/i,
    ],
  },
  {
    id: "secrecy",
    category: "secrecy",
    label: "Permintaan untuk merahasiakan atau tidak menelepon",
    severity: "medium",
    weight: 10,
    explanation: "Larangan menghubungi pihak lain dapat mengisolasi pengguna dari verifikasi independen.",
    patterns: [
      /\b(?:jangan|tidak\s+usah)\b.{0,50}\b(?:telepon|hubungi|bilang|cerita|beri\s+tahu|kasih\s+tahu)\b/i,
      /\b(?:rahasia|jangan\s+telepon|jangan\s+bilang)\b/i,
    ],
  },
  {
    id: "verification-link",
    category: "verification_link",
    label: "Ajakan membuka tautan untuk verifikasi",
    severity: "medium",
    weight: 10,
    explanation: "Tautan dari pesan dapat mengarah ke halaman yang meminta data atau kredensial.",
    patterns: [
      /\b(?:klik|buka|akses)\b.{0,60}\b(?:tautan|link|verifikasi|konfirmasi)\b/i,
      /\b(?:tautan|link)\b.{0,60}\b(?:verifikasi|konfirmasi|login|masuk)\b/i,
    ],
  },
  {
    id: "identity-document",
    category: "identity_document",
    label: "Permintaan dokumen identitas",
    severity: "high",
    weight: 18,
    explanation: "Dokumen identitas adalah data sensitif dan harus dibagikan hanya melalui kanal resmi.",
    patterns: [
      /\b(?:ktp|kartu\s+identitas|paspor|sim|foto\s+identitas)\b.{0,70}\b(?:kirim|foto|scan|unggah|bagikan)\b/i,
      /\b(?:kirim|foto|scan|unggah|bagikan)\b.{0,70}\b(?:ktp|kartu\s+identitas|paspor|sim)\b/i,
    ],
  },
];

function evidenceFor(input: string, pattern: RegExp): string | undefined {
  const match = pattern.exec(input);
  if (!match || match.index < 0) return undefined;
  const start = Math.max(0, match.index - 24);
  return input.slice(start, start + 120).trim();
}

export function detectMessageSignals(input: string): RiskSignal[] {
  const normalized = normalizeText(input);

  return RULES.flatMap((rule) => {
    const matchedPattern = rule.patterns.find((pattern) => {
      pattern.lastIndex = 0;
      return pattern.test(normalized);
    });

    if (!matchedPattern) return [];

    return [
      {
        id: rule.id,
        category: rule.category,
        source: "rule" as const,
        label: rule.label,
        severity: rule.severity,
        weight: rule.weight,
        evidence: evidenceFor(normalized, matchedPattern),
        explanation: rule.explanation,
      },
    ];
  });
}
