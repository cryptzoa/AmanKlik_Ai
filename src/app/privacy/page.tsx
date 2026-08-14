import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privasi — Draf teknis AmanKlik AI",
  description:
    "Penjelasan teknis tentang pemrosesan data AmanKlik AI yang belum disetujui sebagai kebijakan privasi publik.",
  robots: {
    index: false,
    follow: false,
  },
};

const DOCUMENT_VERSION = "Draf teknis 0.1";
const AUDIT_DATE = "14 Agustus 2026";

const contents = [
  ["01", "Data yang masuk", "data-yang-masuk"],
  ["02", "Aliran dan batas sistem", "aliran-data"],
  ["03", "AI dan mode analisis", "ai-dan-mode"],
  ["04", "Penyimpanan dan retensi", "penyimpanan"],
  ["05", "Sesi dan pencocokan", "sesi"],
  ["06", "Screenshot, berbagi, extension", "kanal-tambahan"],
  ["07", "Sumber dan pencatatan error", "sumber-dan-log"],
  ["08", "Kontrol dan batas layanan", "kontrol"],
  ["09", "Status draf", "status-draf"],
] as const;

const flow = [
  {
    index: "A",
    title: "Browser atau extension",
    body: "Kamu memilih pesan, URL, percakapan, atau screenshot. Cookie sesi atau bearer token menghubungkan permintaan dengan sesi anonim.",
  },
  {
    index: "B",
    title: "Server AmanKlik",
    body: "Server memvalidasi ukuran dan format, menjalankan aturan deterministik, membuat fingerprint HMAC, serta menyusun hasil.",
  },
  {
    index: "C",
    title: "Google Gemini, bila digunakan",
    body: "Pada analisis AI live yang bukan cache hit, teks yang dinormalisasi, percakapan, atau gambar yang sudah diproses dapat dikirim ke Gemini.",
  },
  {
    index: "D",
    title: "Penyimpanan aplikasi",
    body: "PostgreSQL menyimpan fingerprint, preview yang dimasking, hasil turunan, metadata analisis, dan waktu kedaluwarsa—bukan kolom input mentah atau blob screenshot asli.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <PageFrame>
      <div className={styles.page}>
        <RouteIntro
          eyebrow="Privasi / Draf teknis"
          title="Apa yang terjadi pada data yang kamu kirim."
          description="Halaman ini menerjemahkan perilaku yang dapat dibuktikan dari kode AmanKlik. Ini belum menjadi kebijakan privasi publik dan belum memuat klaim hukum atau operasional yang belum diverifikasi."
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
                <dt>Tanggal audit teknis</dt>
                <dd>{AUDIT_DATE}</dd>
              </div>
            </dl>
          )}
          pattern="reading"
        >
          <p>
            Tidak untuk diindeks · Dapat dibaca dan dicetak tanpa JavaScript
          </p>
        </RouteIntro>

        <section className={styles.summary} aria-labelledby="summary-title">
          <div className={`product-container ${styles.summaryInner}`}>
            <div className={styles.summaryHeading}>
              <p className="product-eyebrow text-ai">Ringkasan awal</p>
              <h2 id="summary-title">Tiga hal sebelum kamu memeriksa sesuatu.</h2>
            </div>
            <div className={styles.summaryGrid}>
              <article>
                <span>01</span>
                <h3>Yang diproses</h3>
                <p>
                  Isi yang kamu pilih—pesan, URL, screenshot, atau rangkaian
                  percakapan—beserta metadata teknis untuk sesi, rate limit,
                  dan hasil analisis.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Yang tidak diminta</h3>
                <p>
                  AmanKlik tidak menyediakan akun pengguna dan tidak
                  memerlukan nama, email, password, PIN, atau OTP untuk masuk.
                  Jangan sengaja menyertakan rahasia itu dalam materi scan.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Kontrol yang tersedia</h3>
                <p>
                  Kamu memilih materi yang dikirim, dapat menyalin ringkasan
                  aman, dan dapat mencabut token extension dari sesi penerbit.
                  Belum ada tombol untuk menghapus seluruh data sesi.
                </p>
              </article>
            </div>
            <div className={styles.draftNotice} role="note">
              <strong>Draf ini sengaja belum menyebut masa retensi final.</strong>
              <p>
                Kode memiliki nilai bawaan dan mekanisme kedaluwarsa, tetapi
                konfigurasi deployment, backup, serta kebijakan provider belum
                diverifikasi sebagai komitmen publik.
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
                lead="Scanner menerima empat jenis materi. Setiap jenis dibatasi dan divalidasi di server sebelum dianalisis."
              />
              <div className={styles.factRows}>
                <FactRow
                  term="Pesan"
                  detail="Teks sepanjang 8–8.000 karakter. Spasi dan bentuk Unicode dinormalisasi sebelum aturan, fingerprint, dan analisis dijalankan."
                />
                <FactRow
                  term="URL"
                  detail="Alamat sepanjang maksimal 2.048 karakter dan hanya protokol HTTP atau HTTPS. Analyzer membaca struktur domain secara statis; ia tidak membuka situs tujuan."
                />
                <FactRow
                  term="Percakapan"
                  detail="Dua sampai dua belas pesan berurutan, maksimal 4.000 karakter per pesan dan 16.000 karakter secara keseluruhan."
                />
                <FactRow
                  term="Screenshot"
                  detail="PNG, JPEG, atau WebP yang lolos pemeriksaan signature file, dengan batas bawaan 5 MiB dan 40 juta piksel."
                />
              </div>
              <div className={styles.inlineNote}>
                <p>
                  Redaction aplikasi menutupi pola tertentu—email, nomor HP
                  Indonesia, rangkaian angka panjang, dan kode OTP dalam
                  konteks tertentu. Redaction ini bukan anonimisasi lengkap:
                  nama, alamat, URL, atau data lain yang tidak cocok dengan pola
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
                title="Empat batas yang dilalui data."
                lead="Jalur ke provider AI bersifat kondisional. Jalur ke penyimpanan menyimpan hasil turunan dan metadata, bukan sebuah salinan file screenshot asli."
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
                Tautan sumber resmi berada di luar aliran ini. Server tidak
                membuka sumber tersebut saat scan; browser baru mengunjungi
                situs eksternal ketika kamu memilih tautannya.
              </p>
            </section>

            <section id="ai-dan-mode" className={styles.section}>
              <SectionHeading
                number="03"
                title="AI bukan satu-satunya lapisan analisis."
                lead="AmanKlik memisahkan aturan deterministik, pemeriksaan struktur URL, cache, dan konteks AI. Skor akhir dihitung oleh aplikasi, bukan ditentukan langsung oleh model."
              />
              <div className={styles.modeGrid}>
                <article>
                  <p>Hybrid</p>
                  <h3>Gemini memberi konteks; aplikasi menghitung skor.</h3>
                  <span>
                    Dalam mode live, teks yang dinormalisasi, percakapan, atau
                    gambar yang sudah diproses dapat dikirim ke Google Gemini.
                    Model utama dan fallback dapat diubah melalui konfigurasi.
                  </span>
                </article>
                <article>
                  <p>Cached hybrid</p>
                  <h3>Hasil AI sebelumnya dipakai kembali.</h3>
                  <span>
                    Jika fingerprint yang sama masih memiliki cache valid,
                    permintaan itu tidak menjalankan panggilan analisis Gemini
                    utama lagi. Hasil mendapat ID scan baru untuk sesi aktif.
                  </span>
                </article>
                <article>
                  <p>Rules only</p>
                  <h3>Hasil hanya memakai sinyal deterministik yang tersedia.</h3>
                  <span>
                    Label ini tidak membuktikan bahwa data tidak pernah mencapai
                    provider. Pada pesan, URL, atau percakapan, mode ini dapat
                    muncul setelah percobaan AI gagal.
                  </span>
                </article>
              </div>
              <p>
                Pada panggilan analisis utama, masking kutipan bukti dilakukan
                setelah respons AI diparse—bukan sebelum materi dikirim ke
                Gemini. Karena itu, hapus rahasia dari input sebelum scan.
              </p>
              <p>
                Pencarian pengetahuan juga dapat memakai embedding Gemini bila
                deployment membangun index embedding. Query untuk jalur itu
                dimasking dengan redaction yang sama dan dipotong hingga 1.500
                karakter. Index yang tersimpan di repository saat audit ini
                memakai pencarian keyword lokal, tetapi hasil build deployment
                belum dikonfirmasi.
              </p>
              <div className={styles.warningNote} role="note">
                <strong>Batas klaim provider</strong>
                <p>
                  Kode tidak menentukan wilayah pemrosesan, masa simpan di
                  Google, penggunaan untuk pelatihan, subprocessor, atau
                  mekanisme penghapusan provider. Draf ini tidak membuat janji
                  tentang hal-hal tersebut.
                </p>
              </div>
            </section>

            <section id="penyimpanan" className={styles.section}>
              <SectionHeading
                number="04"
                title="Yang disimpan lebih luas dari sebuah fingerprint."
                lead="Input mentah tidak memiliki kolom khusus, tetapi database menyimpan hasil turunan yang dapat memuat kutipan yang sudah dimasking serta metadata sesi."
              />
              <dl className={styles.storageList}>
                <StorageRow
                  term="Hasil scan"
                  detail="ID scan dan sesi, jenis input, fingerprint HMAC, preview yang dimasking, skor, tingkat risiko, mode analisis, status AI/cache, ID model, latensi provider, hasil turunan, serta waktu dibuat dan kedaluwarsa."
                />
                <StorageRow
                  term="Cache bersama"
                  detail="Fingerprint, jenis input, seluruh hasil turunan, ID model, mode, dan waktu kedaluwarsa. Cache tidak terikat ke satu sesi dan dapat dipakai kembali untuk input yang sama."
                />
                <StorageRow
                  term="Fitur lanjutan"
                  detail="Komentar feedback, judul dan ringkasan kasus investigasi, hubungan antar-scan, serta status checklist tindakan dapat masuk ke database."
                />
                <StorageRow
                  term="Metadata keamanan"
                  detail="Token extension disimpan sebagai HMAC beserta nama perangkat dan timestamp. Rate limit menyimpan fingerprint subjek dan, bila tersedia, fingerprint alamat jaringan—bukan alamat mentah pada tabel aplikasi."
                />
              </dl>
              <div className={styles.retentionBlock}>
                <p className="product-eyebrow">Retensi yang dapat dibuktikan</p>
                <div>
                  <h3>Nilai bawaan scan dan cache adalah 24 jam.</h3>
                  <p>
                    Deployment dapat mengubah nilai itu. Setelah kedaluwarsa,
                    record tidak dikembalikan oleh query aplikasi. Penghapusan
                    fisik berjalan secara oportunistik ketika scan berikutnya
                    disimpan, dengan jeda pemeriksaan minimal 15 menit per
                    proses—bukan tepat pada detik kedaluwarsa.
                  </p>
                </div>
                <div>
                  <h3>Tidak semua tabel mengikuti waktu itu.</h3>
                  <p>
                    Kasus investigasi belum memiliki waktu kedaluwarsa atau
                    tombol hapus. Token berhenti valid setelah 90 hari atau saat
                    dicabut, tetapi record token yang kedaluwarsa atau dicabut
                    tidak dihapus secara otomatis oleh kode aplikasi saat ini.
                  </p>
                </div>
              </div>
            </section>

            <section id="sesi" className={styles.section}>
              <SectionHeading
                number="05"
                title="Sesi anonim adalah pengikat akses, bukan identitas akun."
                lead="AmanKlik tidak mempunyai alur daftar atau masuk. Sebuah UUID acak di cookie menghubungkan browser dengan hasil miliknya."
              />
              <div className={styles.sessionGrid}>
                <div>
                  <p className="product-eyebrow">Cookie</p>
                  <h3><code>amanklik_sid</code></h3>
                  <p>
                    Cookie berlaku 30 hari, tidak dapat dibaca JavaScript
                    aplikasi karena <code>HttpOnly</code>, memakai
                    <code>SameSite=Lax</code>, berlaku di seluruh path, dan hanya
                    dikirim melalui HTTPS ketika aplikasi berjalan di produksi.
                  </p>
                </div>
                <div>
                  <p className="product-eyebrow">Ownership</p>
                  <h3>Resource asing dan hilang tampak sama.</h3>
                  <p>
                    Hasil, kasus, progres, feedback, dan token dibaca dengan ID
                    sesi aktif. Resource yang tidak ada dan resource milik sesi
                    lain tidak dibedakan kepada pengguna.
                  </p>
                </div>
              </div>
              <p>
                Menghapus cookie membuat browser kehilangan pengikat akses itu,
                tetapi tidak menghapus record server. Karena UUID sesi masih
                tersimpan dalam database selama recordnya ada, istilah
                “anonim” di sini tidak berarti data telah dianonimkan secara
                permanen.
              </p>
              <div className={styles.matchNotice}>
                <span>Ambang privasi: 3 sesi</span>
                <p>
                  Halaman hasil menghitung jumlah sesi berbeda dengan
                  fingerprint input yang sama, hanya untuk scan yang masih
                  aktif dan dibuat dalam jendela paling lama 30 hari. Jumlah
                  tidak ditampilkan sebelum mencapai tiga sesi. Dengan nilai
                  kedaluwarsa bawaan 24 jam, jendela efektifnya lebih pendek
                  daripada 30 hari.
                </p>
              </div>
            </section>

            <section id="kanal-tambahan" className={styles.section}>
              <SectionHeading
                number="06"
                title="Kanal berbeda, pipeline yang sama."
                lead="Screenshot, share target PWA, dan extension masuk ke analyzer yang sama, tetapi masing-masing memiliki detail penyimpanan yang perlu diketahui."
              />
              <div className={styles.channelList}>
                <article>
                  <span>Screenshot</span>
                  <h3>File diputar, diperkecil, lalu di-encode ulang.</h3>
                  <p>
                    Dimensi maksimum hasil adalah 1.600 × 1.600 tanpa
                    memperbesar gambar kecil. Kode aplikasi tidak menyimpan blob
                    file asli maupun blob hasil proses di database. Gambar hasil
                    proses dapat dikirim ke Gemini, dan teks yang diekstrak serta
                    bukti turunannya dapat disimpan setelah redaction.
                  </p>
                </article>
                <article>
                  <span>Share target PWA</span>
                  <h3>Memilih AmanKlik di menu berbagi langsung memulai scan.</h3>
                  <p>
                    Sistem menerima judul, teks, URL, atau gambar dari share
                    sheet, memakai atau membuat sesi anonim, lalu mengarahkan ke
                    hasil. Materi mengikuti validasi, AI, cache, dan retensi yang
                    sama seperti scanner.
                  </p>
                </article>
                <article>
                  <span>Extension</span>
                  <h3>Bearer token ditampilkan sekali oleh server.</h3>
                  <p>
                    Token acak diawali <code>akx_</code>. Server menyimpan HMAC,
                    nama perangkat, waktu dibuat, terakhir dipakai, dicabut, dan
                    kedaluwarsa. Nilai mentah disimpan oleh extension di
                    <code>chrome.storage.local</code> dan dikirim pada header
                    Authorization saat kamu menjalankan scan teks atau URL.
                  </p>
                  <p>
                    Token dapat dicabut dari sesi browser yang menerbitkannya.
                    Jika cookie sesi itu hilang, UI saat ini tidak menyediakan
                    jalur kepemilikan alternatif untuk mencabut token lama.
                  </p>
                </article>
              </div>
            </section>

            <section id="sumber-dan-log" className={styles.section}>
              <SectionHeading
                number="07"
                title="Sumber eksternal dan log memiliki batas terpisah."
                lead="Materi edukasi disimpan sebagai katalog lokal. Situs eksternal hanya menerima kunjungan ketika kamu sendiri membuka tautannya."
              />
              <div className={styles.splitColumns}>
                <div>
                  <h3>Sumber yang dikurasi</h3>
                  <p>
                    Katalog saat audit memuat materi OJK dan IASC, Bank
                    Indonesia, Komdigi, serta Google Account Help. Daftar host
                    diperiksa oleh test atau allowlist fitur terkait; builder
                    index pengetahuan sendiri mempercayai metadata yang sudah
                    masuk repository.
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
                  <h3>Log error aplikasi</h3>
                  <p>
                    Logger permintaan yang dibuat AmanKlik mencatat level,
                    konteks bernama, nama kelas error, kode, status dapat dicoba
                    lagi, dan timestamp. Logger itu tidak memasukkan message
                    error, stack, input, URL, ID sesi, token, screenshot, atau
                    kutipan bukti.
                  </p>
                  <p>
                    Repository tidak mendeklarasikan SDK analytics atau
                    telemetry. Hal ini tidak membuktikan apa yang dicatat oleh
                    hosting, proxy, database, browser, atau Google; konfigurasi
                    dan masa simpan mereka belum diverifikasi.
                  </p>
                </div>
              </div>
            </section>

            <section id="kontrol" className={styles.section}>
              <SectionHeading
                number="08"
                title="Kontrol yang ada harus dibedakan dari yang belum ada."
                lead="Draf ini tidak mengubah keterbatasan produk menjadi janji."
              />
              <div className={styles.controlGrid}>
                <div>
                  <p className="product-eyebrow text-safe">Tersedia sekarang</p>
                  <ul>
                    <li>Memilih materi yang akan dikirim dan menghapus rahasia sebelum scan.</li>
                    <li>Menyalin atau mencetak ringkasan turunan yang tidak menyertakan preview dan kutipan bukti.</li>
                    <li>Mencabut token extension dari sesi browser penerbit.</li>
                    <li>Menghapus cookie atau data extension dari browser untuk memutus akses lokal.</li>
                  </ul>
                </div>
                <div>
                  <p className="product-eyebrow text-risk">Belum tersedia</p>
                  <ul>
                    <li>Tombol untuk menghapus seluruh scan, kasus, feedback, progres, dan record sesi di server.</li>
                    <li>Ekspor lengkap seluruh data sesi atau pemulihan sesi setelah cookie hilang.</li>
                    <li>Jaminan bahwa menghapus cookie juga menghapus record server.</li>
                    <li>Pilihan pengguna untuk memaksa mode tanpa AI pada scanner live.</li>
                  </ul>
                </div>
              </div>
              <div className={styles.limitBand}>
                <p className="product-eyebrow">Batas layanan</p>
                <h3>AmanKlik menilai indikator; AmanKlik tidak menjalankan tindakan.</h3>
                <p>
                  Analyzer URL tidak membuka, mengikuti redirect, melakukan DNS
                  probe, atau mengambil screenshot situs yang dikirim. AmanKlik
                  tidak menghubungi bank, polisi, platform, atau keluarga; tidak
                  masuk ke akun; tidak memindahkan uang; tidak membuat laporan;
                  dan tidak menjamin skor, keamanan, pemulihan, atau hasil hukum.
                </p>
              </div>
            </section>

            <section id="status-draf" className={styles.section}>
              <SectionHeading
                number="09"
                title="Mengapa halaman ini masih berstatus draf."
                lead="Kode menjelaskan mekanisme teknis, tetapi kebijakan publik membutuhkan fakta operasional dan persetujuan yang berada di luar repository."
              />
              <div className={styles.blockerList}>
                <p>Hal-hal berikut belum dapat dijanjikan oleh halaman ini:</p>
                <ol>
                  <li>Identitas badan hukum, alamat, kontak privasi, DPO, yurisdiksi, dasar hukum, atau mekanisme pengaduan.</li>
                  <li>Region deployment, konfigurasi produksi aktual, retensi access log, backup, snapshot, dan prosedur penghapusan infrastruktur.</li>
                  <li>Retensi, pelatihan, subprocessor, wilayah pemrosesan, dan penghapusan data di Google.</li>
                  <li>Masa retensi tunggal untuk seluruh tabel atau mekanisme penghapusan mandiri yang belum tersedia di produk.</li>
                </ol>
              </div>
              <p>
                Karena itu halaman ini diberi instruksi <code>noindex</code> dan
                <code>nofollow</code>. Status baru dapat berubah setelah fakta
                deployment diverifikasi, gap retensi dan kontrol diputuskan,
                serta pemilik kebijakan menyetujui isi final.
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
                    Buka scanner
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
