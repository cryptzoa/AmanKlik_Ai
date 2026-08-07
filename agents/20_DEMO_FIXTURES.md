# 20 — Synthetic Demo Fixtures

All examples are fictional. Use no real victims, phones, accounts, credentials, or active suspicious domains. Reserved documentation domains/IPs only.

## T1 — New-number impersonation

> Bu, ini nomor baru aku. Nomor lama rusak. Aku lagi ada masalah dan butuh transfer sekarang. Tolong kirim ke rekening yang aku kasih ya, jangan telepon dulu karena lagi meeting.

Signals:
- identity switch;
- urgency;
- transfer;
- avoidance/secrecy.

Expected: High–Very High.

Safe action: verify through known old number/other trusted family channel.

## T2 — OTP verification

> Pemberitahuan keamanan: akun Anda akan dibatasi hari ini. Untuk membatalkan pemblokiran, balas pesan ini dengan kode OTP yang baru dikirim.

Signals:
- threat;
- urgency;
- OTP;
- credentials/social engineering.

Expected: Very High.

## T3 — Benign family

> Bu, aku pulang sekitar jam 7 malam. Kalau belanja tolong sekalian beli telur ya. Nanti aku telepon kalau sudah berangkat.

Expected: Low. UI still says low does not guarantee safety.

## T4 — Investment

> Investasi resmi dengan keuntungan pasti 25% per minggu. Slot terbatas sampai malam ini. Transfer modal awal sekarang untuk mengaktifkan akun VIP.

Signals: guaranteed return, urgency, transfer.  
Expected: High/Very High.

## U1 — Brand-like subdomain

`https://brand.secure-login.example.net/account`

Explain:
- registrable domain is `example.net`;
- a brand token in subdomain/path does not make it official.

Because `example.net` is reserved, do not call it malicious. Structural educational risk only.

## U2 — IP host

`http://192.0.2.10/verify-account`

192.0.2.0/24 is documentation space.

Signals:
- HTTP;
- IP host;
- verification path.

Never fetch.

## U3 — Benign reserved

`https://example.com/help/account`

Expected low structural risk.

## Screenshot fixtures

Create synthetic images in `public/demo/` based on T1/T2:
- fictional names/avatar;
- no real phone/account;
- sufficient readable text;
- compressed below limit.

## Simulator S1 — Family/new number

Step 1: number changed. Choices:
A transfer now; B ask account; C contact known channel; D continue chat.

Best: C.

Teach identity change, urgency, independent verification.

## S2 — Bank OTP

Best:
- do not share OTP;
- independently open known official app/channel.

Teach secrets + threat pressure.

## S3 — Parcel link

Best:
- do not trust link;
- independently open official marketplace/courier app/site.

Teach link context + independent navigation.

## Mock mapping

Mock provider maps fixture IDs or deterministic hashes to known schema output. E2E must be stable.

## Evaluation set minimum

- 10 risky texts;
- 10 benign;
- 5 ambiguous;
- 8 URL fixtures.

Expected values can be score ranges. Never call this a representative national dataset.
