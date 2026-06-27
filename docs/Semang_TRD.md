# SEMANG — Technical Requirements Document (TRD)

**Versi:** 1.0 (MVP) · **Status:** Draft · **Bahasa:** Indonesia
**Acuan:** Semang PRD v1.0, Semang SRD v1.0, Semang ERD (semang_erd.puml)

> **Tagline:** Kost-mu ditagih otomatis, uang masuk tercatat sendiri, tanpa kamu menagih siapa-siapa.
> **Fokus:** desain teknis Tahap 0 — arsitektur free-tier, state machine idempoten, upgrade path bersih

## 1. Ringkasan Teknis

Semang Tahap 0 adalah aplikasi web Next.js monolitik di Vercel dengan Supabase sebagai database, auth, dan storage. Tidak ada server yang dikelola sendiri, tidak ada layanan berbayar, tidak ada uang yang melewati sistem. Dua keputusan teknis menjiwai seluruh desain: (1) setiap lapisan yang kelak berbayar (notifikasi, pembayaran) dibungkus interface agar implementasi gratis hari ini dapat ditukar tanpa refactor, dan (2) seluruh proses berjalan idempoten karena cron pada free tier tidak menjamin eksekusi tepat-sekali.

## 2. Arsitektur Sistem

```
Pemilik (browser)                      Penghuni (browser, tanpa akun)
      │                                        │
      │ HTTPS                                  │ HTTPS (link bertoken)
      ▼                                        ▼
┌──────────────────────────────────────────────────────────┐
│              Next.js App (Vercel Hobby)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │ Dashboard   │  │ Halaman      │  │ API Routes     │   │
│  │ pemilik     │  │ publik       │  │ + Server       │   │
│  │ (App Router)│  │ (isi/upload/ │  │   Actions      │   │
│  │             │  │  kuitansi)   │  │                │   │
│  └─────────────┘  └──────────────┘  └────────┬───────┘   │
│         Vercel Cron (harian) ────────────────┤           │
└──────────────────────────────────────────────┼───────────┘
                                               │
              ┌────────────────────────────────┼─────────────────┐
              ▼                                ▼                 ▼
      ┌──────────────┐                ┌──────────────┐   ┌──────────────┐
      │ Supabase     │                │ Supabase     │   │ Resend       │
      │ Postgres+RLS │                │ Storage      │   │ (email)      │
      │ (data inti)  │                │ (foto bukti) │   │              │
      └──────────────┘                └──────────────┘   └──────────────┘

Keluar sistem (tanpa API): wa.me deep link → aplikasi WhatsApp pemilik
                           transfer bank → langsung rekening pemilik
```

Tidak ada komponen lain. Pengiriman WA dan perpindahan uang terjadi sepenuhnya di luar sistem — Semang hanya menyusun pesan dan mencatat hasil.

## 3. Tech Stack

| Lapisan         | Pilihan                                         | Alasan                                                                                      |
|-----------------|-------------------------------------------------|---------------------------------------------------------------------------------------------|
| Framework       | Next.js 14+ (App Router) di Vercel Hobby        | Satu codebase untuk dashboard, halaman publik, API; cron bawaan; free tier memadai (NFR-01) |
| Bahasa          | TypeScript                                      | Type safety untuk state machine dan entitlement; mengurangi bug solo developer              |
| Database        | Supabase Postgres + RLS                         | Isolasi multi-tenant di level database (NFR-02); free 500MB cukup untuk ratusan properti    |
| Auth            | Supabase Auth (email+password, verifikasi email dimatikan) | AUTH-01/02 friksi rendah; hashing password ditangani Supabase; login via email atau nomor WA (lookup nomor→email di tabel users) |
| Storage         | Supabase Storage (bucket privat)                | Foto bukti dengan signed URL; 1GB free + kompresi client ≤200KB (NFR-07)                    |
| Email           | Resend free tier                                | NTF-05; 3.000 email/bulan cukup untuk notifikasi pemilik                                    |
| Kompresi gambar | browser-image-compression (client-side)         | BKT-03 — kompres + strip EXIF sebelum upload, hemat kuota storage                           |
| Penjadwalan     | Vercel Cron (utama) + GitHub Actions (cadangan) | TGH-01; dua pemicu yang sama-sama memanggil endpoint idempoten                              |
| Styling         | Tailwind CSS                                    | Cepat untuk solo developer; mobile-first                                                    |
| Validasi        | Zod                                             | Skema input tunggal dipakai client + server                                                 |

## 4. Model Data

Delapan belas entitas sesuai Semang ERD (semang_erd.puml). Semua tabel ber-RLS dengan kebijakan kepemilikan via `users.id = auth.uid()` (langsung atau melalui join ke properties), kecuali yang diakses publik via token. Prinsip skala: perubahan masa depan bersifat aditif (tabel/baris baru), bukan restrukturisasi tabel berisi data.

### 4.1 Identitas & akses

| Entitas        | Kolom kunci                                                         | Catatan                                                                                               |
|----------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| users          | id (=auth.uid), name, email <<UK>>, phone_wa <<UK>>, locale         | Generik — pemilik hari ini; staf & akun penghuni kelak memakai tabel yang sama tanpa migrasi identity |
| bank_accounts  | id, user_id, bank_code, account_number, account_holder, is_default  | Rekening tujuan transfer milik pemilik (BR-06); terpisah dari users agar mendukung multi-rekening     |
| property_staff | id, property_id, user_id, role, invited_at, accepted_at, revoked_at | Kosong di Tahap 0; jalur masuk staf/penjaga kost Tahap 2 (sudah siap, tinggal diisi)                  |

### 4.2 Properti & penghuni

| Entitas    | Kolom kunci                                                                        | Catatan                                                                                             |
|------------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| properties | id, owner_id, name, city, default_rent, default_due_day, timezone, unique_code_enabled, status | Soft delete via deleted_at (BR-08); timezone per properti untuk cron yang benar; unique_code_enabled = toggle fitur kode unik opsional (TGH-09) |
| rooms      | id, property_id, room_number (int), label, rent_override, due_day_override, status | room_number numerik 1–50 — dasar kode unik (BR-01, BR-02); label bebas ("A1") tanpa mengganggu kode |
| tenants    | id, room_id, user_id (nullable), name, phone_wa, moved_in_at, moved_out_at         | moved_out_at NULL = aktif, satu aktif per kamar (BR-07); user_id menunggu portal penghuni Tahap 2   |

### 4.3 Tagihan & pembayaran

| Entitas        | Kolom kunci                                                                                                                                    | Catatan                                                                                                                                                                         |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| invoices       | id, room_id, tenant_id, period (char 7 "YYYY-MM"), base_amount, unique_code (smallint, nullable), total_amount, status, due_date, idempotency_key <<UK>> | Unik (room_id, period) → idempotensi TGH-05. Pencocokan via token (BR-01), bukan nominal. unique_code NULL bila fitur opsional mati; bila aktif total_amount = base + code (TGH-09, BR-16) |
| invoice_items  | id, invoice_id, kind, description, amount, metadata jsonb                                                                                      | MVP: satu item "sewa"; listrik (Tahap 1) & denda (Tahap 2) hanya baris baru dengan kind berbeda — invoice tidak tersentuh                                                       |
| proofs         | id, invoice_id, storage_key, mime_type, file_size, status, rejection_reason, decided_by, decided_at                                            | BKT-04…08; decided_by merujuk users                                                                                                                                             |
| payments       | id, invoice_id, proof_id (nullable), source, amount, status, provider*, provider_payload jsonb, idempotency_key <<UK>>, confirmed_by           | Sumber kebenaran pembayaran. Tahap 0: source=manual_transfer + proof_id terisi. Tahap 3: webhook QRIS hanya menulis source=qris + kolom provider — dua jalur hidup berdampingan |
| invoice_events | id, invoice_id, actor_id, event_type, from_status, to_status, metadata                                                                         | Audit trail TGH-07 / NFR-10                                                                                                                                                     |

### 4.4 Komunikasi & akses publik

| Entitas       | Kolom kunci                                                                                                                                    | Catatan                                                                                |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| notifications | id, invoice_id, recipient_phone, kind (tagihan/H-3/H/H+3/H+7), channel (wa_link/waba/email), payload, status, provider_ref, opened_at, sent_at | Antrean siap-kirim NTF-02…03; kolom channel & provider_ref sudah menunggu WABA Tahap 2 |
| public_tokens | id, kind (isi_mandiri/upload/kuitansi), target_id, token_hash <<UK>>, expires_at, used_at                                                      | Token acak ≥128 bit disimpan sebagai hash (NFR-03)                                     |

### 4.5 Monetisasi (struktur aktif sejak hari pertama, harga Rp0 di Tahap 0)

| Entitas             | Kolom kunci                                                                                                    | Catatan                                                                    |
|---------------------|----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| plans               | id, code <<UK>> (gratis/starter/pro/bisnis), price_per_room, min_monthly, max_rooms, max_properties, is_active | Definisi tier PRD §10 sebagai data, bukan hardcode                         |
| plan_features       | id, plan_id, feature_key, enabled, limit_value                                                                 | Gate fitur per tier ENT-01                                                 |
| subscriptions       | id, owner_id, plan_id, status, billing_cycle (bulanan/tahunan), trial_invoices_left, current_period_start/end  | trial_invoices_left mengimplementasikan trial "2 siklus tagihan" PRD §10.2 |
| subscription_addons | id, subscription_id, feature_key, price_monthly, status                                                        | Add-on à la carte (listing, kontrak digital, screening) PRD §10.3          |

### 4.6 Integrasi masa depan

| Entitas      | Kolom kunci                                                                                         | Catatan                                                                                                                           |
|--------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| webhook_logs | id, source, event_type, idempotency_key <<UK>>, payload jsonb, processed, attempt_count, last_error | Kosong hingga Tahap 3 (QRIS); ada sejak awal agar pola idempoten webhook tidak ditambal belakangan (pola yang sama dengan Holdin) |

Relasi utama: users → properties → rooms → (tenants, invoices); invoices → (invoice_items, proofs, payments, invoice_events, notifications); plans → subscriptions → subscription_addons. Detail kardinalitas lengkap di Semang ERD.

## 5. State Machine & Aturan Transisi

### 5.1 Tabel transisi

| Dari                | Trigger                   | Ke                  | Aturan                                                                     |
|---------------------|---------------------------|---------------------|----------------------------------------------------------------------------|
| draft               | cron: tanggal siklus tiba | terjadwal           | Hanya kamar terisi (BR-03); upsert by (room_id, period)                    |
| terjadwal           | sistem menyusun pesan     | terkirim*           | *Status logis "siap dikirim"; pesan masuk notifications                    |
| terkirim            | penghuni unggah bukti     | menunggu_konfirmasi | Via token halaman upload; proof tercipta                                   |
| menunggu_konfirmasi | pemilik Terima            | lunas               | Tulis payments (source=manual_transfer, proof_id) + kuitansi + event audit |
| menunggu_konfirmasi | pemilik Tolak             | terkirim            | Wajib alasan (BKT-07); bukti berstatus ditolak                             |
| menunggu_konfirmasi | timeout 72 jam            | (tetap)             | Kirim pengingat email ke pemilik (BR-04)                                   |
| terkirim            | lewat due_date            | telat               | Reminder H+3/H+7 masuk antrean                                             |
| telat               | H+30 tanpa lunas          | menunggak           | Badge + masuk laporan khusus (BR-04)                                       |

### 5.2 Aturan locking & konsistensi

- Transisi state dieksekusi dalam transaksi Postgres dengan `SELECT … FOR UPDATE` pada baris invoice — dua konfirmasi bersamaan tidak menghasilkan state ganda.
- Konstraint unik `(room_id, period)` pada invoices menjadi pertahanan terakhir idempotensi generate (TGH-05).
- Status invoice hanya boleh berubah melalui fungsi transisi tunggal (satu modul, satu pintu) yang sekaligus menulis invoice_events — tidak ada UPDATE status langsung dari tempat lain.
- Penulisan payments terjadi di dalam transaksi yang sama dengan transisi ke lunas — invoice lunas tanpa payment record adalah state yang mustahil.

## 6. Desain API

Semua endpoint internal memakai Server Actions / API Routes Next.js dengan sesi Supabase. Endpoint publik bertoken tidak butuh sesi.

| Method & path                       | Auth          | Fungsi                              | SRD              |
|-------------------------------------|---------------|-------------------------------------|------------------|
| POST /api/properties                | sesi          | Buat properti + generate rooms      | KOST-01…02       |
| PATCH /api/rooms/:id                | sesi          | Override harga, ubah status         | KOST-03…04       |
| POST /api/rooms/:id/self-fill-token | sesi          | Generate link isi-mandiri           | PHN-01…02        |
| GET/POST /p/isi/:token              | publik        | Form + simpan data penghuni         | PHN-01, PHN-04   |
| POST /api/tenants/:id/checkout      | sesi          | Tandai penghuni keluar              | PHN-05           |
| POST /api/cron/generate-invoices    | secret header | Generate tagihan harian (idempoten) | TGH-01, TGH-05   |
| POST /api/cron/run-timeouts         | secret header | Jalankan timeout & susun reminder   | TGH-04, BR-04…05 |
| GET /api/queue                      | sesi          | Antrean siap-kirim                  | NTF-02           |
| POST /api/queue/:id/opened          | sesi          | Tandai pesan dibuka                 | NTF-03           |
| GET/POST /p/bukti/:token            | publik        | Halaman upload bukti + simpan       | BKT-01…04        |
| POST /api/proofs/:id/decide         | sesi          | Terima/Tolak satu-tap               | BKT-05…07        |
| GET /p/kuitansi/:token              | publik        | Kuitansi digital                    | BKT-06           |
| GET /api/reports/export             | sesi          | CSV/Excel rentang tanggal           | LAP-03           |

Konvensi: respons error berbahasa Indonesia sederhana (NFR-08); semua endpoint cron memverifikasi `CRON_SECRET` di header.

## 7. Lapisan Notifikasi (NotificationSender)

```
interface NotificationSender {
  compose(invoice, jenis) → { url_atau_payload, preview }
  channel() → "wa_link" | "waba" | "email"
}

Tahap 0: WaLinkSender  → susun https://wa.me/<no>?text=<encoded>, simpan ke notifications (channel=wa_link)
Tahap 2: WabaSender    → kirim via WhatsApp Business API, status webhook delivery
Selalu : EmailSender   → Resend, untuk notifikasi pemilik (NTF-05)
```

Aturan desain: tidak ada modul lain yang tahu pesan dikirim lewat apa — modul tagihan hanya memanggil `NotificationSender` (NFR-09). Penambahan WABA kelak adalah implementasi baru + konfigurasi, bukan perubahan alur.

## 8. Background Jobs

| Job               | Pemicu                 | Jadwal               | Sifat                                                                         |
|-------------------|------------------------|----------------------|-------------------------------------------------------------------------------|
| generate-invoices | Vercel Cron → endpoint | Harian 02.00 WIB     | Idempoten via upsert (room_id, period)                                        |
| run-timeouts      | Vercel Cron → endpoint | Harian 03.00 WIB     | Scan state + due_date; susun reminder H-3/H/H+3/H+7; eskalasi telat/menunggak |
| monthly-summary   | Vercel Cron → endpoint | Tanggal 1, 06.00 WIB | Email ringkasan bulanan per pemilik (LAP-04)                                  |
| cleanup-tokens    | Vercel Cron → endpoint | Mingguan             | Hapus public_tokens kedaluwarsa                                               |

GitHub Actions schedule memanggil endpoint yang sama sebagai cadangan bila cron Vercel terlewat — aman karena semua endpoint idempoten (NFR-06).

## 9. Keamanan

- **RLS:** setiap tabel ber-policy kepemilikan `users.id = auth.uid()` — langsung pada properties/bank_accounts/subscriptions, dan via join ke properties untuk tabel turunan (rooms → invoices → payments dst.). Saat property_staff terisi (Tahap 2), policy diperluas menjadi `owner OR staff aktif` tanpa mengubah struktur. Halaman publik tidak menyentuh tabel langsung melainkan melalui RPC ter-batasi yang memverifikasi token hash.
- **Token publik:** 32 byte random → base64url, disimpan sebagai SHA-256 hash; pembanding constant-time; kedaluwarsa sesuai jenis (PHN-02).
- **Storage:** bucket privat; akses bukti hanya via signed URL berumur pendek yang diminta dari sesi pemilik.
- **Rate limiting:** endpoint publik dibatasi per-IP (token bucket di edge middleware) untuk menahan brute force token.
- **EXIF:** dihapus di client sebelum upload (BKT-03); server menolak file >1MB atau non-image sebagai pertahanan kedua.
- **Secrets:** CRON_SECRET, kunci Supabase service-role hanya di environment Vercel; tidak pernah di client bundle.

## 10. Idempotency & Konsistensi

Tiga lapis pertahanan terhadap eksekusi ganda:

1. **Konstraint database** — unik (room_id, period) dan idempotency_key di invoices; idempotency_key dan provider_ref di payments; token_hash di public_tokens; idempotency_key di webhook_logs.
2. **Upsert, bukan insert** — semua job cron menulis dengan `ON CONFLICT DO NOTHING/UPDATE`.
3. **Transisi satu pintu** — fungsi transisi state memegang row lock dan memvalidasi state asal sebelum menulis; transisi dari state yang salah ditolak dan dicatat.

Konsekuensi: cron boleh dipicu dua kali, webhook (kelak) boleh datang dua kali, pemilik boleh double-tap — hasil akhir selalu sama.

## 11. Infrastruktur & Deployment

- **Lingkungan:** production tunggal di Vercel + satu proyek Supabase; preview deployment Vercel memakai branch database Supabase (fitur free) untuk uji aman.
- **Konfigurasi:** seluruh kredensial via environment variables; file `.env.example` terdokumentasi di repo.
- **Migrasi skema:** SQL migration files di repo, dijalankan via Supabase CLI — riwayat skema ikut version control.
- **Observabilitas (gratis):** Vercel logs + Supabase logs; error tracking via console terstruktur; alarm sederhana = email harian hasil cron (sukses/gagal + jumlah tagihan dibuat).
- **Backup:** ekspor SQL mingguan otomatis via GitHub Actions ke artifact privat (mitigasi batas backup free tier Supabase).

## 12. Strategi Pengujian

Pengujian difokuskan pada area berisiko tinggi, bukan cakupan menyeluruh — sesuai kapasitas solo developer.

- **State machine:** setiap baris tabel transisi §5.1 menjadi satu test case; transisi ilegal (mis. lunas → terkirim) harus ditolak dan tercatat.
- **Idempotensi cron:** test memanggil generate-invoices dua kali untuk periode sama → tepat satu tagihan per kamar.
- **Isolasi RLS lintas-tenant:** test membuktikan pemilik A tidak dapat membaca/menulis data pemilik B di SETIAP tabel ber-RLS; dijalankan sebagai bagian CI.
- **Aturan jatuh tempo:** test TGH-08 untuk Februari, bulan 30 hari, dan 31 hari.
- **Pencocokan token:** test bahwa bukti hanya tertaut ke tagihan pemilik token, dan token kedaluwarsa/terpakai ditolak.
- **Kompresi & EXIF:** test bahwa unggahan >1MB atau non-image ditolak server, dan EXIF hilang setelah kompresi client.

## 13. Template Pesan & Kuitansi

Teks pesan adalah produk yang dilihat penghuni; template dikelola terpusat (satu sumber, mudah diiterasi) dan diisi `NotificationSender`.

- **Tagihan:** sapaan + nama kost + kamar + periode + nominal + rekening tujuan + link upload bukti.
- **Reminder H-3 / hari-H / H+3 / H+7:** nada menanjak dari ramah ke tegas, elemen wajib sama dengan tagihan.
- **Kuitansi:** nomor kuitansi berformat `<KODE_KOST>-<YYYYMM>-<NOMOR_KAMAR>` (mis. MELATI-202606-03), tanggal bayar, jumlah, status lunas.
- Elemen wajib (nominal, rekening, link) tidak dapat dihapus pemilik; hanya sapaan dan catatan kaki yang dapat dikustomisasi (NTF-06).

## 14. Analytics & Funnel

- **Funnel onboarding (ONB-05):** dicatat sebagai baris event di tabel sendiri (daftar → layar 1 → layar 2 → momen wow → selesai), bukan layanan pihak ketiga berbayar — menjaga Rp0 dan kepemilikan data.
- Agregasi funnel dihitung lewat query SQL sederhana; tidak perlu tooling eksternal di Tahap 0.
- Bila kelak butuh analitik produk lebih kaya, PostHog free tier dapat ditambahkan tanpa mengubah skema event yang sudah ada.

## 15. Upgrade Path Teknis (Tahap 1–3)

| Perubahan                          | Yang ditambah                                                                                   | Yang TIDAK berubah                                                                                                |
|------------------------------------|-------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| wa.me → WABA (Tahap 2)             | WabaSender; kolom channel & provider_ref di notifications mulai terpakai                        | Modul tagihan, state machine, struktur notifications                                                              |
| Konfirmasi manual → QRIS (Tahap 3) | Webhook gateway menulis payments dengan source=qris + kolom provider; webhook_logs mulai terisi | Tabel payments & webhook_logs (sudah ada sejak hari pertama); alur konfirmasi manual tetap hidup sebagai fallback |
| Single → multi-properti (Tahap 2)  | Hapus batas 1 properti di ENT/UI                                                                | Skema data (sudah one-to-many sejak awal)                                                                         |
| Portal penghuni (Tahap 2)          | Auth penghuni; tenants.user_id mulai terisi                                                     | Tabel tenants/invoices (sudah memuat semua data)                                                                  |
| Staf/penjaga kost (Tahap 2)        | Baris di property_staff + perluasan policy RLS                                                  | Struktur identitas users (staf memakai tabel yang sama)                                                           |
| Reset password (pasca-MVP)         | Supabase Auth reset flow + Resend sebagai SMTP                                                  | Skema users (password sudah dikelola Supabase Auth)                                                               |

## 16. Open Technical Questions

- Verifikasi perilaku Vercel Cron pada Hobby plan (jaminan eksekusi, jitter) — bila tidak andal, GitHub Actions jadi pemicu utama.
- Batas praktis signed URL Supabase Storage untuk kuitansi yang dibagikan penghuni — perlu umur panjang atau regenerasi per akses?
- Strategi kompresi lanjutan saat mendekati 1GB: kompres ulang bukti lama ke kualitas lebih rendah, atau arsip-hapus setelah N bulan (tergantung jawaban Open Question SRD)?
- Login via nomor WA: lookup nomor→email lalu auth ke Supabase, atau simpan nomor sebagai identitas terpisah — mana yang lebih bersih untuk migrasi OTP WA kelak?
- Apakah Server Actions cukup atau perlu API Routes eksplisit untuk endpoint publik demi rate limiting yang lebih terkontrol di edge middleware?
