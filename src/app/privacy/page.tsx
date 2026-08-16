import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Penjelasan privasi — Draf AmanKlik AI",
  description:
    "Penjelasan tentang data yang diproses, disimpan, dan dikirim saat menggunakan AmanKlik AI.",
  robots: {
    index: false,
    follow: false,
  },
};

const DOCUMENT_VERSION = "Draf 0.1";
const AUDIT_DATE = "14 Agustus 2026";

const contents = [
  ["01", "Data yang masuk", "data-yang-masuk"],
  ["02", "Ke mana data diproses", "aliran-data"],
  ["03", "Cara AI digunakan", "ai-dan-mode"],
  ["04", "Penyimpanan data", "penyimpanan"],
  ["05", "Sesi browser", "sesi"],
  ["06", "Gambar, menu berbagi, dan ekstensi", "kanal-tambahan"],
  ["07", "Sumber luar dan catatan gangguan", "sumber-dan-log"],
  ["08", "Kontrol dan batas layanan", "kontrol"],
  ["09", "Status draf", "status-draf"],
] as const;

const flow = [
  {
    index: "A",
    title: "Browser atau ekstensi",
    body: "Kamu memilih pesan, tautan, percakapan, atau tangkapan layar. Penanda sesi menghubungkan permintaan dengan browsermu tanpa membuat akun.",
  },
  {
    index: "B",
    title: "Server AmanKlik",
    body: "Server memeriksa ukuran dan jenis data, mencari tanda bahaya dengan aturan, membuat penanda khusus, lalu menyusun hasil.",
  },
  {
    index: "C",
    title: "Google Gemini, bila digunakan",
    body: "Saat AI diperlukan dan belum ada hasil sebelumnya, teks, percakapan, atau gambar yang sudah diproses dapat dikirim ke Gemini.",
  },
  {
    index: "D",
    title: "Penyimpanan aplikasi",
    body: "Penyimpanan AmanKlik mencatat penanda isi, cuplikan yang sudah disamarkan, hasil pemeriksaan, dan waktu kedaluwarsa. File gambar asli tidak disimpan di basis data aplikasi.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <PageFrame>
      <div className={styles.page}>
        <RouteIntro
          eyebrow="Penjelasan privasi / Draf"
          title="Apa yang terjadi pada data yang kamu kirim."
          description="Halaman ini menjelaskan apa yang dilakukan AmanKlik berdasarkan kode yang tersedia. Isinya masih draf dan belum menjadi kebijakan privasi resmi."
          annotation={(
            <dl className={styles.documentMeta}>
              <div>
                <dt>Status</dt>
                <dd>Belum disetujui sebagai kebijakan publik</dd>
              </div>
              <div>
                <dt>Versi</dt>
                <dd>{DOCUMENT_VERSION}</dd>
              </div>
              <div>
                <dt>Terakhir diperiksa</dt>
                <dd>{AUDIT_DATE}</dd>
              </div>
            </dl>
          )}
          pattern="reading"
        >
          <p>
            Tidak muncul di mesin pencari · Dapat dibaca dan dicetak tanpa JavaScript
          </p>
        </RouteIntro>

        <section className={styles.summary} aria-labelledby="summary-title">
          <div className={`product-container ${styles.summaryInner}`}>
            <div className={styles.summaryHeading}>
              <p className="product-eyebrow text-ai">Ringkasan singkat</p>
              <h2 id="summary-title">Tiga hal sebelum kamu memeriksa sesuatu.</h2>
            </div>
            <div className={styles.summaryGrid}>
              <article>
                <span>01</span>
                <h3>Yang diproses</h3>
                <p>
                  Isi yang kamu pilih—pesan, tautan, tangkapan layar, atau
                  percakapan—beserta data teknis yang diperlukan untuk
                  menjalankan pemeriksaan dan menjaga layanan tetap aman.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Yang tidak diminta</h3>
                <p>
                  AmanKlik tidak menyediakan akun pengguna dan tidak
                  memerlukan nama, email, kata sandi, PIN, atau OTP untuk masuk.
                  Hapus informasi rahasia itu sebelum mengirim bahan pemeriksaan.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Kontrol yang tersedia</h3>
                <p>
                  Kamu memilih materi yang dikirim, dapat menyalin ringkasan
                  aman, dan dapat mencabut akses ekstensi dari browser yang
                  membuatnya.
                  Belum ada tombol untuk menghapus seluruh data sesi.
                </p>
              </article>
            </div>
            <div className={styles.draftNotice} role="note">
              <strong>Lama penyimpanan belum menjadi janji resmi.</strong>
              <p>
                Kode memiliki waktu kedaluwarsa bawaan. Namun, pengaturan server,
                salinan cadangan, dan aturan penyedia layanan belum diperiksa
                untuk dijadikan komitmen publik.
              </p>
            </div>
          </div>
        </section>

        <div className={`product-container ${styles.readingLayout}`}>
          <nav className={styles.toc} aria-label="Daftar isi privasi">
            <p className="product-eyebrow">Daftar isi</p>
            <ol>
              {contents.map(([number, label, id]) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    <span>{number}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className={styles.policy}>
            <section id="data-yang-masuk" className={styles.section}>
              <SectionHeading
                number="01"
                title="Data yang masuk dimulai dari pilihanmu."
                lead="AmanKlik menerima empat jenis bahan. Ukuran dan jenisnya diperiksa di server sebelum diproses."
              />
              <div className={styles.factRows}>
                <FactRow
                  term="Pesan"
                  detail="Teks sepanjang 8–8.000 karakter. Spasi dan bentuk tulisan dirapikan sebelum tanda bahaya dicari."
                />
                <FactRow
                  term="Tautan"
                  detail="Alamat maksimal 2.048 karakter dan harus memakai HTTP atau HTTPS. AmanKlik hanya membaca susunan alamat; situs tujuan tidak dibuka."
                />
                <FactRow
                  term="Percakapan"
                  detail="Dua sampai dua belas pesan berurutan, maksimal 4.000 karakter per pesan dan 16.000 karakter secara keseluruhan."
                />
                <FactRow
                  term="Tangkapan layar"
                  detail="Gambar PNG, JPEG, atau WebP yang jenis filenya dapat dikenali, dengan batas bawaan 5 MiB dan 40 juta piksel."
                />
              </div>
              <div className={styles.inlineNote}>
                <p>
                  AmanKlik menyamarkan pola tertentu—email, nomor HP
                  Indonesia, rangkaian angka panjang, dan kode OTP dalam
                  konteks tertentu. Penyaringan ini tidak menghapus semua data
                  pribadi: nama, alamat, tautan, atau data lain yang tidak cocok dengan pola
                  masih dapat muncul dalam hasil turunan.
                </p>
              </div>
            </section>

            <section
              id="aliran-data"
              className={`${styles.section} ${styles.flowSection}`}
            >
              <SectionHeading
                number="02"
                title="Data dapat melewati empat tempat."
                lead="Data hanya dikirim ke penyedia AI saat diperlukan. Penyimpanan aplikasi mencatat hasil pemeriksaan, bukan salinan file gambar asli."
                inverse
              />
              <ol className={styles.flow} aria-label="Aliran pemrosesan data">
                {flow.map((step) => (
                  <li key={step.index}>
                    <span aria-hidden="true">{step.index}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </li>
                ))}
              </ol>
              <p className={styles.flowFootnote}>
                Tautan sumber resmi berada di luar proses ini. Server tidak
                membuka sumber tersebut saat pemeriksaan; browser baru mengunjungi
                situs eksternal ketika kamu memilih tautannya.
              </p>
            </section>

            <section id="ai-dan-mode" className={styles.section}>
              <SectionHeading
                number="03"
                title="AI bukan satu-satunya cara AmanKlik memeriksa."
                lead="AmanKlik menggabungkan aturan tetap, pemeriksaan bentuk tautan, hasil sebelumnya, dan bantuan AI. Skor akhir dihitung oleh aplikasi."
              />
              <div className={styles.modeGrid}>
                <article>
                  <p>Aturan + AI</p>
                  <h3>Gemini memberi konteks; aplikasi menghitung skor.</h3>
                  <span>
                    Teks yang sudah dirapikan, percakapan, atau gambar yang sudah
                    diproses dapat dikirim ke Google Gemini. Jenis model yang
                    dipakai dapat berubah sesuai pengaturan layanan.
                  </span>
                </article>
                <article>
                  <p>Hasil sebelumnya</p>
                  <h3>Hasil AI sebelumnya dipakai kembali.</h3>
                  <span>
                    Jika isi yang sama masih memiliki hasil yang berlaku,
                    AmanKlik dapat memakainya kembali tanpa meminta analisis
                    utama dari Gemini. Pemeriksaan tetap mendapat nomor hasil baru.
                  </span>
                </article>
                <article>
                  <p>Aturan saja</p>
                  <h3>Hasil hanya memakai tanda yang ditemukan oleh aturan.</h3>
                  <span>
                    Label ini tidak selalu berarti data belum pernah dikirim ke
                    penyedia AI. Pada pesan, tautan, atau percakapan, kondisi ini
                    juga dapat muncul setelah percobaan AI gagal.
                  </span>
                </article>
              </div>
              <p>
                Saat memakai analisis AI utama, kutipan bukti baru disamarkan
                setelah jawaban AI diterima—bukan sebelum bahan dikirim ke
                Gemini. Karena itu, hapus rahasia dari bahan sebelum diperiksa.
              </p>
              <p>
                Fitur pencarian materi dapat memakai Gemini jika server dibuat
                dengan fitur tersebut. Teks pencarian disamarkan dengan cara
                yang sama dan dibatasi hingga 1.500 karakter. Saat halaman ini
                diperiksa, proyek memakai pencarian kata kunci lokal; pengaturan
                server yang sedang digunakan belum dikonfirmasi.
              </p>
              <div className={styles.warningNote} role="note">
                <strong>Hal yang belum diketahui tentang penyedia AI</strong>
                <p>
                  Kode tidak menentukan wilayah pemrosesan, masa simpan di
                  Google, penggunaan untuk pelatihan, pihak lain yang membantu
                  pemrosesan, atau cara penghapusan mereka. Draf ini tidak membuat janji
                  tentang hal-hal tersebut.
                </p>
              </div>
            </section>

            <section id="penyimpanan" className={styles.section}>
              <SectionHeading
                number="04"
                title="AmanKlik menyimpan penanda dan hasil pemeriksaan."
                lead="Isi asli tidak memiliki tempat penyimpanan khusus. Namun, basis data menyimpan hasil yang dapat berisi kutipan yang sudah disamarkan serta data teknis sesi."
              />
              <dl className={styles.storageList}>
                <StorageRow
                  term="Hasil pemeriksaan"
                  detail="Nomor hasil dan sesi, jenis bahan, penanda khusus untuk isi, cuplikan yang disamarkan, skor, tingkat risiko, cara pemeriksaan, informasi model AI, waktu proses, hasil pemeriksaan, serta waktu dibuat dan kedaluwarsa."
                />
                <StorageRow
                  term="Hasil yang dapat dipakai kembali"
                  detail="Penanda isi, jenis bahan, hasil pemeriksaan, informasi model, cara pemeriksaan, dan waktu kedaluwarsa. Data ini tidak terikat ke satu sesi dan dapat dipakai untuk isi yang sama."
                />
                <StorageRow
                  term="Fitur lanjutan"
                  detail="Tanggapan pengguna, judul dan ringkasan perbandingan, hubungan antarhasil, serta status daftar tindakan dapat masuk ke basis data."
                />
                <StorageRow
                  term="Data untuk keamanan layanan"
                  detail="Kode akses ekstensi disimpan sebagai penanda yang tidak menampilkan kode aslinya, bersama nama perangkat dan waktu. Pembatasan penggunaan juga menyimpan penanda pengguna dan, bila tersedia, penanda alamat jaringan—bukan alamat aslinya di tabel aplikasi."
                />
              </dl>
              <div className={styles.retentionBlock}>
                <p className="product-eyebrow">Lama penyimpanan yang terlihat di kode</p>
                <div>
                  <h3>Waktu penyimpanan bawaan untuk hasil adalah 24 jam.</h3>
                  <p>
                    Pengaturan server dapat mengubah waktu itu. Setelah
                    kedaluwarsa, data tidak ditampilkan oleh aplikasi.
                    Penghapusan dari basis data dilakukan saat pemeriksaan lain
                    disimpan dan paling sering dicek setiap 15 menit, jadi tidak
                    selalu tepat pada detik kedaluwarsa.
                  </p>
                </div>
                <div>
                  <h3>Tidak semua tabel mengikuti waktu itu.</h3>
                  <p>
                    Perbandingan hasil belum memiliki waktu kedaluwarsa atau
                    tombol hapus. Kode akses berhenti berlaku setelah 90 hari
                    atau saat dicabut, tetapi catatannya belum otomatis dihapus
                    oleh aplikasi.
                  </p>
                </div>
              </div>
            </section>

            <section id="sesi" className={styles.section}>
              <SectionHeading
                number="05"
                title="Sesi browser menghubungkan hasil tanpa membuat akun."
                lead="AmanKlik tidak memiliki proses daftar atau masuk. Penanda acak di cookie menghubungkan browser dengan hasil miliknya."
              />
              <div className={styles.sessionGrid}>
                <div>
                  <p className="product-eyebrow">Cookie</p>
                  <h3><code>amanklik_sid</code></h3>
                  <p>
                    Cookie berlaku 30 hari dan tidak dapat dibaca oleh kode yang
                    berjalan di halaman. Cookie dikirim ke seluruh bagian
                    AmanKlik dan hanya melalui koneksi HTTPS pada layanan produksi.
                  </p>
                </div>
                <div>
                  <p className="product-eyebrow">Kepemilikan hasil</p>
                  <h3>Hasil milik browser lain tidak dapat dibuka.</h3>
                  <p>
                    Hasil, perbandingan, kemajuan latihan, tanggapan, dan kode
                    akses dibaca memakai sesi aktif. AmanKlik memberi tampilan
                    yang sama untuk data yang tidak ada dan data milik sesi lain.
                  </p>
                </div>
              </div>
              <p>
                Menghapus cookie membuat browser kehilangan akses ke hasilnya,
                tetapi tidak menghapus data di server. Karena penanda sesi masih
                tersimpan dalam basis data selama datanya ada, istilah
                “anonim” di sini tidak berarti data telah dianonimkan secara
                permanen.
              </p>
              <div className={styles.matchNotice}>
                <span>Jumlah baru terlihat setelah 3 sesi</span>
                <p>
                  Halaman hasil menghitung jumlah sesi berbeda dengan
                  penanda isi yang sama, hanya untuk hasil yang masih
                  aktif dan dibuat dalam waktu paling lama 30 hari. Jumlah
                  tidak ditampilkan sebelum mencapai tiga sesi. Dengan nilai
                  kedaluwarsa bawaan 24 jam, jendela efektifnya lebih pendek
                  daripada 30 hari.
                </p>
              </div>
            </section>

            <section id="kanal-tambahan" className={styles.section}>
              <SectionHeading
                number="06"
                title="Cara masuk berbeda, proses pemeriksaannya sama."
                lead="Tangkapan layar, menu berbagi, dan ekstensi masuk ke pemeriksaan yang sama. Masing-masing memiliki cara pengolahan yang perlu diketahui."
              />
              <div className={styles.channelList}>
                <article>
                  <span>Tangkapan layar</span>
                  <h3>Gambar disesuaikan, diperkecil, lalu dibuat ulang.</h3>
                  <p>
                    Dimensi maksimum hasil adalah 1.600 × 1.600 tanpa
                    memperbesar gambar kecil. Aplikasi tidak menyimpan file asli
                    atau file hasil proses di basis data. Gambar hasil
                    proses dapat dikirim ke Gemini, dan teks yang diekstrak serta
                    bukti turunannya dapat disimpan setelah data pribadi disamarkan.
                  </p>
                </article>
                <article>
                  <span>Menu berbagi</span>
                  <h3>Memilih AmanKlik di menu berbagi langsung memulai pemeriksaan.</h3>
                  <p>
                    Sistem menerima judul, teks, tautan, atau gambar dari menu
                    berbagi, memakai atau membuat sesi browser, lalu membuka
                    hasil. Bahan mengikuti pemeriksaan, AI, penggunaan hasil
                    sebelumnya, dan waktu penyimpanan yang sama.
                  </p>
                </article>
                <article>
                  <span>Ekstensi browser</span>
                  <h3>Kode akses hanya ditampilkan sekali.</h3>
                  <p>
                    Kode acak diawali <code>akx_</code>. Server menyimpan penanda
                    kode, nama perangkat, serta waktu dibuat, terakhir dipakai,
                    dicabut, dan kedaluwarsa. Kode asli disimpan oleh ekstensi di
                    browser dan dikirim saat kamu memeriksa teks atau tautan.
                  </p>
                  <p>
                    Kode akses dapat dicabut dari browser yang membuatnya. Jika
                    cookie sesi hilang, tampilan saat ini belum menyediakan cara
                    lain untuk mencabut kode lama.
                  </p>
                </article>
              </div>
            </section>

            <section id="sumber-dan-log" className={styles.section}>
              <SectionHeading
                number="07"
                title="Sumber luar hanya dibuka saat kamu memilihnya."
                lead="Materi belajar disimpan sebagai daftar di AmanKlik. Situs lain baru menerima kunjungan ketika kamu membuka tautannya sendiri."
              />
              <div className={styles.splitColumns}>
                <div>
                  <h3>Sumber yang dikurasi</h3>
                  <p>
                    Katalog saat audit memuat materi OJK dan IASC, Bank
                    Indonesia, Komdigi, serta Bantuan Akun Google. Alamat situs
                    diperiksa melalui pengujian atau daftar sumber yang
                    diizinkan. Daftar materi memakai informasi yang sudah
                    disimpan di proyek AmanKlik.
                  </p>
                  <p>
                    Tautan dibuka di tab baru tanpa referrer dari komponen produk.
                    Setelah dibuka, kebijakan privasi situs tujuan berlaku.
                  </p>
                  <div className={styles.sourceLinks}>
                    <Link href="/learn">Baca materi yang dikurasi</Link>
                    <a
                      href="https://iasc.ojk.go.id/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Buka situs IASC ↗
                    </a>
                  </div>
                </div>
                <div>
                  <h3>Catatan gangguan aplikasi</h3>
                  <p>
                    Catatan AmanKlik menyimpan tingkat gangguan, bagian yang
                    terganggu, jenis dan kode kesalahan, apakah proses dapat
                    dicoba lagi, serta waktu kejadian. Catatan itu tidak
                    memasukkan isi pesan, rincian kode kesalahan, tautan, nomor
                    sesi, kode akses, tangkapan layar, atau kutipan bukti.
                  </p>
                  <p>
                    Proyek tidak memasang alat analitik atau pemantauan tambahan.
                    Hal ini tidak membuktikan apa yang dicatat oleh layanan
                    hosting, penghubung jaringan, basis data, browser, atau Google; pengaturan
                    dan masa simpan mereka belum diperiksa.
                  </p>
                </div>
              </div>
            </section>

            <section id="kontrol" className={styles.section}>
              <SectionHeading
                number="08"
                title="Lihat apa yang bisa dan belum bisa kamu kendalikan."
                lead="Bagian ini menjelaskan kemampuan AmanKlik saat ini tanpa membuat janji yang belum tersedia."
              />
              <div className={styles.controlGrid}>
                <div>
                  <p className="product-eyebrow text-safe">Tersedia sekarang</p>
                  <ul>
                    <li>Memilih bahan yang akan dikirim dan menghapus rahasia sebelum diperiksa.</li>
                    <li>Menyalin atau mencetak ringkasan yang tidak menyertakan cuplikan isi dan kutipan bukti.</li>
                    <li>Mencabut kode akses ekstensi dari browser yang membuatnya.</li>
                    <li>Menghapus cookie atau data ekstensi dari browser untuk memutus akses di perangkat.</li>
                  </ul>
                </div>
                <div>
                  <p className="product-eyebrow text-risk">Belum tersedia</p>
                  <ul>
                    <li>Tombol untuk menghapus seluruh hasil, perbandingan, tanggapan, kemajuan latihan, dan data sesi di server.</li>
                    <li>Ekspor lengkap seluruh data sesi atau pemulihan sesi setelah cookie hilang.</li>
                    <li>Jaminan bahwa menghapus cookie juga menghapus data di server.</li>
                    <li>Pilihan untuk menjalankan pemeriksaan tanpa AI.</li>
                  </ul>
                </div>
              </div>
              <div className={styles.limitBand}>
                <p className="product-eyebrow">Batas layanan</p>
                <h3>AmanKlik menunjukkan tanda bahaya, bukan mengambil tindakan.</h3>
                <p>
                  AmanKlik tidak membuka tautan, mengikuti pengalihan, mencari
                  informasi jaringan situs, atau mengambil gambar situs tujuan. AmanKlik
                  tidak menghubungi bank, polisi, platform, atau keluarga; tidak
                  masuk ke akun; tidak memindahkan uang; tidak membuat laporan;
                  dan tidak menjamin skor, keamanan, pemulihan, atau hasil hukum.
                </p>
              </div>
            </section>

            <section id="status-draf" className={styles.section}>
              <SectionHeading
                number="09"
                title="Mengapa halaman ini masih berupa draf."
                lead="Kode menjelaskan cara kerja aplikasi, tetapi kebijakan resmi membutuhkan fakta operasional dan persetujuan di luar proyek kode."
              />
              <div className={styles.blockerList}>
                <p>Hal-hal berikut belum dapat dijanjikan oleh halaman ini:</p>
                <ol>
                  <li>Identitas badan hukum, alamat, kontak privasi, penanggung jawab data, wilayah hukum, dasar hukum, dan cara mengajukan keluhan.</li>
                  <li>Lokasi server, pengaturan layanan yang sedang dipakai, lama penyimpanan catatan akses dan salinan cadangan, serta cara menghapus data dari infrastruktur.</li>
                  <li>Lama penyimpanan, penggunaan untuk pelatihan, pihak lain yang membantu, wilayah pemrosesan, dan penghapusan data di Google.</li>
                  <li>Satu masa simpan untuk seluruh jenis data atau fitur hapus mandiri yang belum tersedia.</li>
                </ol>
              </div>
              <p>
                Karena itu halaman ini tidak ditampilkan di mesin pencari.
                Statusnya baru dapat berubah setelah pengaturan layanan
                diperiksa, aturan penyimpanan dan kendali pengguna diputuskan,
                serta pemilik kebijakan menyetujui isi akhir.
              </p>
              <div className={styles.closing}>
                <div>
                  <p className="product-eyebrow">{DOCUMENT_VERSION}</p>
                  <h3>Berhenti sejenak sebelum mengirim data sensitif.</h3>
                  <p>
                    Hapus rahasia yang tidak diperlukan. Jika cukup, periksa
                    pola pesannya sebagai teks tanpa menyertakan identitas.
                  </p>
                </div>
                <div className={styles.closingActions}>
                  <Link className="product-button product-button--primary" href="/scan">
                    Mulai periksa
                  </Link>
                  <Link className="product-button product-button--secondary" href="/">
                    Kembali ke beranda
                  </Link>
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    </PageFrame>
  );
}

function SectionHeading({
  number,
  title,
  lead,
  inverse = false,
}: {
  number: string;
  title: string;
  lead: string;
  inverse?: boolean;
}) {
  return (
    <header className={styles.sectionHeading}>
      <p className={`product-eyebrow ${inverse ? styles.inverseEyebrow : "text-ai"}`}>
        {number} / Privasi
      </p>
      <h2>{title}</h2>
      <p>{lead}</p>
    </header>
  );
}

function FactRow({ term, detail }: { term: string; detail: string }) {
  return (
    <article>
      <h3>{term}</h3>
      <p>{detail}</p>
    </article>
  );
}

function StorageRow({ term, detail }: { term: string; detail: string }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{detail}</dd>
    </div>
  );
}
