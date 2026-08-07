# Deploy AmanKlik AI ke Railway

Panduan ini menghubungkan dua service dalam satu Railway project:

```text
AmanKlik AI (Next.js)  --->  PostgreSQL
          |
          +------------->  Gemini API
```

Kunci penting:

- `DATABASE_URL` diisi pada service **AmanKlik AI** dengan reference ke service PostgreSQL.
- `GEMINI_API_KEY` diisi pada service **AmanKlik AI**, bukan pada service PostgreSQL.
- Jangan menaruh Gemini key di source code, GitHub, `.env` yang di-commit, atau variabel `NEXT_PUBLIC_*`.

## 1. Siapkan Gemini API key

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Login dengan akun Google.
3. Klik **Create API key**.
4. Pilih project Google Cloud jika diminta, lalu salin key yang dibuat.

Jangan kirim key ini ke chat atau commit ke repository. Key akan ditempel langsung ke Railway Variables pada langkah 4.

Untuk deployment ini, model default yang sudah disiapkan proyek adalah:

```text
GEMINI_MODEL=gemini-3.6-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
GEMINI_EMBEDDING_MODEL=gemini-embedding-2
```

Pastikan akun Gemini memiliki akses/quota untuk model tersebut. Daftar model dapat berubah; jika Google AI Studio menampilkan model berbeda, gunakan model ID yang tersedia di akun tersebut.

## 2. Buat project dan service web di Railway

1. Buka [Railway](https://railway.com/new) lalu pilih **Deploy from GitHub Repo**.
2. Hubungkan akun GitHub bila diminta.
3. Pilih repository `cryptzoa/AmanKlik_Ai` dan branch `main`.
4. Pilih **Deploy Now**.

Railway akan mendeteksi `package.json` dan memakai script berikut:

```json
{
  "build": "next build",
  "start": "node .next/standalone/server.js"
}
```

Service ini sebaiknya diberi nama `amanklik-web`. Node 26 yang sudah terpasang di mesin lokal kompatibel dengan requirement proyek (`Node >=24`). Railway menggunakan konfigurasi repository saat build; tidak perlu menambahkan Dockerfile.

## 3. Tambahkan PostgreSQL Railway

1. Dari **Project Canvas**, klik **+ New**.
2. Pilih **Database → PostgreSQL**.
3. Biarkan PostgreSQL selesai provisioning.
4. Rename service database menjadi `Postgres` agar reference variable di bawah bisa langsung dipakai.

Railway menyediakan `DATABASE_URL` pada service PostgreSQL. Railway mendukung reference variable antar-service dengan format `${{ServiceName.VARIABLE_NAME}}`.

## 4. Isi Variables pada service `amanklik-web`

Buka service **amanklik-web → Variables → New Variable**. Tambahkan variable berikut satu per satu.

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `AI_MODE` | `live` |
| `GEMINI_API_KEY` | paste key dari Google AI Studio |
| `GEMINI_MODEL` | `gemini-3.6-flash` |
| `GEMINI_FALLBACK_MODEL` | `gemini-3.5-flash-lite` |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-2` |
| `CACHE_HMAC_SECRET` | random secret panjang, berbeda dari Gemini key |

`DATABASE_URL` harus berada pada service web. Jangan copy URL database secara manual jika bisa memakai reference `${{Postgres.DATABASE_URL}}`; reference tersebut otomatis mengikuti database di project yang sama.

Untuk `CACHE_HMAC_SECRET`, buat secret random di komputer lokal. Contoh Linux/macOS:

```bash
openssl rand -base64 48
```

Salin hasilnya ke value `CACHE_HMAC_SECRET`. Jangan gunakan `replace-local-with-a-long-random-secret` pada production dan jangan gunakan Gemini key sebagai HMAC secret.

Tambahkan variable berikut setelah Railway memberi public domain:

| Name | Value |
|---|---|
| `APP_BASE_URL` | `https://<domain-railway-anda>` |

Variable opsional yang boleh memakai default proyek:

```text
SCAN_RATE_LIMIT=10
SCAN_RATE_WINDOW_SECONDS=600
ANALYSIS_CACHE_TTL_SECONDS=86400
MAX_UPLOAD_BYTES=5242880
MAX_TEXT_CHARS=8000
AI_TIMEOUT_MS=25000
AI_MAX_CONCURRENCY=2
RAG_TOP_K=3
RAG_EMBEDDING_DIM=768
```

> **Jangan mengisi `GEMINI_API_KEY` di `.env.example`.** File itu hanya template. Untuk local development, key cukup berada di `.env.local` dan file tersebut sudah di-ignore Git.

## 5. Set migration database

Pada service **amanklik-web**, buka pengaturan deployment dan isi **Pre-Deploy Command** dengan:

```bash
pnpm db:migrate
```

Kemudian lakukan deploy. Migration akan memakai `DATABASE_URL` Railway yang sudah direference ke PostgreSQL.

Penting:

- Migration dijalankan sebelum aplikasi start.
- Jangan menjalankan `db:push`, `db:drop`, atau reset database production.
- Jika pre-deploy gagal, deployment tidak akan dilanjutkan. Buka log pre-deploy, bukan hanya log aplikasi.

## 6. Generate domain dan healthcheck

1. Buka service **amanklik-web → Settings**.
2. Pada **Networking**, klik **Generate Domain**.
3. Salin domain `*.up.railway.app` yang dibuat.
4. Pada konfigurasi healthcheck Railway, isi path:

```text
/api/health
```

Endpoint ini harus mengembalikan HTTP 200 dengan database terhubung. Contoh pemeriksaan dari terminal:

```bash
curl -i https://<domain-railway-anda>/api/health
```

Respons sehat memiliki bentuk umum:

```json
{
  "ok": true,
  "data": {
    "status": "healthy",
    "database": "ok"
  }
}
```

## 7. Tes live setelah deploy

Buka domain Railway, lalu tes:

1. **Text scan** dengan teks sintetis, bukan data pribadi nyata.
2. **URL scan** menggunakan domain dokumentasi/reserved yang aman, misalnya `https://example.com/login`.
3. **Screenshot scan** menggunakan screenshot dummy.
4. **History** untuk memastikan hasil tersimpan pada session.
5. **Simulator** untuk memastikan demo tetap berjalan.

Pada hasil scan live, cek:

- mode bukan `mock`;
- model/provider terdeteksi jika AI berhasil;
- hasil tetap memiliki disclaimer dan uncertainty;
- tidak ada API key atau payload provider di browser maupun log Railway.

## 8. Troubleshooting cepat

### Healthcheck `503` atau `database: "error"`

- Pastikan PostgreSQL sudah aktif.
- Pastikan service database benar-benar bernama `Postgres`, atau sesuaikan reference variable.
- Pastikan `DATABASE_URL` pada service web bernilai `${{Postgres.DATABASE_URL}}`.
- Pastikan migration `pnpm db:migrate` sukses.

### Aplikasi gagal start karena `GEMINI_API_KEY`

- Pastikan `AI_MODE=live` ditulis persis huruf kecil.
- Pastikan variable bernama tepat `GEMINI_API_KEY`.
- Pastikan key ditempel pada service `amanklik-web`, bukan PostgreSQL.
- Setelah mengubah variable, tekan **Deploy**/redeploy agar staged changes diterapkan.

### Gemini mengembalikan model tidak ditemukan atau quota error

- Periksa model ID yang tersedia di Google AI Studio.
- Update `GEMINI_MODEL` dan `GEMINI_FALLBACK_MODEL` di Railway Variables.
- Periksa quota/billing project Gemini.
- Jangan mengubah aplikasi ke `AI_MODE=mock` di production hanya untuk menutupi error provider.

### Build berhasil tetapi service tidak start

- Pastikan **Start Command** tetap `pnpm start` atau terdeteksi dari script `start`.
- Pastikan tidak ada custom Dockerfile atau root directory yang salah.
- Baca seluruh build/deploy log dari awal; error penyebab sering muncul sebelum baris terakhir.

## Checklist sebelum demo

- [ ] `DATABASE_URL` memakai `${{Postgres.DATABASE_URL}}`.
- [ ] `GEMINI_API_KEY` hanya berada di Railway Variables service web.
- [ ] `AI_MODE=live`.
- [ ] `CACHE_HMAC_SECRET` random dan berbeda dari Gemini key.
- [ ] Pre-deploy command `pnpm db:migrate` sukses.
- [ ] `/api/health` mengembalikan HTTP 200 dan `database: "ok"`.
- [ ] Domain Railway sudah dibuat.
- [ ] Text, URL, screenshot, history, dan simulator sudah dites.
- [ ] Tidak ada secret pada GitHub, client bundle, atau log.

## Referensi resmi

- [Railway Quick Start](https://docs.railway.com/quick-start)
- [Railway PostgreSQL](https://docs.railway.com/databases/postgresql)
- [Railway Variables](https://docs.railway.com/variables)
- [Railway reference variables](https://docs.railway.com/integrations/api/manage-variables#variable-references)
- [Railway pre-deploy command](https://docs.railway.com/deployments/pre-deploy-command)
- [Railway healthchecks](https://docs.railway.com/deployments/healthchecks)
- [Gemini API models](https://ai.google.dev/gemini-api/docs/models)
