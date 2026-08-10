import type { CuratedAdvisory } from "@/types/intelligence";

export const CURATED_ADVISORIES: CuratedAdvisory[] = [
  {
    id: "identity-urgency",
    title: "Identitas mendadak disertai tekanan waktu",
    summary: "Nomor baru, pengakuan sebagai keluarga atau atasan, lalu permintaan tindakan cepat perlu diverifikasi lewat kanal lama.",
    signalCategories: ["impersonation", "urgency", "payment_request"],
    safeAction: "Hubungi orang tersebut melalui nomor atau kanal yang sebelumnya sudah dipercaya.",
    sourceTitle: "OJK — Waspada penipuan mengatasnamakan pihak lain",
    sourceUrl: "https://sikapiuangmu.ojk.go.id/",
  },
  {
    id: "credential-pressure",
    title: "Permintaan OTP, PIN, atau password",
    summary: "Rahasia autentikasi tidak diperlukan oleh petugas resmi melalui percakapan pribadi.",
    signalCategories: ["otp_request", "credential_request", "threat"],
    safeAction: "Jangan bagikan kode; buka aplikasi resmi secara mandiri untuk memeriksa akun.",
    sourceTitle: "OJK — Sikapi Uangmu",
    sourceUrl: "https://sikapiuangmu.ojk.go.id/",
  },
  {
    id: "remote-access",
    title: "Aplikasi kendali jarak jauh",
    summary: "Permintaan memasang aplikasi remote access dapat memberi pihak lain kendali atas perangkat dan aktivitas akun.",
    signalCategories: ["remote_access", "credential_request", "payment_request"],
    safeAction: "Hentikan sesi, putuskan koneksi, dan hubungi penyedia terkait melalui kanal resmi.",
    sourceTitle: "BSSN — Keamanan siber untuk masyarakat",
    sourceUrl: "https://bssn.go.id/",
  },
  {
    id: "verification-link",
    title: "Tautan verifikasi dari pesan",
    summary: "Nama merek pada pesan tidak membuktikan bahwa domain tujuan dimiliki oleh layanan tersebut.",
    signalCategories: ["verification_link", "hostname_encoding", "ip_host"],
    safeAction: "Ketik alamat resmi sendiri atau gunakan aplikasi yang sudah terpasang.",
    sourceTitle: "OJK — Sikapi Uangmu",
    sourceUrl: "https://sikapiuangmu.ojk.go.id/",
  },
];
