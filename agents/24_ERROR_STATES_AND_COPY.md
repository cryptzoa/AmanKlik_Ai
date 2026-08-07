# 24 — Error States and Product Copy

Language: Indonesian. Tone calm, concise, actionable, non-accusatory.

## Global disclaimer
`Penilaian ini menunjukkan indikator risiko dan dapat keliru. Verifikasi melalui kanal resmi sebelum mengambil keputusan.`

## Privacy notice
`Versi demo menggunakan API AI pihak ketiga. Hindari mengunggah percakapan nyata yang berisi data pribadi atau informasi sensitif.`

## Text
Empty: `Masukkan pesan yang ingin diperiksa.`  
Too short: `Pesannya terlalu pendek untuk dianalisis. Tambahkan sedikit konteks.`  
Too long: `Pesan terlalu panjang. Maksimum 8.000 karakter.`

## URL
Empty: `Masukkan tautan yang ingin diperiksa.`  
Invalid: `Format tautan belum valid. Gunakan alamat lengkap seperti https://...`  
Protocol: `AmanKlik hanya menerima tautan HTTP atau HTTPS.`  
Note: `AmanKlik tidak membuka situs ini. Kami hanya memeriksa struktur alamat dan konteks yang Anda kirim.`

## Image
No file: `Pilih screenshot terlebih dahulu.`  
Large: `Ukuran gambar terlalu besar. Maksimum 5 MB.`  
Unsupported: `Format gambar tidak didukung. Gunakan PNG, JPG, atau WEBP.`  
Decode: `Gambar tidak dapat dibaca. Coba file lain.`  
AI unavailable: `Analisis gambar dengan AI sedang tidak tersedia. Coba lagi atau tempel isi pesannya sebagai teks.`

## Degraded banner
Title: `Analisis AI sedang terbatas`  
Body: `AmanKlik tetap menjalankan pemeriksaan pola dan struktur secara deterministik. Hasil ini tidak mencakup analisis konteks AI.`

## Rate limit
`Terlalu banyak pemeriksaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.`

## Save issue
`Hasil belum dapat disimpan. Silakan coba lagi.`

## Labels
LOW `Risiko rendah`  
MEDIUM `Risiko sedang`  
HIGH `Risiko tinggi`  
VERY_HIGH `Risiko sangat tinggi`

Never primary label `Aman`.

## Evidence source
Rule `Pola terdeteksi`  
URL `Struktur tautan`  
AI `Konteks AI`

## Action verbs
Use: Verifikasi, Jangan bagikan, Hindari membuka, Hubungi kanal resmi, Simpan bukti.  
Avoid: Panik, Pasti, Dijamin, Terbukti kriminal.

## Cache
`Hasil identik ditemukan dari analisis sebelumnya.`

Do not claim fresh AI on cache hit.

## Result not found/private
`Hasil tidak ditemukan atau tidak tersedia untuk sesi ini.`

## Simulator feedback

Unsafe:
`Pilihan ini membuat Anda tetap bergantung pada informasi dari pengirim. Cara yang lebih aman adalah memverifikasi melalui kanal yang sudah Anda percaya.`

Good:
`Pilihan ini memutus tekanan dari pengirim dan memindahkan verifikasi ke kanal independen.`

## Empty history
Title: `Belum ada pemeriksaan`  
Body: `Hasil yang Anda periksa di sesi ini akan muncul di sini.`  
CTA: `Mulai periksa`
