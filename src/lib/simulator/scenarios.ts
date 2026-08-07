export type SimulatorChoice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

export type SimulatorStep = {
  id: string;
  message: string;
  choices: SimulatorChoice[];
};

export type SimulatorScenario = {
  id: string;
  title: string;
  description: string;
  steps: SimulatorStep[];
};

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: "family-new-number",
    title: "Nomor baru dari keluarga",
    description: "Seseorang mengaku anggota keluarga dan meminta transfer mendadak.",
    steps: [
      {
        id: "identity-switch",
        message: "Ini nomor baru aku. Nomor lama rusak. Bisa bantu transfer sekarang?",
        choices: [
          { id: "transfer", label: "Transfer sekarang", correct: false, feedback: "Kamu mengikuti tekanan sebelum identitas pengirim terverifikasi." },
          { id: "known-channel", label: "Hubungi nomor lama yang sudah dikenal", correct: true, feedback: "Kamu memindahkan verifikasi ke kanal independen yang sudah dipercaya." },
          { id: "ask-account", label: "Minta nomor rekening dulu", correct: false, feedback: "Detail rekening tidak membuktikan bahwa pengirim adalah orang yang kamu kenal." },
        ],
      },
      {
        id: "urgency",
        message: "Jangan telepon dulu, aku sedang meeting. Tolong cepat ya.",
        choices: [
          { id: "wait-verify", label: "Tunggu sampai bisa diverifikasi", correct: true, feedback: "Menunda keputusan memutus tekanan waktu dan memberi ruang untuk mengecek." },
          { id: "continue-chat", label: "Lanjutkan chat sampai yakin", correct: false, feedback: "Percakapan di kanal yang sama belum menjadi verifikasi independen." },
          { id: "send-small", label: "Kirim sedikit dulu", correct: false, feedback: "Jumlah kecil tetap berisiko dan tidak memverifikasi identitas." },
        ],
      },
    ],
  },
  {
    id: "bank-otp",
    title: "Pemberitahuan OTP",
    description: "Pesan mengancam pembatasan akun dan meminta kode rahasia.",
    steps: [
      {
        id: "otp-request",
        message: "Akun akan dibatasi hari ini. Balas dengan kode OTP untuk membatalkan pemblokiran.",
        choices: [
          { id: "share-otp", label: "Balas dengan OTP", correct: false, feedback: "OTP adalah rahasia; pengirim tidak boleh memintanya lewat pesan." },
          { id: "ignore-and-open-app", label: "Jangan bagikan OTP; buka aplikasi resmi sendiri", correct: true, feedback: "Kamu menolak permintaan rahasia dan memeriksa lewat kanal resmi." },
          { id: "ask-for-link", label: "Minta tautan resmi dari pengirim", correct: false, feedback: "Tautan dari pengirim yang sama belum menjadi verifikasi independen." },
        ],
      },
      {
        id: "follow-up",
        message: "Kalau tidak segera dibalas, akunmu akan ditutup.",
        choices: [
          { id: "panic", label: "Balas agar akun tidak ditutup", correct: false, feedback: "Ancaman waktu dirancang untuk mendorong keputusan tanpa pemeriksaan." },
          { id: "official-channel", label: "Periksa notifikasi di aplikasi resmi", correct: true, feedback: "Kamu memindahkan keputusan dari tekanan pesan ke sumber resmi." },
          { id: "forward", label: "Teruskan OTP ke teman", correct: false, feedback: "OTP tetap rahasia walau diminta untuk alasan apa pun." },
        ],
      },
    ],
  },
  {
    id: "parcel-link",
    title: "Paket dan tautan",
    description: "Pesan pengiriman mengarahkanmu ke tautan untuk biaya atau verifikasi.",
    steps: [
      {
        id: "parcel-link",
        message: "Paket tertahan. Klik tautan ini untuk memperbarui alamat dan membayar biaya kecil.",
        choices: [
          { id: "click", label: "Klik tautan dan isi data", correct: false, feedback: "Tautan dari pesan dapat meminta data atau pembayaran melalui halaman palsu." },
          { id: "official-app", label: "Buka aplikasi marketplace atau kurir secara mandiri", correct: true, feedback: "Kamu memeriksa status paket tanpa mengikuti jalur yang diberikan pesan." },
          { id: "reply", label: "Balas untuk meminta nomor resi", correct: false, feedback: "Membalas tetap mempertahankanmu di kanal yang belum terverifikasi." },
        ],
      },
      {
        id: "domain",
        message: "Alamat terlihat memakai nama brand di bagian depan domain.",
        choices: [
          { id: "trust-brand", label: "Percaya karena nama brand terlihat", correct: false, feedback: "Nama di subdomain atau path tidak sama dengan domain utama." },
          { id: "inspect-domain", label: "Periksa domain utama atau gunakan aplikasi resmi", correct: true, feedback: "Kamu memeriksa bagian domain yang benar dan tetap memilih kanal mandiri." },
          { id: "share", label: "Bagikan ke grup agar ada yang mencoba", correct: false, feedback: "Jangan menyebarkan tautan yang belum diverifikasi." },
        ],
      },
    ],
  },
];

export function evaluateScenario(scenarioId: string, choiceIds: string[]) {
  const scenario = SIMULATOR_SCENARIOS.find((item) => item.id === scenarioId);
  if (!scenario) return null;

  const choices = scenario.steps.map((step, index) => step.choices.find((choice) => choice.id === choiceIds[index]));
  const correctCount = choices.filter((choice) => choice?.correct).length;
  const score = Math.round((correctCount / scenario.steps.length) * 100);

  return {
    scenarioId,
    score,
    correctCount,
    totalSteps: scenario.steps.length,
    feedback: choices.map((choice) => choice?.feedback ?? "Langkah ini belum dijawab."),
  };
}
