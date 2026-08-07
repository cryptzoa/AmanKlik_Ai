# 07 — Feature Specification

## Global navigation

Desktop: logo, Scan, Simulator, Learn, History, CTA "Cek Pesan".  
Mobile: compact menu; CTA reachable; no custom cursor.  
All links functional.

## Landing `/`

Hero:
- editorial headline;
- short explanation;
- CTA;
- privacy/trust note.

Suggested headline:
**Jangan percaya pesannya sebelum memahami risikonya.**

Suggested support:
**AmanKlik AI membaca pola manipulasi, struktur tautan, dan konteks pesan untuk menjelaskan tanda risiko—bukan sekadar memberi label.**

Hero visual:
fictional message fragments reveal terms like OTP, TRANSFER, VERIFIKASI, SEKARANG, NOMOR BARU.

Scroll story:
1. Scams rarely look obvious.
2. Pressure leaves patterns.
3. Links tell a story.
4. AI sees context. Rules keep it accountable.
5. CTA.

Landing must remain meaningful without animation. No forced intro.

## Scan `/scan`

Tabs:
- Pesan
- Screenshot
- Tautan

### Text
- textarea;
- character counter;
- example;
- privacy note;
- analyze CTA;
- 8–8000 chars.

### Screenshot
- drag/drop + picker;
- local preview;
- PNG/JPEG/WEBP;
- max 5 MB;
- replace/remove;
- privacy note;
- upload only when analyzing.

### URL
- field;
- example;
- note: **AmanKlik tidak membuka situs ini; kami hanya menganalisis struktur alamatnya.**

### Loading stages
Use real state, not fake percent.

Text:
- Memvalidasi input
- Memeriksa pola risiko
- Menganalisis konteks dengan AI
- Menyusun penjelasan

Image:
- Memproses gambar
- Membaca konteks visual
- Memeriksa pola risiko
- Menyusun hasil

## Result `/result/[id]`

Above fold:
- score;
- level;
- summary;
- analysis mode badge;
- timestamp;
- evidence anchor.

Server-render final values; client animation enhances.

Evidence card:
- source Rule/URL/AI;
- severity;
- redacted evidence;
- plain explanation;
- optional technical disclosure.

Highlight text using React segments, never unsafe HTML.

URL anatomy:
- protocol;
- hostname;
- registrable domain;
- subdomain;
- path;
- claimed brand if any;
- mismatch warning.

Prominently emphasize registrable domain.

Action plan default:
1. do not click/share sensitive data/transfer based only on message;
2. verify independently using official app/site/known number;
3. never share OTP/PIN/password;
4. if money/data already sent, contact relevant provider immediately and use official reporting channels.

Disclaimer:
`Penilaian ini menunjukkan indikator risiko dan dapat keliru. Verifikasi melalui kanal resmi sebelum mengambil keputusan.`

## History `/history`

Anonymous session:
- input type;
- score/level;
- redacted preview;
- time;
- open result.

Empty state → scan.  
Demo retention target: config-driven, about 7 days.

## Simulator `/simulator`

At least 3 scenarios:
- new-number/family impersonation;
- bank/OTP;
- parcel/link.

Each:
- 3–5 steps;
- 3–4 choices;
- deterministic score/branch;
- feedback.

Teach independent verification, not merely "never reply".

AI completion feedback optional. Base works without AI.

## Learn `/learn` — P1

Compact visual cards:
- OTP/credentials;
- urgency;
- impersonation;
- URL anatomy;
- after-transfer actions.

## Feedback — P1
- Membantu
- Kurang membantu
- Hasil terasa salah
- optional <=500 chars
- no email/name.

## Health
`GET /api/health`; app + DB, no Gemini call.

## Responsive targets
- 360;
- 768;
- 1280;
- large presentation display.

No unintended horizontal overflow.
