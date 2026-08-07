export type EvaluationTextFixture = {
  id: string;
  category: "risky" | "benign" | "ambiguous";
  text: string;
  expectedScore: readonly [number, number];
};

export type EvaluationUrlFixture = {
  id: string;
  url: string;
  expectedScore: readonly [number, number];
};

export const EVALUATION_TEXT_FIXTURES: EvaluationTextFixture[] = [
  { id: "R01", category: "risky", text: "Saya dari layanan bank. Pasang AnyDesk lalu transfer biaya aktivasi rekening sekarang.", expectedScore: [65, 100] },
  { id: "R02", category: "risky", text: "Akun akan diblokir hari ini. Balas dengan kode OTP yang baru masuk.", expectedScore: [55, 100] },
  { id: "R03", category: "risky", text: "Berikan PIN dan password agar petugas dapat memulihkan akun Anda segera.", expectedScore: [35, 100] },
  { id: "R04", category: "risky", text: "Profit dijamin 30% tanpa rugi. Transfer modal sekarang sebelum slot habis.", expectedScore: [45, 100] },
  { id: "R05", category: "risky", text: "Anda menang hadiah. Bayar pajak hari ini untuk mencairkan hadiah.", expectedScore: [30, 100] },
  { id: "R06", category: "risky", text: "Ini nomor baru direktur. Transfer dana sekarang dan jangan telepon siapa pun.", expectedScore: [40, 100] },
  { id: "R07", category: "risky", text: "Kirim foto KTP untuk verifikasi hadiah sebelum terlambat.", expectedScore: [25, 100] },
  { id: "R08", category: "risky", text: "Hubungi akun Telegram ini lalu kirim uang hari ini. Rahasiakan dari keluarga.", expectedScore: [35, 100] },
  { id: "R09", category: "risky", text: "Klik link verifikasi dan masukkan password supaya rekening tidak ditutup.", expectedScore: [35, 100] },
  { id: "R10", category: "risky", text: "Paket tertahan. Bayar biaya pengiriman sekarang melalui link konfirmasi.", expectedScore: [25, 100] },
  { id: "B01", category: "benign", text: "Aku pulang sekitar jam tujuh. Nanti aku kabari saat sudah berangkat.", expectedScore: [0, 25] },
  { id: "B02", category: "benign", text: "Rapat besok dipindah ke ruang tiga pukul sembilan pagi.", expectedScore: [0, 25] },
  { id: "B03", category: "benign", text: "Tolong beli telur dan roti kalau mampir ke toko.", expectedScore: [0, 25] },
  { id: "B04", category: "benign", text: "Terima kasih sudah membantu presentasi kelas tadi.", expectedScore: [0, 25] },
  { id: "B05", category: "benign", text: "Buku yang kamu pinjam sudah aku taruh di meja depan.", expectedScore: [0, 25] },
  { id: "B06", category: "benign", text: "Latihan sepak bola dimulai setengah jam lebih awal sore ini.", expectedScore: [0, 25] },
  { id: "B07", category: "benign", text: "Resep supnya pakai dua wortel dan sedikit merica.", expectedScore: [0, 25] },
  { id: "B08", category: "benign", text: "Selamat ulang tahun, semoga harimu menyenangkan.", expectedScore: [0, 25] },
  { id: "B09", category: "benign", text: "Dokumen rapat sudah tersedia di folder tim yang biasa.", expectedScore: [0, 25] },
  { id: "B10", category: "benign", text: "Aku menunggu di pintu masuk perpustakaan.", expectedScore: [0, 25] },
  { id: "A01", category: "ambiguous", text: "Ini nomor baru aku, nanti malam kita bicara lagi ya.", expectedScore: [5, 60] },
  { id: "A02", category: "ambiguous", text: "Ada pemeliharaan layanan bank malam ini, silakan cek pengumuman resmi.", expectedScore: [0, 45] },
  { id: "A03", category: "ambiguous", text: "Status paket terlambat dan akan diperbarui besok.", expectedScore: [0, 45] },
  { id: "A04", category: "ambiguous", text: "Webinar investasi dimulai minggu depan dan terbuka untuk umum.", expectedScore: [0, 45] },
  { id: "A05", category: "ambiguous", text: "Saya baru mengganti password sendiri melalui aplikasi yang biasa digunakan.", expectedScore: [0, 45] },
];

export const EVALUATION_URL_FIXTURES: EvaluationUrlFixture[] = [
  { id: "EU01", url: "https://brand.secure-login.example.net/account", expectedScore: [20, 55] },
  { id: "EU02", url: "http://192.0.2.10/verify-account", expectedScore: [25, 60] },
  { id: "EU03", url: "https://example.com/help/account", expectedScore: [0, 10] },
  { id: "EU04", url: "https://account.verify.support.example.org/session", expectedScore: [25, 60] },
  { id: "EU05", url: "https://xn--80ak6aa92e.example/", expectedScore: [15, 45] },
  { id: "EU06", url: "https://example.org/%76erify", expectedScore: [5, 30] },
  { id: "EU07", url: "https://support-brand---login.example.net/", expectedScore: [5, 35] },
  { id: "EU08", url: "https://198.51.100.20/account", expectedScore: [15, 45] },
];
