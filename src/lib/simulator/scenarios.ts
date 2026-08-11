export type SimulatorChoiceQuality = "safe" | "partial" | "unsafe";

export type SimulatorChoice = {
  id: string;
  label: string;
  quality: SimulatorChoiceQuality;
  points: number;
  feedback: string;
  saferAction?: string;
};

export type SimulatorStep = {
  id: string;
  phase: string;
  prompt: string;
  message: string;
  choices: SimulatorChoice[];
};

export type SimulatorSource = {
  title: string;
  url: string;
};

export type SimulatorScenario = {
  id: string;
  title: string;
  tag: string;
  description: string;
  learningObjective: string;
  transferableRule: string;
  estimatedMinutes: number;
  steps: SimulatorStep[];
  sources: SimulatorSource[];
};

export type SimulatorDecision = {
  stepId: string;
  choiceId: string;
  label: string;
  quality: SimulatorChoiceQuality;
  points: number;
  feedback: string;
  saferAction?: string;
};

export type SimulatorEvaluation = {
  schemaVersion: 2;
  scenarioId: string;
  score: number;
  level: "strong" | "developing" | "retry";
  correctCount: number;
  safeCount: number;
  partialCount: number;
  unsafeCount: number;
  totalSteps: number;
  decisions: SimulatorDecision[];
  feedback: string[];
  transferableRule: string;
};

const OJK_SECURITY = "https://www.ojk.go.id/id/Fungsi-Utama/ITSK/Informasi-IAKD/Digital-Financial-Literacy/Documents/2.%20Proteksi%20Diri%20dari%20Kejahatan%20Digital.pdf";
const OJK_INDEPENDENT = "https://sikapiuangmu.ojk.go.id/FrontEnd/images/FileDownload/417_Perbankan-4a%20mudah%20dan%20aman%20dengan%20internet%20banking%20dan%20mobile%20banking_2018_small.pdf";
const OJK_TASK_SCAM = "https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Documents/Pages/Satgas-Blokir-Situs-PT-Bingoby-Digital-Kreasi-%28Jombingo%29/SATGAS%20BLOKIR%20SITUS%20PT%20BINGOBY%20DIGITAL%20KREASI%20%28JOMBINGO%29.pdf";
const OJK_INVESTMENT = "https://www.ojk.go.id/waspada-investasi/id/FAQ.aspx";
const OJK_MARKETPLACE = "https://www.ojk.go.id/id/Publikasi/E-Magazine/Documents/Majalah%20Edukasi%20Konsumen%20Triwulan%20IV%20-%202022.pdf";
const BI_APK = "https://www.bi.go.id/id/publikasi/ruang-media/cerita-bi/Pages/modus-penipuan-online-apk.aspx";
const BI_QRIS = "https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx";
const BI_TRANSFER_PROOF = "https://www.bi.go.id/id/informasi-publik/isu-hoaks/Pages/Bukti-Transfer-Berlogo-BI.aspx";
const KOMDIGI_DEEPFAKE = "https://www.komdigi.go.id/berita/siaran-pers/detail/marak-penipuan-dengan-ai-wamenkomdigi-nezar-patria-minta-masyarakat-waspada";

export const OFFICIAL_SIMULATOR_SOURCE_HOSTS = new Set([
  "ojk.go.id",
  "www.ojk.go.id",
  "sikapiuangmu.ojk.go.id",
  "www.bi.go.id",
  "www.komdigi.go.id",
]);

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: "family-new-number",
    title: "Keluarga, nomor baru, dan suara mirip",
    tag: "Impersonasi",
    description: "Pesan dari nomor baru memakai foto dan suara yang terasa familier lalu meminta transfer mendadak.",
    learningObjective: "Menguji identitas melalui kanal yang sudah dipercaya, bukan lewat bukti yang dikirim pengaku identitas.",
    transferableRule: "Suara, foto, dan jawaban di chat bukan verifikasi. Hubungi orangnya melalui kanal lama atau orang tepercaya lain.",
    estimatedMinutes: 2,
    sources: [
      { title: "Verifikasi lewat kanal independen — OJK", url: OJK_INDEPENDENT },
      { title: "Waspada deepfake untuk penipuan — Komdigi", url: KOMDIGI_DEEPFAKE },
    ],
    steps: [
      {
        id: "new-number-proof",
        phase: "Pesan masuk",
        prompt: "Apa respons pertamamu?",
        message: "Ini nomor baruku. HP lama rusak. Aku kirim voice note biar kamu percaya—tolong transfer untuk biaya rumah sakit sekarang.",
        choices: [
          { id: "call-known-number", label: "Hubungi nomor lama atau keluarga lain yang sudah dikenal", quality: "safe", points: 100, feedback: "Kamu memisahkan klaim dari kanal verifikasi. Suara yang mirip tidak dijadikan bukti tunggal." },
          { id: "ask-private-question", label: "Tanyakan hal pribadi yang hanya keluarga tahu", quality: "partial", points: 45, feedback: "Ini menciptakan jeda, tetapi jawaban pribadi bisa ditebak atau sudah bocor.", saferAction: "Tetap konfirmasi melalui nomor lama atau anggota keluarga lain." },
          { id: "trust-voice", label: "Percaya karena suara dan fotonya cocok", quality: "unsafe", points: 0, feedback: "Suara dan gambar dapat ditiru, dicuri, atau dibuat ulang.", saferAction: "Jangan transfer sebelum identitas dikonfirmasi lewat kanal lama." },
        ],
      },
      {
        id: "call-refusal",
        phase: "Tekanan naik",
        prompt: "Pengirim melarang telepon. Apa yang kamu lakukan?",
        message: "Jangan telepon dulu, aku di ruang dokter. Kalau terlambat sepuluh menit urusannya gagal.",
        choices: [
          { id: "verify-family-channel", label: "Tunda dan cek melalui grup keluarga atau orang terdekat", quality: "safe", points: 100, feedback: "Kamu mematahkan isolasi dan tekanan waktu dengan verifikasi independen." },
          { id: "inspect-profile", label: "Periksa foto profil dan riwayat statusnya", quality: "partial", points: 30, feedback: "Profil dapat disalin dan akun dapat diambil alih.", saferAction: "Gunakan kontak yang sebelumnya sudah dipercaya." },
          { id: "send-small-transfer", label: "Kirim sedikit dulu supaya tidak terlambat", quality: "unsafe", points: 0, feedback: "Transfer kecil tetap merupakan kerugian dan dapat dipakai untuk mendorong transfer berikutnya.", saferAction: "Tahan semua pembayaran sampai identitas terverifikasi." },
        ],
      },
      {
        id: "different-account",
        phase: "Tujuan pembayaran",
        prompt: "Nama rekening berbeda dari nama keluarga. Langkah terbaik?",
        message: "Pakai rekening temanku saja karena rekeningku sedang bermasalah. Nanti pasti kuganti.",
        choices: [
          { id: "stop-until-confirmed", label: "Berhenti sampai orangnya bisa dikonfirmasi langsung", quality: "safe", points: 100, feedback: "Perubahan rekening menambah ketidakpastian. Kamu tidak membiarkan urgensi menggantikan verifikasi." },
          { id: "request-id-photo", label: "Minta foto identitas pemilik rekening", quality: "partial", points: 25, feedback: "Foto identitas dapat dicuri dan tidak membuktikan kendali atas rekening atau pesan.", saferAction: "Konfirmasi kebutuhan langsung kepada keluarga melalui kanal lama." },
          { id: "transfer-different-name", label: "Transfer karena situasinya darurat", quality: "unsafe", points: 0, feedback: "Alasan darurat dan rekening pihak ketiga adalah kombinasi risiko yang perlu dihentikan.", saferAction: "Jangan transfer sebelum verifikasi independen berhasil." },
        ],
      },
    ],
  },
  {
    id: "bank-otp",
    title: "Telepon CS, ancaman akun, dan OTP",
    tag: "Kredensial",
    description: "Penelepon mengaku petugas bank, menyebut sebagian data, lalu menawarkan bantuan pengamanan akun.",
    learningObjective: "Menjaga rahasia autentikasi dan berpindah ke aplikasi atau kanal resmi yang dibuka sendiri.",
    transferableRule: "Pihak resmi tidak perlu mengetahui OTP, PIN, password, atau CVV untuk membantumu.",
    estimatedMinutes: 2,
    sources: [{ title: "Lindungi OTP, PIN, dan password — OJK", url: OJK_SECURITY }],
    steps: [
      {
        id: "incoming-bank-call",
        phase: "Panggilan masuk",
        prompt: "Nomor terlihat resmi dan penelepon tahu namamu. Apa responsmu?",
        message: "Ada transaksi mencurigakan. Saya dari bagian keamanan bank dan akan membantu membatalkannya sekarang.",
        choices: [
          { id: "end-call-open-app", label: "Tutup telepon lalu buka aplikasi atau nomor resmi sendiri", quality: "safe", points: 100, feedback: "Nama, nomor penelepon, dan data dasar dapat dipalsukan atau diperoleh dari kebocoran." },
          { id: "ask-employee-id", label: "Minta nama dan nomor pegawai dahulu", quality: "partial", points: 25, feedback: "Identitas pegawai yang disebutkan belum memverifikasi panggilan.", saferAction: "Akhiri panggilan lalu hubungi kanal resmi secara mandiri." },
          { id: "continue-because-data", label: "Lanjut karena penelepon tahu data rekening", quality: "unsafe", points: 0, feedback: "Pengetahuan tentang sebagian data tidak membuktikan penelepon adalah petugas.", saferAction: "Jangan mengikuti proses pengamanan dari panggilan masuk." },
        ],
      },
      {
        id: "otp-request",
        phase: "Rahasia diminta",
        prompt: "Kode OTP masuk saat telepon berlangsung. Apa yang kamu lakukan?",
        message: "Sebutkan enam digit yang baru masuk agar transaksi bisa saya batalkan sebelum satu menit.",
        choices: [
          { id: "refuse-otp", label: "Tolak, tutup telepon, dan jangan setujui notifikasi apa pun", quality: "safe", points: 100, feedback: "OTP adalah persetujuan atau kunci akses, bukan kode yang dibutuhkan petugas." },
          { id: "share-partial-otp", label: "Sebutkan sebagian digit saja", quality: "unsafe", points: 0, feedback: "Sebagian rahasia tetap dapat membantu manipulasi dan membuat percakapan berlanjut.", saferAction: "Jangan sebutkan satu digit pun." },
          { id: "ask-otp-purpose", label: "Tanyakan OTP itu untuk transaksi apa", quality: "partial", points: 20, feedback: "Pertanyaan memberi jeda, tetapi kamu masih berada di kanal yang tidak terverifikasi.", saferAction: "Tutup telepon dan periksa notifikasi dari aplikasi resmi." },
        ],
      },
      {
        id: "recovery-link",
        phase: "Bantuan ditawarkan",
        prompt: "Penelepon mengirim tautan pemulihan. Jalur mana yang dipilih?",
        message: "Kalau tidak mau menyebutkan kode, gunakan tautan resmi yang baru saya kirim untuk mengunci rekening.",
        choices: [
          { id: "official-app-only", label: "Abaikan tautan dan masuk lewat aplikasi resmi yang sudah terpasang", quality: "safe", points: 100, feedback: "Kamu memilih jalur yang tidak dikendalikan pengirim." },
          { id: "search-top-result", label: "Cari nama bank lalu buka hasil paling atas", quality: "partial", points: 35, feedback: "Hasil teratas atau iklan dapat mengarah ke situs tiruan.", saferAction: "Gunakan aplikasi, kartu, atau alamat resmi yang sudah dikenal." },
          { id: "open-sent-link", label: "Buka tautan karena dikirim oleh petugas yang menelepon", quality: "unsafe", points: 0, feedback: "Tautan dari pihak yang belum terverifikasi tetap merupakan jalur berisiko.", saferAction: "Jangan membuka tautan; hubungi bank secara mandiri." },
        ],
      },
    ],
  },
  {
    id: "apk-document",
    title: "APK menyamar sebagai dokumen",
    tag: "Perangkat",
    description: "Lampiran di chat disebut undangan, resi, tagihan, atau surat layanan tetapi sebenarnya aplikasi Android.",
    learningObjective: "Mengenali file aplikasi, menolak izin berbahaya, dan tahu langkah awal jika sudah terpasang.",
    transferableRule: "Dokumen tidak perlu dipasang sebagai aplikasi. File APK dan permintaan izin perangkat harus dihentikan.",
    estimatedMinutes: 3,
    sources: [{ title: "Modus penipuan melalui file APK — Bank Indonesia", url: BI_APK }],
    steps: [
      {
        id: "apk-attachment",
        phase: "Lampiran masuk",
        prompt: "Pengirim menyebutnya dokumen. Apa yang kamu periksa?",
        message: "Ini undangan acaranya. File tidak bisa dibuka dari preview, jadi pasang dulu aplikasinya.",
        choices: [
          { id: "refuse-apk", label: "Jangan pasang; konfirmasi acara lewat kanal lain", quality: "safe", points: 100, feedback: "File APK adalah aplikasi, bukan format yang diperlukan untuk membaca undangan atau resi." },
          { id: "scan-antivirus-only", label: "Pasang jika pemindai antivirus tidak memberi peringatan", quality: "partial", points: 20, feedback: "Tidak ada peringatan bukan jaminan file aman atau sesuai tujuan.", saferAction: "Jangan memasang aplikasi dari chat." },
          { id: "install-known-sender", label: "Pasang karena dikirim dari akun kenalan", quality: "unsafe", points: 0, feedback: "Akun kenalan dapat diambil alih dan nama file dapat dibuat meyakinkan.", saferAction: "Konfirmasi lewat kanal lain tanpa meneruskan file." },
        ],
      },
      {
        id: "dangerous-permissions",
        phase: "Izin perangkat",
        prompt: "Aplikasi meminta akses SMS dan Aksesibilitas. Apa keputusanmu?",
        message: "Izinkan baca SMS, notifikasi, dan Aksesibilitas agar dokumen dapat ditampilkan penuh.",
        choices: [
          { id: "deny-uninstall", label: "Tolak semua izin dan hapus aplikasinya", quality: "safe", points: 100, feedback: "Izin tersebut tidak wajar untuk dokumen dan dapat membuka akses ke kode serta kendali perangkat." },
          { id: "allow-then-revoke", label: "Izinkan sebentar lalu cabut setelah dokumen terbuka", quality: "unsafe", points: 0, feedback: "Akses singkat tetap cukup untuk membaca data atau melakukan tindakan berbahaya.", saferAction: "Tolak izin dan hapus aplikasi tanpa membukanya lagi." },
          { id: "deny-sms-only", label: "Tolak SMS tetapi izinkan Aksesibilitas", quality: "partial", points: 15, feedback: "Aksesibilitas sendiri dapat memberi kendali yang sangat luas.", saferAction: "Tolak seluruh izin yang tidak masuk akal dan hapus aplikasi." },
        ],
      },
      {
        id: "after-installed",
        phase: "Sudah terpasang",
        prompt: "Kamu sadar setelah aplikasi sempat dibuka. Apa langkah pertama?",
        message: "Aplikasi sudah terpasang dan sempat mendapat izin. Belum terlihat transaksi aneh.",
        choices: [
          { id: "disconnect-clean-device", label: "Putuskan internet lalu amankan akun dari perangkat lain", quality: "safe", points: 100, feedback: "Containment mengurangi akses lanjutan; akun penting sebaiknya diamankan dari perangkat tepercaya." },
          { id: "wait-for-symptoms", label: "Tunggu sampai muncul transaksi atau gejala", quality: "unsafe", points: 0, feedback: "Tidak adanya gejala belum membuktikan perangkat aman.", saferAction: "Putuskan koneksi dan mulai pengamanan sekarang." },
          { id: "delete-only", label: "Hapus aplikasinya lalu lanjut memakai mobile banking", quality: "partial", points: 25, feedback: "Menghapus aplikasi penting, tetapi belum cukup untuk memastikan izin, sesi, dan akun aman.", saferAction: "Gunakan perangkat lain untuk menghubungi penyedia dan mengamankan akun." },
        ],
      },
    ],
  },
  {
    id: "part-time-task",
    title: "Kerja paruh waktu dan deposit tugas",
    tag: "Lowongan",
    description: "Tawaran tugas sederhana memberi komisi awal lalu meminta deposit untuk membuka tugas bernilai lebih besar.",
    learningObjective: "Mengenali bayaran awal sebagai pembangun kepercayaan dan menolak pekerjaan yang mengharuskan deposit.",
    transferableRule: "Pekerjaan yang sah tidak meminta deposit untuk membuka tugas atau mencairkan upah.",
    estimatedMinutes: 3,
    sources: [{ title: "Waspada kerja paruh waktu berbasis deposit — OJK", url: OJK_TASK_SCAM }],
    steps: [
      {
        id: "unexpected-job-offer",
        phase: "Tawaran masuk",
        prompt: "Lowongan datang lewat pesan pribadi. Apa langkahmu?",
        message: "Kami merekrut freelancer untuk memberi like. Kirim data diri dan selesaikan satu tugas agar langsung dibayar.",
        choices: [
          { id: "verify-company-job", label: "Cari badan usaha dan lowongan lewat kanal perusahaan sendiri", quality: "safe", points: 100, feedback: "Kamu memeriksa apakah perusahaan ada dan apakah lowongan benar diterbitkan olehnya." },
          { id: "try-free-task", label: "Coba satu tugas gratis tanpa deposit", quality: "partial", points: 35, feedback: "Belum ada kerugian uang, tetapi interaksi dapat dipakai membangun kepercayaan dan mengumpulkan data.", saferAction: "Verifikasi perusahaan sebelum mengikuti tugas." },
          { id: "send-id-first", label: "Kirim KTP agar akun kerja cepat aktif", quality: "unsafe", points: 0, feedback: "Identitas sensitif tidak layak diberikan kepada perekrut yang belum diverifikasi.", saferAction: "Hentikan dan periksa lowongan dari kanal perusahaan resmi." },
        ],
      },
      {
        id: "small-reward",
        phase: "Kepercayaan dibangun",
        prompt: "Komisi kecil benar-benar masuk. Apa kesimpulanmu?",
        message: "Tugas pertama dibayar. Admin menunjukkan anggota lain mendapat jutaan rupiah per hari.",
        choices: [
          { id: "recognize-trust-hook", label: "Anggap bayaran awal belum membuktikan skema ini sah", quality: "safe", points: 100, feedback: "Pembayaran awal dapat sengaja diberikan agar korban berani mengambil risiko lebih besar." },
          { id: "trust-because-paid", label: "Percaya karena uang benar-benar masuk", quality: "unsafe", points: 0, feedback: "Bukti satu pembayaran tidak menjelaskan sumber keuntungan atau legalitas kegiatan.", saferAction: "Jangan menambah dana dan periksa legalitasnya." },
          { id: "watch-group-longer", label: "Pantau testimoni grup beberapa hari", quality: "partial", points: 20, feedback: "Testimoni dan akun anggota dapat direkayasa.", saferAction: "Gunakan sumber regulator dan kanal perusahaan di luar grup." },
        ],
      },
      {
        id: "deposit-task",
        phase: "Deposit diminta",
        prompt: "Admin meminta top up untuk tugas premium. Apa keputusanmu?",
        message: "Deposit sekarang untuk membuka tugas gabungan. Modal dan komisi cair setelah semua tahap selesai.",
        choices: [
          { id: "refuse-deposit", label: "Tolak deposit, simpan bukti, dan hentikan kontak", quality: "safe", points: 100, feedback: "Kamu mengenali pergeseran dari pekerjaan menjadi permintaan dana." },
          { id: "smallest-deposit", label: "Pilih deposit terkecil untuk menguji penarikan", quality: "unsafe", points: 0, feedback: "Deposit kecil tetap dapat hilang dan sering diikuti alasan top up tambahan.", saferAction: "Jangan kirim deposit apa pun." },
          { id: "ask-written-guarantee", label: "Minta jaminan tertulis bahwa modal kembali", quality: "partial", points: 15, feedback: "Dokumen atau janji dari pihak yang sama tidak menciptakan perlindungan nyata.", saferAction: "Hentikan skema dan laporkan melalui kanal resmi bila perlu." },
        ],
      },
    ],
  },
  {
    id: "investment-deepfake",
    title: "Investasi, figur publik, dan profit pasti",
    tag: "Investasi",
    description: "Video figur terkenal dan aplikasi rapi dipakai untuk menawarkan keuntungan tetap tanpa risiko.",
    learningObjective: "Menerapkan prinsip Legal dan Logis serta tidak menjadikan figur atau saldo aplikasi sebagai bukti.",
    transferableRule: "Periksa badan hukum, izin yang sesuai, dan kewajaran hasil. Figur terkenal serta tampilan profit bukan legalitas.",
    estimatedMinutes: 3,
    sources: [
      { title: "Periksa legalitas dan kewajaran investasi — OJK", url: OJK_INVESTMENT },
      { title: "Deepfake dapat dipakai untuk penipuan — Komdigi", url: KOMDIGI_DEEPFAKE },
    ],
    steps: [
      {
        id: "celebrity-promotion",
        phase: "Iklan muncul",
        prompt: "Video figur terkenal mendukung platform ini. Apa yang perlu diuji?",
        message: "Platform baru ini memberi profit tetap setiap hari. Video pendirinya sudah dibagikan oleh banyak akun.",
        choices: [
          { id: "verify-entity-license", label: "Periksa badan hukum dan izin kegiatan di regulator", quality: "safe", points: 100, feedback: "Legalitas harus melekat pada entitas dan kegiatan yang tepat, bukan pada figur promosi." },
          { id: "check-video-comments", label: "Baca komentar dan jumlah pengikut akun", quality: "partial", points: 20, feedback: "Popularitas, komentar, dan video dapat dimanipulasi.", saferAction: "Periksa entitas melalui regulator yang berwenang." },
          { id: "trust-public-figure", label: "Percaya karena wajah dan suaranya meyakinkan", quality: "unsafe", points: 0, feedback: "Konten visual dan suara dapat dipalsukan atau dipakai tanpa izin.", saferAction: "Abaikan figur dan uji legalitas penawarannya." },
        ],
      },
      {
        id: "guaranteed-return",
        phase: "Janji hasil",
        prompt: "Profit disebut pasti dan tanpa rugi. Bagaimana menilainya?",
        message: "Return tiga persen per hari dijamin. Sistem AI menjaga modal sehingga tidak mungkin rugi.",
        choices: [
          { id: "reject-illogical-return", label: "Nilai tidak logis dan jangan kirim dana", quality: "safe", points: 100, feedback: "Keuntungan tinggi yang pasti dan tanpa risiko bertentangan dengan karakter investasi." },
          { id: "start-small-investment", label: "Mulai kecil sambil melihat konsistensi profit", quality: "unsafe", points: 0, feedback: "Saldo awal dapat direkayasa untuk mendorong deposit yang lebih besar.", saferAction: "Jangan gunakan dana sebagai alat untuk menguji legalitas." },
          { id: "ask-risk-document", label: "Minta dokumen risiko dari admin", quality: "partial", points: 30, feedback: "Dokumen dari penawar belum membuktikan izin atau kebenaran model bisnis.", saferAction: "Cocokkan informasi dengan regulator secara mandiri." },
        ],
      },
      {
        id: "withdrawal-lock",
        phase: "Penarikan tertahan",
        prompt: "Aplikasi meminta deposit tambahan agar profit cair. Apa langkahmu?",
        message: "Saldo naik, tetapi penarikan dikunci. Bayar pajak dan top up verifikasi untuk mencairkan semuanya.",
        choices: [
          { id: "stop-preserve-report", label: "Jangan tambah dana; simpan bukti dan gunakan kanal laporan resmi", quality: "safe", points: 100, feedback: "Permintaan dana tambahan untuk membuka saldo adalah pola eskalasi kerugian." },
          { id: "pay-release-fee", label: "Bayar sekali agar modal lama bisa kembali", quality: "unsafe", points: 0, feedback: "Biaya baru tidak menjamin pencairan dan dapat diikuti permintaan berikutnya.", saferAction: "Hentikan semua transfer dan dokumentasikan kejadian." },
          { id: "recruit-to-unlock", label: "Undang anggota agar syarat penarikan terpenuhi", quality: "unsafe", points: 0, feedback: "Mengajak orang lain memperluas risiko dan tidak membuktikan dana dapat ditarik.", saferAction: "Jangan merekrut atau menambah dana." },
        ],
      },
    ],
  },
  {
    id: "merchant-payment-proof",
    title: "Pembeli dan bukti transfer palsu",
    tag: "UMKM",
    description: "Pembeli menunjukkan bukti pembayaran dan menekan penjual agar barang segera diserahkan atau selisih uang dikembalikan.",
    learningObjective: "Menjadikan mutasi dan notifikasi aplikasi sendiri sebagai sumber kebenaran pembayaran.",
    transferableRule: "Screenshot bukan dana. Serahkan barang atau refund hanya berdasarkan transaksi yang benar-benar tercatat di akunmu.",
    estimatedMinutes: 2,
    sources: [
      { title: "Status chat bukan bukti transaksi — OJK", url: OJK_MARKETPLACE },
      { title: "Waspada bukti transfer palsu — Bank Indonesia", url: BI_TRANSFER_PROOF },
    ],
    steps: [
      {
        id: "transfer-screenshot",
        phase: "Pembayaran diklaim",
        prompt: "Bukti transfer terlihat meyakinkan. Apa pemeriksaan utamanya?",
        message: "Saya sudah transfer. Ini screenshot berhasil—barang bisa diberikan ke kurir sekarang.",
        choices: [
          { id: "check-own-mutation", label: "Periksa saldo, mutasi, atau notifikasi di aplikasi sendiri", quality: "safe", points: 100, feedback: "Hanya catatan pada akun atau penyedia pembayaranmu yang menunjukkan dana benar-benar masuk." },
          { id: "inspect-screenshot", label: "Perbesar screenshot untuk mencari tanda edit", quality: "partial", points: 25, feedback: "Bukti palsu dapat terlihat sempurna dan bukti asli pun tidak menjamin transaksi belum dibatalkan.", saferAction: "Periksa transaksi dari akunmu sendiri." },
          { id: "release-because-proof", label: "Serahkan barang karena statusnya tertulis berhasil", quality: "unsafe", points: 0, feedback: "Teks pada screenshot dapat diedit atau berasal dari transaksi lain.", saferAction: "Tahan penyerahan sampai dana tercatat." },
        ],
      },
      {
        id: "courier-pressure",
        phase: "Tekanan di lokasi",
        prompt: "Kurir sudah menunggu dan pembeli terus menelepon. Apa keputusanmu?",
        message: "Aplikasi bank sedang gangguan. Kalau kurir pulang saya rugi—bukti transfernya kan sudah ada.",
        choices: [
          { id: "hold-goods", label: "Tahan barang sampai transaksi dapat diverifikasi", quality: "safe", points: 100, feedback: "Biaya atau tekanan waktu tidak menggantikan konfirmasi pembayaran." },
          { id: "take-courier-id", label: "Serahkan setelah memfoto identitas kurir", quality: "partial", points: 15, feedback: "Identitas kurir tidak membuktikan pembayaran dan dapat menambah risiko privasi.", saferAction: "Tahan barang; gunakan prosedur platform atau logistik resmi." },
          { id: "release-small-order", label: "Serahkan karena nilai barang tidak terlalu besar", quality: "unsafe", points: 0, feedback: "Nilai kecil tetap kerugian dan dapat menormalisasi proses yang tidak aman.", saferAction: "Gunakan aturan yang sama untuk semua nilai transaksi." },
        ],
      },
      {
        id: "overpayment-refund",
        phase: "Refund diminta",
        prompt: "Pembeli mengaku salah transfer lebih. Apa langkah aman?",
        message: "Saya kelebihan transfer. Tolong kirim kembali selisihnya ke rekening lain sekarang.",
        choices: [
          { id: "verify-before-refund", label: "Pastikan dana masuk dan gunakan prosedur refund resmi", quality: "safe", points: 100, feedback: "Kamu mencegah refund atas dana yang tidak pernah masuk atau ke rekening yang tidak terkait." },
          { id: "refund-from-screenshot", label: "Kembalikan selisih sesuai nominal di screenshot", quality: "unsafe", points: 0, feedback: "Kamu dapat mengirim uang nyata berdasarkan bukti palsu.", saferAction: "Jangan refund sebelum transaksi terverifikasi." },
          { id: "refund-half", label: "Kembalikan separuh untuk mengurangi konflik", quality: "unsafe", points: 0, feedback: "Kompromi nominal tidak memperbaiki dasar verifikasi yang salah.", saferAction: "Ikuti catatan transaksi dan prosedur penyedia." },
        ],
      },
    ],
  },
  {
    id: "qris-merchant-name",
    title: "QRIS, nama merchant, dan QR kiriman",
    tag: "Pembayaran QR",
    description: "Kode QR dapat ditempel ulang atau dikirim lewat chat untuk mengarahkan pembayaran maupun pencurian data.",
    learningObjective: "Memeriksa nama merchant, tujuan transaksi, dan notifikasi dari aplikasi pembayaran resmi.",
    transferableRule: "Sebelum menekan Bayar, cocokkan nama merchant dan tujuan transaksi. QR untuk menerima refund tidak meminta kamu mengirim uang.",
    estimatedMinutes: 2,
    sources: [{ title: "Keamanan transaksi QRIS — Bank Indonesia", url: BI_QRIS }],
    steps: [
      {
        id: "merchant-name-mismatch",
        phase: "Sebelum bayar",
        prompt: "Nama merchant di aplikasi berbeda dari toko. Apa yang kamu lakukan?",
        message: "QRIS di meja menampilkan nama penerima yang berbeda. Kasir bilang itu nama pemilik lama dan tetap aman.",
        choices: [
          { id: "stop-confirm-merchant", label: "Jangan bayar dan minta QR yang sesuai atau metode lain", quality: "safe", points: 100, feedback: "Bank Indonesia menyarankan pengguna memastikan nama merchant sesuai sebelum pembayaran." },
          { id: "trust-qris-logo", label: "Bayar karena QR menampilkan logo QRIS", quality: "unsafe", points: 0, feedback: "Logo atau format QR tidak menggantikan pemeriksaan nama penerima.", saferAction: "Cocokkan nama merchant sebelum otorisasi." },
          { id: "small-test-payment", label: "Kirim nominal kecil untuk menguji QR", quality: "partial", points: 20, feedback: "Uji nominal tetap mengirim dana ke penerima yang belum dipastikan.", saferAction: "Minta kode pembayaran yang identitas merchant-nya cocok." },
        ],
      },
      {
        id: "refund-qr-chat",
        phase: "QR dikirim lewat chat",
        prompt: "Admin mengirim QR untuk menerima refund. Apa responsmu?",
        message: "Scan QR ini dan masukkan PIN agar refund pesanan masuk ke saldo.",
        choices: [
          { id: "reject-refund-qr", label: "Jangan scan; cek refund melalui aplikasi marketplace", quality: "safe", points: 100, feedback: "Memasukkan PIN setelah scan biasanya mengotorisasi tindakan dari akunmu, bukan menerima dana tanpa verifikasi." },
          { id: "scan-check-amount", label: "Scan dulu lalu batal jika ada nominal", quality: "partial", points: 30, feedback: "Pemindaian dapat membuka situs atau alur berisiko, meski kamu belum menekan Bayar.", saferAction: "Gunakan menu refund resmi di aplikasi." },
          { id: "scan-enter-pin", label: "Scan dan masukkan PIN untuk menerima refund", quality: "unsafe", points: 0, feedback: "PIN dapat mengotorisasi pembayaran atau akses yang justru mengurangi saldo.", saferAction: "Jangan masukkan PIN dari instruksi chat." },
        ],
      },
      {
        id: "payment-notification",
        phase: "Setelah bayar",
        prompt: "Kasir bilang pembayaran belum masuk, tetapi saldo berkurang. Apa langkahmu?",
        message: "Transaksi di aplikasimu terlihat berhasil, sementara merchant belum menerima notifikasi.",
        choices: [
          { id: "check-status-contact-provider", label: "Periksa status transaksi dan hubungi penyedia bila bermasalah", quality: "safe", points: 100, feedback: "Status pada aplikasi dan dukungan penyedia adalah jalur penyelesaian yang dapat ditelusuri." },
          { id: "pay-again-immediately", label: "Bayar lagi agar antrean tidak tertahan", quality: "unsafe", points: 0, feedback: "Pembayaran ulang dapat menghasilkan transaksi ganda.", saferAction: "Pastikan status transaksi pertama melalui penyedia." },
          { id: "show-screenshot-only", label: "Tunjukkan screenshot lalu anggap masalah selesai", quality: "partial", points: 35, feedback: "Screenshot membantu komunikasi, tetapi status transaksi tetap perlu diperiksa oleh penyedia.", saferAction: "Gunakan riwayat transaksi dan kanal bantuan resmi." },
        ],
      },
    ],
  },
  {
    id: "parcel-link",
    title: "Paket tertahan dan tautan pembayaran",
    tag: "Phishing",
    description: "Pesan kurir meminta pembaruan alamat atau biaya kecil lewat tautan yang menyerupai nama merek.",
    learningObjective: "Berpindah ke aplikasi resmi dan membaca domain utama tanpa menjadikan tampilan merek sebagai bukti.",
    transferableRule: "Status paket diperiksa di aplikasi atau situs yang dibuka sendiri. Nama merek di depan alamat bukan domain utama.",
    estimatedMinutes: 2,
    sources: [{ title: "Verifikasi layanan lewat kanal independen — OJK", url: OJK_INDEPENDENT }],
    steps: [
      {
        id: "parcel-notice",
        phase: "Pesan kurir",
        prompt: "Pesan menyebut paket tertahan. Apa pemeriksaan pertamamu?",
        message: "Alamat tidak lengkap. Perbarui data dan bayar biaya penjadwalan ulang melalui tautan ini hari ini.",
        choices: [
          { id: "open-official-order", label: "Buka aplikasi marketplace atau kurir secara mandiri", quality: "safe", points: 100, feedback: "Kamu mengecek status tanpa mengikuti jalur yang dikendalikan pengirim." },
          { id: "reply-for-tracking", label: "Balas dan minta nomor resi", quality: "partial", points: 30, feedback: "Nomor resi dapat dibuat atau dicuri dan percakapan masih berada di kanal yang sama.", saferAction: "Periksa pesanan dari aplikasi atau akun resmi." },
          { id: "open-small-fee-link", label: "Buka karena biayanya kecil", quality: "unsafe", points: 0, feedback: "Nominal kecil sering dipakai untuk membuat korban memasukkan data pembayaran.", saferAction: "Jangan buka tautan; cek pesanan secara mandiri." },
        ],
      },
      {
        id: "brand-in-address",
        phase: "Alamat diperiksa",
        prompt: "Nama kurir terlihat di bagian depan alamat. Apa kesimpulanmu?",
        message: "Alamat halaman memuat nama merek, diikuti beberapa kata lain sebelum akhiran domain.",
        choices: [
          { id: "inspect-main-domain", label: "Cari domain utama atau abaikan dan gunakan aplikasi resmi", quality: "safe", points: 100, feedback: "Subdomain dan path dapat memuat nama apa pun; domain utama menentukan situs yang dikunjungi." },
          { id: "trust-lock-icon", label: "Percaya jika ada ikon gembok", quality: "partial", points: 20, feedback: "HTTPS melindungi koneksi, tetapi tidak membuktikan pemilik situs adalah merek yang diklaim.", saferAction: "Periksa domain utama dan gunakan kanal resmi." },
          { id: "trust-brand-word", label: "Percaya karena nama merek tertulis lengkap", quality: "unsafe", points: 0, feedback: "Nama merek dapat ditempatkan di bagian alamat yang tidak menentukan kepemilikan situs.", saferAction: "Jangan login atau membayar dari halaman tersebut." },
        ],
      },
      {
        id: "card-data-form",
        phase: "Formulir pembayaran",
        prompt: "Halaman meminta data kartu dan OTP untuk biaya kecil. Apa keputusanmu?",
        message: "Masukkan nomor kartu, CVV, dan OTP agar biaya penjadwalan dapat diproses.",
        choices: [
          { id: "close-check-official", label: "Tutup halaman dan cek tagihan dari kanal resmi", quality: "safe", points: 100, feedback: "Kamu mencegah penyerahan data kartu dan kode autentikasi ke halaman yang belum terverifikasi." },
          { id: "use-low-balance-card", label: "Gunakan kartu dengan saldo kecil", quality: "unsafe", points: 0, feedback: "Data kartu dan OTP tetap dapat disalahgunakan di luar biaya yang ditampilkan.", saferAction: "Jangan masukkan data dan tutup halaman." },
          { id: "fill-without-otp", label: "Isi data kartu tetapi jangan masukkan OTP", quality: "partial", points: 15, feedback: "Nomor kartu, masa berlaku, dan CVV sendiri sudah merupakan data sensitif.", saferAction: "Jangan isi bagian apa pun pada formulir tersebut." },
        ],
      },
    ],
  },
];

function levelForScore(score: number): SimulatorEvaluation["level"] {
  if (score >= 80) return "strong";
  if (score >= 45) return "developing";
  return "retry";
}

export function evaluateScenario(scenarioId: string, choiceIds: string[]): SimulatorEvaluation | null {
  const scenario = SIMULATOR_SCENARIOS.find((item) => item.id === scenarioId);
  if (!scenario || choiceIds.length !== scenario.steps.length) return null;

  const choices = scenario.steps.map((step, index) => step.choices.find((choice) => choice.id === choiceIds[index]));
  if (choices.some((choice) => !choice)) return null;

  const decisions = scenario.steps.map((step, index) => {
    const choice = choices[index]!;
    return {
      stepId: step.id,
      choiceId: choice.id,
      label: choice.label,
      quality: choice.quality,
      points: choice.points,
      feedback: choice.feedback,
      saferAction: choice.saferAction,
    };
  });
  const score = Math.round(decisions.reduce((sum, decision) => sum + decision.points, 0) / scenario.steps.length);
  const safeCount = decisions.filter((decision) => decision.quality === "safe").length;
  const partialCount = decisions.filter((decision) => decision.quality === "partial").length;
  const unsafeCount = decisions.filter((decision) => decision.quality === "unsafe").length;

  return {
    schemaVersion: 2,
    scenarioId,
    score,
    level: levelForScore(score),
    correctCount: safeCount,
    safeCount,
    partialCount,
    unsafeCount,
    totalSteps: scenario.steps.length,
    decisions,
    feedback: decisions.map((decision) => decision.feedback),
    transferableRule: scenario.transferableRule,
  };
}
