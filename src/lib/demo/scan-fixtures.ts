export type DemoTextFixture = {
  id: "T1" | "T2" | "T3" | "T4";
  title: string;
  text: string;
  expected: "LOW" | "HIGH" | "VERY_HIGH";
  safeAction: string;
  screenshotLines?: string[];
};

export type DemoUrlFixture = {
  id: "U1" | "U2" | "U3";
  title: string;
  url: string;
  expected: "LOW" | "MEDIUM" | "HIGH";
};

export const DEMO_TEXT_FIXTURES: DemoTextFixture[] = [
  {
    id: "T1",
    title: "Nomor baru + transfer",
    text: "Bu, ini nomor baru aku. Nomor lama rusak. Aku lagi ada masalah dan butuh transfer sekarang. Tolong kirim ke rekening yang aku kasih ya, jangan telepon dulu karena lagi meeting.",
    expected: "HIGH",
    safeAction: "Hubungi nomor lama atau anggota keluarga lain yang sudah dipercaya.",
    screenshotLines: [
      "Bu, ini nomor baru aku.",
      "Nomor lama rusak.",
      "Aku lagi ada masalah dan butuh",
      "transfer sekarang. Jangan telepon",
      "dulu karena lagi meeting.",
    ],
  },
  {
    id: "T2",
    title: "Ancaman + permintaan OTP",
    text: "Pemberitahuan keamanan: akun Anda akan dibatasi hari ini. Untuk membatalkan pemblokiran, balas pesan ini dengan kode OTP yang baru dikirim.",
    expected: "VERY_HIGH",
    safeAction: "Jangan bagikan OTP; buka aplikasi resmi secara mandiri.",
    screenshotLines: [
      "PEMBERITAHUAN KEAMANAN",
      "Akun Anda akan dibatasi hari ini.",
      "Untuk membatalkan pemblokiran,",
      "balas pesan ini dengan kode OTP",
      "yang baru dikirim.",
    ],
  },
  {
    id: "T3",
    title: "Percakapan keluarga biasa",
    text: "Bu, aku pulang sekitar jam 7 malam. Kalau belanja tolong sekalian beli telur ya. Nanti aku telepon kalau sudah berangkat.",
    expected: "LOW",
    safeAction: "Tetap perhatikan konteks; risiko rendah bukan jaminan aman.",
  },
  {
    id: "T4",
    title: "Investasi dengan untung pasti",
    text: "Investasi resmi dengan keuntungan pasti 25% per minggu. Slot terbatas sampai malam ini. Transfer modal awal sekarang untuk mengaktifkan akun VIP.",
    expected: "HIGH",
    safeAction: "Jangan transfer; periksa izin dan identitas melalui kanal regulator resmi.",
  },
];

export const DEMO_URL_FIXTURES: DemoUrlFixture[] = [
  {
    id: "U1",
    title: "Merek di subdomain",
    url: "https://brand.secure-login.example.net/account",
    expected: "MEDIUM",
  },
  {
    id: "U2",
    title: "Host berupa alamat IP",
    url: "http://192.0.2.10/verify-account",
    expected: "HIGH",
  },
  {
    id: "U3",
    title: "Domain dokumentasi sederhana",
    url: "https://example.com/help/account",
    expected: "LOW",
  },
];

export const DEMO_IMAGE_FIXTURES = [
  { id: "IMG_T1", title: "Screenshot nomor baru", path: "/demo/new-number-transfer.png", textFixtureId: "T1" },
  { id: "IMG_T2", title: "Screenshot permintaan OTP", path: "/demo/otp-verification.png", textFixtureId: "T2" },
] as const;
