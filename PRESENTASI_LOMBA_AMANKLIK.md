# AmanKlik AI — Master Brief Presentasi Lomba

## Status dokumen

- Versi: 2.0
- Format: presentasi 16:9
- Durasi total: 10 menit termasuk tanya jawab
- Target presentasi dan demo: 6 menit 30 detik
- Target tanya jawab: 3 menit 30 detik
- Slide utama: 7
- Appendix Q&A: maksimal 3
- Bahasa: Indonesia
- Skenario demo: `T2 — Ancaman + permintaan OTP`
- Status Canva: belum dibuat ulang

## Perubahan strategi versi 2

Kerangka `SOCIAL` tetap dipakai untuk membuka presentasi, tetapi disampaikan secara verbal selama homepage AmanKlik tampil. Tidak ada slide khusus untuk Story, Observation, Connection, Insight, atau Agenda.

Seluruh slide dialokasikan untuk materi yang langsung menghasilkan poin penilaian:

1. Product thesis.
2. Live demo.
3. Alasan desain UI/UX.
4. Kedalaman fungsionalitas.
5. Kreativitas dan arsitektur analisis.
6. Kualitas kode dan trust engineering.
7. Lesson dan closing.

## Hasil yang harus tertanam di benak juri

Setelah presentasi, juri harus dapat mengulang tiga kalimat ini:

1. AmanKlik menjelaskan risiko, bukan hanya memberi label.
2. Skor AmanKlik dihitung oleh application code dari beberapa lapisan sinyal, bukan disalin dari model AI.
3. AmanKlik membawa pengguna dari rasa curiga menuju tindakan aman.

## Kalimat inti

> AmanKlik mengubah rasa curiga menjadi bukti yang dapat dipahami dan tindakan yang dapat dilakukan.

---

# Struktur waktu

| Waktu | Bagian | Pemilik | Tujuan |
|---|---|---|---|
| 00:00–00:35 | Opening SOCIAL verbal | Presenter utama | Membangun konteks tanpa slide |
| 00:35–00:55 | Slide 1 — Product thesis | Presenter utama | Mendefinisikan AmanKlik |
| 00:55–01:05 | Slide 2 — Demo bridge | Presenter utama | Handoff ke demo |
| 01:05–03:45 | Live demo | Demo operator | Membuktikan workflow utama |
| 03:45–04:20 | Slide 3 — UX reasoning | Presenter utama | Membuktikan kualitas UI/UX |
| 04:20–04:55 | Slide 4 — Functional journey | Presenter utama | Membuktikan kedalaman fungsi |
| 04:55–05:35 | Slide 5 — Analysis architecture | Technical lead | Membuktikan inovasi |
| 05:35–06:10 | Slide 6 — Trust engineering | Technical lead | Membuktikan kualitas kode |
| 06:10–06:30 | Slide 7 — Lesson | Presenter utama | Mengunci pesan akhir |
| 06:30–10:00 | Tanya jawab | Seluruh tim | Menjawab sesuai domain |

## Batas keras

- Opening verbal selesai maksimal detik ke-35.
- Demo selesai maksimal menit 3:45.
- Slide 6 selesai maksimal menit 6:10.
- Closing tidak boleh melewati menit 6:30.
- Jangan mencuri waktu Q&A untuk menampilkan fitur tambahan.

---

# Opening SOCIAL tanpa slide

## Tampilan layar

- Homepage AmanKlik berada pada posisi hero.
- Tidak ada scrolling selama opening.
- Cursor disembunyikan dari area headline.
- Jangan menampilkan slide berlabel `S`, `O`, `C`, `I`, atau `A`.

## Script 35 detik

### Story

> Bayangkan pesan ini masuk ketika kita sedang sibuk: “Akun Anda akan dibatasi hari ini. Balas dengan kode OTP yang baru dikirim.”

### Observation

> Pesannya terasa resmi dan mendesak. Banyak orang mungkin curiga, tetapi belum tentu tahu bagian mana yang berbahaya.

### Connection

> Kalau pesan ini masuk ke orang tua atau keluarga kita, apakah mereka tahu apa yang harus diperiksa dan dilakukan?

### Insight

> Karena itu, pengguna tidak hanya membutuhkan vonis. Mereka membutuhkan alasan.

### Agenda

> Kami akan menunjukkan bagaimana AmanKlik mengubah pesan mencurigakan menjadi bukti dan tindakan aman.

## Delivery

- Jangan menyebut nama framework `SOCIAL` kepada juri.
- Jangan berhenti di antara setiap bagian seolah sedang membaca rumus.
- Seluruh script harus terdengar sebagai satu cerita alami.
- Setelah kalimat agenda, langsung buka slide 1.

---

# Pembagian peran

- `[PRESENTER UTAMA]`: opening, slide 1–4, handoff, dan closing.
- `[DEMO OPERATOR]`: live demo dan recovery jika terjadi kendala.
- `[TECHNICAL LEAD]`: slide 5–6 dan pertanyaan teknis.
- `[TIMEKEEPER]`: memberi sinyal senyap pada 03:30, 05:30, dan 06:15.

Hanya gunakan dua handoff verbal:

1. Presenter utama ke demo operator pada slide 2.
2. Technical lead ke presenter utama sebelum slide 7.

---

# Sistem visual

## Konsep

`Calm Threat Intelligence`

Deck harus terasa seperti alat bantu mengambil keputusan: tenang, editorial, presisi, dan defensif. Visual tidak boleh menggunakan stereotip hacker atau dekorasi cyber generik.

## Palet

| Peran | Warna |
|---|---|
| Canvas | `#F7F6F2` |
| Surface | `#FFFEFA` |
| Ink | `#111111` |
| Muted | `#6F6C65` |
| AI | `#635BFF` |
| AI soft | `#EBE9FF` |
| Risk | `#E9362F` |
| Risk soft | `#FFE4E1` |
| Safe | `#087F5B` |
| Dark | `#0B0B0B` |

## Tipografi

- Display dan body: Manrope.
- Label, angka, dan metadata: IBM Plex Mono.
- Headline: 64–88 pt.
- Body: minimal 28 pt.
- Label: minimal 18 pt.
- Maksimal dua keluarga font.
- Maksimal dua weight dominan per slide.

## Grid

- Canvas: 1920 × 1080.
- Safe area: 120 px dari setiap sisi.
- Grid: 12 kolom.
- Maksimal dua area informasi dominan.
- Maksimal 35 kata terlihat per slide, kecuali slide 6.
- Gunakan ruang kosong sebagai bagian dari hierarki.

## Motif kontinuitas

Gunakan satu garis sinyal tipis sebagai penghubung konseptual:

`INPUT → SINYAL → BUKTI → KEPUTUSAN → TINDAKAN`

Garis tidak perlu dianimasikan secara kompleks. Posisi masuk dan keluarnya cukup konsisten agar deck terasa sebagai satu sistem.

## Larangan

Jangan gunakan:

- ilustrasi AI abstrak;
- percakapan berbahasa Inggris;
- chart dengan angka atau unit yang tidak berhubungan;
- stock photo hacker, hoodie, gembok, atau kode hijau;
- gradient blob generik;
- glassmorphism;
- kumpulan kartu pada setiap slide;
- screenshot kode sumber;
- nama atau logo template lain;
- statistik tanpa sumber resmi;
- teks di bawah 18 pt;
- elemen yang terpotong sebagai gaya dekoratif.

## Aset wajib

1. Screenshot fixture `public/demo/otp-verification.png`.
2. Screenshot hasil analisis T2 dari build final.
3. Screenshot atau crop asli dari result page untuk slide 3.
4. Diagram pipeline yang dibuat dari bentuk Canva sederhana.
5. Wordmark atau logo AmanKlik.

Semua contoh harus sintetis. Jangan menampilkan OTP, identitas, nomor rekening, atau URL berbahaya sungguhan.

---

# Slide 1 — Product thesis

## Tujuan penilaian

Memperjelas proposisi produk setelah juri memahami masalah melalui opening verbal.

## Label

`AMAN KLIK AI / PRODUCT THESIS`

## Headline

> Dari rasa curiga menjadi keputusan aman.

## Supporting line

> AmanKlik menjelaskan pola manipulasi, struktur tautan, dan konteks pesan sebelum pengguna mengeklik, membalas, atau mengirim uang.

## Tiga kata kerja

`KENALI → PAHAMI → BERTINDAK`

## Komposisi

- Latar canvas terang.
- Headline menempati sekitar 60% lebar slide.
- Tiga kata kerja membentuk garis sinyal di bagian bawah.
- Potongan screenshot hasil AmanKlik berada di sisi kanan, bukan ilustrasi AI.
- Gunakan satu aksen violet dan satu endpoint safe green.

## Speaker script

> AmanKlik adalah digital safety companion yang membawa pengguna melalui tiga tahap: mengenali sinyal, memahami alasannya, lalu menentukan tindakan yang lebih aman.

## Durasi

20 detik.

## Kriteria lolos

- Juri memahami produk tanpa daftar fitur.
- Slide tidak mengulang opening.
- Screenshot yang tampil berasal dari aplikasi sebenarnya.

---

# Slide 2 — Demo bridge

## Tujuan penilaian

Menyiapkan juri untuk menilai fungsi produk melalui satu workflow yang utuh.

## Label

`LIVE DEMO`

## Headline

> Satu pesan. Satu alur utuh.

## Empat checkpoint

1. `MASUKKAN` — screenshot sintetis.
2. `ANALISIS` — pola dan konteks.
3. `JELASKAN` — skor dan bukti.
4. `BERTINDAK` — langkah aman.

## Caption

> Dari input sampai rekomendasi, tanpa membuka tautan tujuan.

## Komposisi

- Latar gelap.
- Empat checkpoint berada pada satu jalur, bukan empat kartu.
- Checkpoint pertama aktif ketika slide tampil.
- Slide tetap dapat menjelaskan alur jika deployment gagal.

## Speaker script

> Kami tidak akan berkeliling seluruh menu. Kami akan mengikuti satu pesan dari input pertama sampai rekomendasi akhirnya.

## Handoff

> Selanjutnya, rekan saya akan menunjukkan alurnya secara langsung.

## Durasi

10 detik.

---

# Live demo

## Persiapan

1. Tab pertama: `/scan` pada deployment final.
2. Tab kedua: hasil T2 yang sudah dipanaskan sebagai backup.
3. Tab ketiga: deck.
4. Zoom browser 100%.
5. Bookmark bar, notifikasi, dan tab pribadi ditutup.
6. Gunakan data sintetis saja.
7. Jangan login ke akun pribadi ketika tampil.

## Golden path

### 1. Masukkan screenshot

- Pilih mode screenshot.
- Pilih fixture `IMG_T2 — Screenshot permintaan OTP`.
- Jangan membuka file picker ketika berada di panggung.

Narasi:

> Pengguna dapat memeriksa screenshot tanpa perlu menyalin pesan panjang. Fixture ini sepenuhnya sintetis dan memang disiapkan untuk demo aman.

### 2. Jalankan analisis

Narasi:

> AmanKlik mengekstrak konteks pesan, membaca sinyal deterministik, lalu menggunakan AI sebagai salah satu lapisan—bukan penentu tunggal.

Jangan menjelaskan loading state lebih dari satu kalimat.

### 3. Tunjukkan hasil

Sorot hanya:

1. Level risiko.
2. Bukti ancaman akun.
3. Bukti permintaan OTP.
4. Sumber indikator.
5. Ketidakpastian atau disclaimer.

Narasi:

> AmanKlik tidak berhenti pada skor. Pengguna dapat melihat indikator yang menaikkan risiko, sumber indikatornya, dan batas keyakinan analisis. Risiko rendah pun tidak pernah kami sebut sebagai jaminan aman.

Jangan menghafal angka skor. Sebut angka hanya setelah hasil terlihat.

### 4. Tunjukkan tindakan

Sorot action plan:

> Jangan bagikan OTP. Buka aplikasi resmi secara mandiri dan verifikasi melalui kanal yang sudah dipercaya.

Narasi:

> Bagian terpentingnya adalah tindakan. Pengguna tidak ditinggalkan dengan rasa takut; mereka diberi langkah berikutnya yang aman dan dapat dilakukan.

### Batas demo

- Demo maksimal 2 menit 40 detik.
- Jangan membuka semua menu.
- Jangan membuka history, intelligence, connect, atau investigation.
- Jika masih ada waktu, tampilkan entry point latihan personal maksimal 10 detik tanpa menjalankan skenario.

## Recovery

### Loading lebih dari lima detik

Pindah ke tab hasil yang sudah dipanaskan.

> Untuk menjaga waktu, kami lanjutkan dari hasil analisis yang sudah disiapkan dari input sintetis yang sama.

### Deployment tidak tersedia

Gunakan video lokal maksimal 60 detik atau screenshot berurutan.

### Perangkat bermasalah

Gunakan empat checkpoint pada slide 2 sebagai fallback dan lanjutkan ke slide 3.

Jangan melakukan debugging di depan juri.

---

# Slide 3 — UX reasoning

## Tujuan penilaian

Membuktikan bahwa UI/UX AmanKlik dirancang untuk membantu keputusan, bukan sekadar terlihat menarik.

## Label

`DESIGNING FOR DECISIONS`

## Headline

> Hasil yang dapat dibaca, bukan sekadar skor.

## Reading path

`LEVEL → RINGKASAN → BUKTI → KETIDAKPASTIAN → TINDAKAN`

## Penjelasan singkat

- Level memberi orientasi awal.
- Bukti menjelaskan alasan.
- Ketidakpastian mencegah rasa aman palsu.
- Action plan mengubah hasil menjadi keputusan.

## Komposisi

- Gunakan satu screenshot result page asli berukuran besar.
- Beri empat annotation line langsung pada screenshot.
- Jangan menutup screenshot dengan card tambahan.
- Gunakan risk red hanya untuk risiko dan safe green hanya untuk tindakan.

## Speaker script

> Kami merancang urutan hasil sesuai kebutuhan pengguna ketika sedang cemas. Mereka mendapat orientasi melalui level, memahami alasan melalui bukti, melihat batas analisis melalui uncertainty, lalu diarahkan pada tindakan yang konkret. Jadi UI tidak hanya cantik; hierarkinya membantu pengambilan keputusan.

## Durasi

35 detik.

## Kriteria lolos

- Screenshot aplikasi menjadi fokus utama.
- Annotation terbaca dari jarak tiga meter.
- Alasan setiap keputusan UI dapat dijelaskan.

---

# Slide 4 — Functional journey

## Tujuan penilaian

Menunjukkan kedalaman fungsionalitas tanpa melakukan feature tour.

## Label

`BEYOND DETECTION`

## Headline

> Perlindungan tidak berhenti setelah scan.

## Journey

### 1. Periksa

`Teks · Screenshot · URL · Percakapan`

### 2. Pahami

`Skor · Bukti · Anatomi URL · Kontribusi sinyal`

### 3. Bertindak

`Action plan · Respons insiden · Laporan aman`

### 4. Berlatih

`Simulator · Skenario personal · Transferable rule`

## Supporting line

> Satu alur dari pencegahan, respons, hingga pembentukan kebiasaan.

## Komposisi

- Empat tahap berada pada satu jalur horizontal.
- Setiap tahap memakai satu icon sederhana dan maksimal empat kata pendukung.
- Hindari screenshot kecil yang tidak terbaca.
- Tahap `Bertindak` dan `Berlatih` diberi penekanan untuk menunjukkan bahwa AmanKlik bukan scanner satu kali pakai.

## Speaker script

> Fungsionalitas AmanKlik tidak berhenti setelah deteksi. Pengguna dapat memeriksa berbagai bentuk input, memahami alasan, menerima panduan jika sudah terlanjur bertindak, lalu berlatih melalui skenario yang relevan. Alurnya dirancang untuk membangun kebiasaan, bukan ketergantungan pada satu hasil scan.

## Durasi

35 detik.

## Kriteria lolos

- Juri melihat breadth produk tanpa demo tambahan.
- Setiap fitur dihubungkan dengan outcome pengguna.
- Tidak ada daftar seluruh route aplikasi.

---

# Slide 5 — Analysis architecture

## Tujuan penilaian

Membuktikan kreativitas teknis, explainability, dan perbedaan AmanKlik dari wrapper AI.

## Label

`HOW IT WORKS`

## Headline

> Skornya bukan jawaban model.

## Supporting line

> Skor akhir dihitung oleh application code dari beberapa lapisan sinyal.

## Pipeline

1. `RULES` — pola manipulasi dan permintaan sensitif.
2. `URL` — struktur domain dianalisis secara statis.
3. `AI` — konteks bahasa dan screenshot.
4. `FUSION` — sinyal digabungkan secara deterministik.
5. `RESULT` — skor, bukti, uncertainty, dan tindakan.

## Tiga batas penting

- URL pengguna tidak pernah dibuka atau di-fetch.
- Output AI divalidasi sebelum digunakan.
- Model tidak menentukan skor publik secara langsung.

## Komposisi

- Latar canvas terang.
- Lima node berada pada satu pipeline.
- Node AI menggunakan violet.
- Node result memakai risk red secara terbatas.
- Tiga batas penting berada sebagai footer monospace.
- Tidak ada ilustrasi AI atau diagram 3D.

## Speaker script

> AmanKlik bukan pembungkus satu prompt. Rules membaca pola manipulasi, URL analyzer memeriksa struktur tanpa membuka tujuan, dan AI membantu memahami konteks. Output model divalidasi, lalu application code menggabungkan sinyal secara deterministik dan menghitung hasil akhirnya.

## Durasi

40 detik.

## Kriteria lolos

- Juri non-engineer memahami alurnya.
- Juri teknis melihat batas trust yang jelas.
- Tidak ada klaim bahwa AI selalu benar.

---

# Slide 6 — Trust engineering

## Tujuan penilaian

Mengubah kualitas kode, keamanan, aksesibilitas, dan performa menjadi bukti yang dapat dinilai.

## Label

`TRUST / ENGINEERING`

## Headline

> Produk keamanan harus aman untuk digunakan.

## Evidence ledger

### Privacy

- Screenshot diproses di memory.
- Raw screenshot tidak disimpan.
- Hasil persisten sudah melalui redaction.

### Security

- Input dan output AI divalidasi.
- Rate limiting dan strict CSP.
- Session ownership untuk akses hasil.

### Accessibility and performance

- Navigasi keyboard dan visible focus.
- Reduced motion.
- Native scrolling pada perangkat mobile.

### Verification

- `129` unit tests lulus.
- `41` Chromium E2E tests lulus.
- `0` production dependency vulnerabilities pada audit terakhir.

## Komposisi

- Latar dark `#0B0B0B`.
- Headline di kiri atas.
- Ledger empat baris besar, bukan card grid.
- Angka `129 / 41 / 0` menjadi satu proof block besar di kanan.
- Label unit ditempatkan tepat di bawah masing-masing angka.
- Jangan menggunakan chart karena unit ketiga angka berbeda.
- Jangan menampilkan screenshot kode.

## Speaker script

> Karena AmanKlik menangani konten yang berpotensi sensitif, trust tidak boleh berhenti pada tampilan. Screenshot diproses di memory, URL pengguna tidak dibuka, seluruh input dan output divalidasi, dan hasil dibatasi oleh session ownership. Kami juga memverifikasi alur utama melalui automated testing, accessibility checks, dan audit dependency.

## Durasi

35 detik.

## Sebelum lomba

Jalankan kembali quality gate dan perbarui angka hanya jika hasil final berubah.

## Kriteria lolos

- Tidak ada klaim abstrak seperti `secure` tanpa bukti.
- Angka selalu memiliki label.
- Teks terbaca dari jarak presentasi.

---

# Slide 7 — Lesson and close

## Tujuan penilaian

Menutup cerita dengan satu lesson yang dapat diingat juri.

## Label

`L / LESSON`

## Headline

> Sebelum mengeklik, pahami risikonya.

## Journey

`RASA CURIGA → BUKTI → TINDAKAN AMAN`

## Closing line

> AmanKlik membantu pengguna membangun kebiasaan digital yang lebih aman.

## Komposisi

- Latar canvas terang.
- Potongan fixture OTP yang digunakan saat demo muncul di kiri.
- Garis sinyal menghubungkan ancaman dan OTP ke endpoint safe green.
- Wordmark AmanKlik menjadi elemen terakhir.
- Tidak ada daftar fitur, QR code, atau CTA baru.

## Speaker script

> Pengguna yang awalnya hanya merasa takut sekarang dapat melihat buktinya dan mengetahui tindakan berikutnya. Tujuan kami sederhana: sebelum seseorang mengeklik, membalas, atau mengirim uang, AmanKlik membantu mereka memahami risikonya.

Berhenti satu detik:

> Terima kasih. Kami siap menerima pertanyaan.

## Durasi

20 detik.

## Kriteria lolos

- Closing kembali pada skenario demo.
- Tidak memperkenalkan informasi baru.
- Selesai maksimal menit 6:30.

---

# Appendix Q&A

Appendix tidak dipresentasikan kecuali ada pertanyaan terkait.

## Appendix A — System architecture

Headline:

> Satu aplikasi, batas kepercayaan yang jelas.

Diagram:

`Browser → validation/session → rules + URL analyzer + RAG + Gemini → Zod → risk fusion → redaction → PostgreSQL`

Sorot bahwa Gemini key, database credentials, dan privileged logic hanya berada di server.

## Appendix B — Data boundary

Headline:

> Apa yang diproses, disimpan, dan tidak pernah dilakukan.

- Diproses: teks, URL string, dan screenshot tervalidasi.
- Disimpan: hasil tereduksi, session ownership, dan HMAC input hash.
- Tidak dilakukan: membuka URL, menyimpan raw screenshot, mengekspos secret, atau menampilkan chain-of-thought.

## Appendix C — Limitations

Headline:

> AmanKlik membantu keputusan; bukan pengganti verifikasi resmi.

- Hasil selalu mengandung uncertainty.
- Risiko rendah bukan jaminan aman.
- AI dapat terdegradasi dan deterministic rules tetap berjalan.
- AmanKlik bukan bukti forensik atau penetapan hukum.

---

# Bank jawaban Q&A

## Apa bedanya dengan ChatGPT?

> AmanKlik tidak menyerahkan keputusan akhir kepada satu model. Kami menggabungkan rules, analisis URL statis, konteks AI, schema validation, deterministic risk fusion, redaction, dan action plan. Skor publik dihitung oleh application code melalui safety contract yang spesifik untuk risiko pesan digital.

## Bagaimana jika AI salah?

> AI hanya satu lapisan. Output-nya divalidasi, digabung dengan sinyal deterministik, dan UI selalu menyampaikan uncertainty. Ketika provider AI tidak tersedia, sistem tetap dapat memberikan hasil berbasis rules.

## Apakah AmanKlik membuka URL?

> Tidak. URL dianalisis sebagai string menggunakan parser URL dan struktur domain. AmanKlik tidak melakukan fetch, redirect expansion, preview, atau probing ke alamat tujuan.

## Apakah data pengguna disimpan?

> Raw screenshot tidak disimpan dan diproses di memory. Hasil yang dipersist hanya kontrak hasil yang telah direduksi dan dimiliki oleh anonymous session pengguna. Raw text, raw image, dan query URL sensitif tidak boleh masuk log.

## Mengapa tidak memakai URL reputation API?

> Untuk MVP, kami memilih batas privasi dan arsitektur yang lebih jelas: struktur URL dianalisis tanpa mengirim alamat pengguna ke layanan reputasi tambahan. Trade-off-nya, AmanKlik tidak mengklaim mengetahui reputasi historis setiap domain.

## Bagaimana skor dihitung?

> Rules, struktur URL, dan konteks AI menghasilkan sinyal dengan sumber yang jelas. Application code melakukan deduplikasi dan risk fusion, lalu memetakan hasil ke LOW, MEDIUM, HIGH, atau VERY_HIGH.

## Siapa target pengguna utamanya?

> Pengguna Indonesia yang menerima pesan mencurigakan dan membutuhkan penjelasan sederhana sebelum mengeklik, membalas, atau mengirim uang—termasuk mereka yang belum memahami istilah keamanan digital.

## Apa keterbatasan terbesar saat ini?

> AmanKlik adalah decision-support tool, bukan bukti forensik dan bukan jaminan bahwa pesan pasti aman atau berbahaya. Kualitas analisis konteks juga tetap dipengaruhi kualitas input dan ketersediaan provider AI.

## Apa kontribusi masing-masing anggota?

Setiap anggota menjawab maksimal 20 detik dengan format:

> Saya bertanggung jawab pada [area], mengerjakan [hasil konkret], dan memastikan [quality gate atau outcome].

Jangan menjawab “kami mengerjakan semuanya bersama-sama”.

---

# Checklist produksi Canva

## Sebelum desain

- [ ] Copy versi 2 disetujui tim.
- [ ] Nama dan peran presenter sudah diisi.
- [ ] Screenshot hasil T2 diambil dari build final.
- [ ] Deployment stabil.
- [ ] Angka test diverifikasi ulang.

## Saat desain

- [ ] Buat design baru dari nol.
- [ ] Jangan memakai hasil Canva AI sebelumnya sebagai template.
- [ ] Gunakan 7 slide utama dan maksimal 3 appendix.
- [ ] Gunakan aset produk asli.
- [ ] Terapkan safe area 120 px.
- [ ] Body minimal 28 pt.
- [ ] Semua contoh berbahasa Indonesia.
- [ ] Satu slide memiliki satu takeaway.
- [ ] Slide 3 menggunakan screenshot result asli.
- [ ] Slide 6 tidak memakai chart palsu.

## Setelah desain

- [ ] Periksa fullscreen pada laptop presentasi.
- [ ] Periksa keterbacaan dari jarak tiga meter.
- [ ] Periksa kontras pada brightness rendah.
- [ ] Pastikan tidak ada overflow, typo, atau placeholder.
- [ ] Export PDF sebagai backup.
- [ ] Siapkan video demo offline maksimal 60 detik.
- [ ] Rehearsal minimal lima kali.
- [ ] Tiga rehearsal terakhir selesai maksimal 6:30.

---

# Definition of done

Deck dianggap siap jika:

1. SOCIAL disampaikan verbal maksimal 35 detik tanpa slide khusus.
2. Seluruh tujuh slide menghasilkan poin penilaian.
3. Demo menggunakan satu fixture dan satu workflow.
4. UI/UX dijelaskan melalui keputusan desain, bukan pujian visual.
5. Functional breadth ditunjukkan tanpa feature tour.
6. Arsitektur menjelaskan bahwa skor bukan jawaban model.
7. Quality code dibuktikan melalui boundary dan hasil test.
8. Tidak ada ilustrasi AI, chart palsu, atau placeholder asing.
9. Closing kembali pada skenario demo.
10. Presentasi selesai maksimal menit 6:30.
11. Tersisa minimal 3 menit 30 detik untuk Q&A.
