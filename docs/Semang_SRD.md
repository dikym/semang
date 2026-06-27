# SEMANG — Software Requirements Document (SRD)

**Versi:** 1.0 (MVP) · **Status:** Draft · **Bahasa:** Indonesia
**Acuan:** Semang PRD v1.0

> **Tagline:** Kost-mu ditagih otomatis, uang masuk tercatat sendiri, tanpa kamu menagih siapa-siapa.
> **Fokus:** spesifikasi kebutuhan fungsional & non-fungsional Tahap 0 (MVP, biaya Rp0)

## 1. Pendahuluan

**Tujuan dokumen:** Mendefinisikan kebutuhan perangkat lunak Semang Tahap 0 secara terukur dan dapat diverifikasi, sebagai jembatan antara PRD (apa yang dibangun dan mengapa) dengan TRD (bagaimana membangunnya). Setiap kebutuhan diberi ID unik yang dirujuk oleh TRD.

**Lingkup:** Hanya Tahap 0 (MVP) sesuai PRD §5. Fitur Tahap 1–4 disebut hanya bila memengaruhi keputusan desain hari ini (mis. upgrade path notifikasi).

**Definisi istilah:**

| Istilah            | Arti                                                                                         |
|--------------------|----------------------------------------------------------------------------------------------|
| Pemilik            | Pengguna utama: pemilik/pengelola kost yang memiliki akun Semang                             |
| Penghuni           | Penyewa kamar; berinteraksi via link publik tanpa akun                                       |
| Tagihan            | Kewajiban bayar satu kamar untuk satu siklus, dengan nominal unik                            |
| Kode unik nominal  | Tiga digit terakhir nominal tagihan yang mengidentifikasi kamar (mis. Rp1.500.003 → Kamar 3) |
| Siklus             | Periode penagihan satu kamar; default bulanan pada tanggal jatuh tempo                       |
| Antrean siap-kirim | Daftar pesan wa.me yang telah disusun sistem dan menunggu tap pemilik                        |
| Bukti              | Foto bukti transfer yang diunggah penghuni melalui link publik                               |

## 2. Deskripsi Umum Sistem

**Konteks:** Aplikasi web multi-tenant. Pemilik mengakses dashboard melalui browser (mobile-first). Penghuni tidak pernah membuat akun — seluruh interaksinya melalui link publik bertoken (form isi data, halaman upload bukti, kuitansi).

**Aktor:**

- **Pemilik** — mengelola kost, mengirim tagihan, mengonfirmasi pembayaran, melihat laporan.
- **Penghuni** — mengisi data diri, menerima pesan tagihan via WA, transfer langsung ke rekening pemilik, mengunggah bukti.
- **Sistem (cron)** — men-generate tagihan per siklus, menyusun antrean reminder, menjalankan timeout state machine.

**Asumsi & dependensi:**

- Pemilik dan penghuni memiliki WhatsApp aktif dan terbiasa transfer bank/m-banking.
- Tahap 0 berjalan sepenuhnya pada free tier (Vercel Hobby, Supabase Free, Resend Free) → seluruh kebutuhan tunduk pada batas kuota free tier.
- Tidak ada uang yang mengalir melalui platform; Semang tidak berintegrasi dengan payment gateway pada Tahap 0.

## 3. Kebutuhan Fungsional

### 3.1 Autentikasi & Akun (AUTH)

| ID      | Kebutuhan                                                                                                              | Prioritas |
|---------|------------------------------------------------------------------------------------------------------------------------|-----------|
| AUTH-01 | Pendaftaran dengan email + nomor WA + password; tanpa verifikasi email demi friksi serendah mungkin (Filosofi Inti #2) | Wajib     |
| AUTH-02 | Login dengan email ATAU nomor WA + password; password di-hash (bcrypt/argon2), tidak pernah disimpan apa adanya        | Wajib     |
| AUTH-03 | Nomor WA pemilik disimpan di profil dan dipakai untuk tombol "kirim contoh ke WA saya"                                 | Wajib     |
| AUTH-04 | Sesi login bertahan ≥30 hari pada perangkat yang sama (pemilik non-teknis tidak boleh sering dipaksa login ulang)      | Wajib     |
| AUTH-05 | Reset password ditunda ke pasca-MVP; saat hadir memakai Supabase Auth + Resend (gratis). Di Tahap 0 tidak ada reset    | Tunda     |
| AUTH-06 | Login via OTP WhatsApp disiapkan sebagai jalur masa depan, diaktifkan saat WABA tersedia (Tahap 2)                     | Tunda     |

### 3.2 Manajemen Kost & Kamar (KOST)

| ID      | Kebutuhan                                                                                                          | Prioritas |
|---------|--------------------------------------------------------------------------------------------------------------------|-----------|
| KOST-01 | Pemilik dapat membuat 1 properti kost dengan nama, kota, dan jumlah kamar (1–50)                                   | Wajib     |
| KOST-02 | Sistem men-generate kamar otomatis bernomor urut (Kamar 1…N) saat properti dibuat                                  | Wajib     |
| KOST-03 | Harga sewa default dan tanggal jatuh tempo tunggal ditetapkan di level properti, dapat dioverride per kamar        | Wajib     |
| KOST-04 | Pemilik dapat menambah/mengubah/menonaktifkan kamar setelah onboarding (soft delete; histori tagihan tidak hilang) | Wajib     |
| KOST-05 | Status kamar (terisi/kosong) ter-update otomatis dari keberadaan penghuni aktif                                    | Wajib     |

### 3.3 Data Penghuni (PHN)

| ID     | Kebutuhan                                                                                        | Prioritas |
|--------|--------------------------------------------------------------------------------------------------|-----------|
| PHN-01 | Setiap kamar memiliki link/QR publik bertoken untuk isi-mandiri data penghuni (nama, nomor WA)   | Wajib     |
| PHN-02 | Link isi-mandiri kedaluwarsa setelah dipakai atau setelah 30 hari; pemilik dapat me-regenerate   | Wajib     |
| PHN-03 | Pemilik dapat menginput/mengubah data penghuni secara manual                                     | Wajib     |
| PHN-04 | Nomor WA penghuni divalidasi format E.164 Indonesia (+62) sebelum disimpan                       | Wajib     |
| PHN-05 | Pemilik dapat menandai penghuni keluar (checkout); kamar menjadi kosong, histori tetap tersimpan | Wajib     |
| PHN-06 | Impor massal dari foto buku catatan (input oleh founder secara manual di Tahap 0)                | Opsional  |

### 3.4 Tagihan & State Machine (TGH)

| ID     | Kebutuhan                                                                                                                                     | Prioritas |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| TGH-01 | Sistem men-generate tagihan otomatis untuk setiap kamar terisi pada tanggal siklusnya                                                         | Wajib     |
| TGH-02 | Pencocokan bukti↔tagihan dilakukan via token halaman upload (unik per tagihan), BUKAN via nominal; nominal tagihan tetap bulat                | Wajib     |
| TGH-03 | Tagihan mengikuti state machine: draft → terjadwal → terkirim → menunggu_konfirmasi → lunas, dengan cabang telat dan menunggak (lihat PRD §8) | Wajib     |
| TGH-04 | Setiap state memiliki timeout dengan aksi default; tidak ada tagihan menggantung tanpa batas                                                  | Wajib     |
| TGH-05 | Generate tagihan bersifat idempoten: eksekusi cron ganda pada hari yang sama tidak menghasilkan tagihan duplikat                              | Wajib     |
| TGH-06 | Pemilik dapat membuat tagihan manual ad-hoc (tagihan pertama prorata penghuni baru, denda, biaya tambahan) di luar siklus                     | Wajib     |
| TGH-07 | Seluruh transisi state tercatat di audit trail (siapa, kapan, dari state apa ke state apa)                                                    | Wajib     |
| TGH-08 | Bila tanggal jatuh tempo melebihi hari terakhir bulan berjalan, tagihan jatuh tempo pada hari terakhir bulan tersebut                         | Wajib     |
| TGH-09 | Kode unik nominal tersedia sebagai fitur opt-in per properti (default mati); bila aktif, 3 digit terakhir nominal = nomor kamar               | Opsional  |
| TGH-10 | Satu bukti dapat dipakai pemilik untuk mengonfirmasi beberapa tagihan (pembayaran beberapa bulan sekaligus)                                   | Wajib     |

### 3.5 Notifikasi & Antrean Siap-Kirim (NTF)

| ID     | Kebutuhan                                                                                                                                         | Prioritas |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| NTF-01 | Sistem menyusun pesan tagihan lengkap (nominal unik + rekening pemilik + link upload bukti) sebagai link wa.me pre-filled                         | Wajib     |
| NTF-02 | Antrean "siap kirim" menampilkan semua pesan yang menunggu: tagihan baru, reminder H-3, hari-H, H+3, H+7                                          | Wajib     |
| NTF-03 | Satu tap per pesan membuka WhatsApp dengan teks terisi; sistem mencatat status "sudah dibuka" per pesan                                           | Wajib     |
| NTF-04 | Lapisan notifikasi diimplementasikan di balik interface `NotificationSender` agar implementasi wa.me dapat diganti WABA tanpa mengubah modul lain | Wajib     |
| NTF-05 | Notifikasi ke pemilik (bukti masuk, pengingat konfirmasi, ringkasan bulanan) dikirim via email (Resend) dan ditampilkan di dashboard              | Wajib     |
| NTF-06 | Template pesan dapat dikustomisasi ringan oleh pemilik (sapaan, catatan kaki) tanpa mengubah elemen wajib                                         | Opsional  |

### 3.6 Bukti Transfer & Konfirmasi (BKT)

| ID     | Kebutuhan                                                                                                                                      | Prioritas |
|--------|------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| BKT-01 | Setiap tagihan memiliki halaman upload publik bertoken tak-tertebak (≥128 bit entropi)                                                         | Wajib     |
| BKT-02 | Halaman upload berukuran <200KB dan berfungsi pada koneksi 3G dan perangkat low-end                                                            | Wajib     |
| BKT-03 | Gambar bukti dikompres di sisi client (target ≤200KB) dan metadata EXIF dihapus sebelum diunggah                                               | Wajib     |
| BKT-04 | Sistem mencocokkan bukti dengan tagihan via token halaman upload (unik per tagihan); pemilik memverifikasi jumlah secara visual saat konfirmasi | Wajib     |
| BKT-05 | Pemilik mengonfirmasi (Terima/Tolak) dengan satu tap dari dashboard atau notifikasi email                                                      | Wajib     |
| BKT-06 | Konfirmasi "Terima" → tagihan lunas + kuitansi digital ter-generate dan dapat diakses penghuni via link                                        | Wajib     |
| BKT-07 | Konfirmasi "Tolak" wajib disertai alasan singkat; tagihan kembali ke terkirim dengan catatan                                                   | Wajib     |
| BKT-08 | Penghuni dapat mengunggah ulang bukti bila ditolak, pada halaman yang sama                                                                     | Wajib     |

### 3.7 Laporan & Ekspor (LAP)

| ID     | Kebutuhan                                                                                    | Prioritas |
|--------|----------------------------------------------------------------------------------------------|-----------|
| LAP-01 | Dashboard ringkas: total uang masuk bulan berjalan, jumlah kamar lunas/telat/menunggak       | Wajib     |
| LAP-02 | Daftar tagihan terfilter per status, per bulan, per kamar                                    | Wajib     |
| LAP-03 | Ekspor CSV dan Excel untuk rentang tanggal pilihan                                           | Wajib     |
| LAP-04 | Ringkasan bulanan otomatis dikirim ke pemilik via email ("bulan ini Rp X tercatat otomatis") | Wajib     |

### 3.8 Onboarding (ONB)

| ID     | Kebutuhan                                                                                                                     | Prioritas |
|--------|-------------------------------------------------------------------------------------------------------------------------------|-----------|
| ONB-01 | Wizard 3 layar: (1) nama kost + kota + jumlah kamar, (2) harga default + jatuh tempo, (3) cara isi penghuni                   | Wajib     |
| ONB-02 | Momen wow: preview pesan tagihan atas nama kost pemilik + tombol "Kirim contoh ke WhatsApp saya" (via wa.me ke nomor sendiri) | Wajib     |
| ONB-03 | Waktu penyelesaian wizard ≤10 menit diukur dari pendaftaran sampai contoh tagihan terbuka di WA                               | Wajib     |
| ONB-04 | Dashboard pertama menampilkan checklist progres hidup, bukan layar kosong                                                     | Wajib     |
| ONB-05 | Event funnel onboarding tercatat (daftar → layar 1 → layar 2 → momen wow → selesai) untuk mengukur KPI aktivasi ≥70%          | Wajib     |

### 3.9 Entitlement & Feature Flag (ENT)

| ID     | Kebutuhan                                                                                         | Prioritas |
|--------|---------------------------------------------------------------------------------------------------|-----------|
| ENT-01 | Setiap fitur ber-gate flag yang dicek terhadap langganan pemilik di setiap request                | Wajib     |
| ENT-02 | Tahap 0: semua flag aktif (free); struktur tier Gratis/Starter/Pro/Bisnis sudah ada di skema data | Wajib     |
| ENT-03 | Downgrade tidak pernah menghapus data; fitur non-entitled menjadi read-only, bukan hilang         | Wajib     |

### 3.10 Privasi & Perlindungan Data (PDP)

Semang menyimpan data pribadi pihak ketiga (penghuni), sebagian diinput pemilik tanpa kehadiran penghuni. Kepatuhan UU 27/2022 (PDP) ditegakkan sejak Tahap 0.

| ID     | Kebutuhan                                                                                                                  | Prioritas |
|--------|----------------------------------------------------------------------------------------------------------------------------|-----------|
| PDP-01 | Privacy policy publik yang ringkas dan berbahasa Indonesia tersedia sebelum pengguna di luar lingkaran terdekat onboarding | Wajib     |
| PDP-02 | Form isi-mandiri penghuni memuat consent ringkas ("data ini dipakai untuk tagihan kost Anda") sebelum submit               | Wajib     |
| PDP-03 | Penghuni dapat meminta penghapusan datanya; pemilik difasilitasi menghapus data penghuni tertentu                          | Wajib     |
| PDP-04 | Pemilik dapat menghapus akunnya sendiri beserta seluruh data propertinya (hak penghapusan), dengan masa tenggang           | Wajib     |
| PDP-05 | Tujuan pengumpulan setiap data pribadi terbatas dan dinyatakan; tidak ada pemakaian sekunder (iklan, penjualan data)       | Wajib     |

## 4. Kebutuhan Non-Fungsional

| ID     | Kategori      | Kebutuhan                                                                                                                                                     |
|--------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-01 | Biaya         | Seluruh sistem berjalan pada free tier; tidak ada komponen berbiaya bulanan pada Tahap 0                                                                      |
| NFR-02 | Keamanan      | Isolasi multi-tenant via Row Level Security di level database; pemilik hanya dapat membaca/menulis datanya sendiri                                            |
| NFR-03 | Keamanan      | Halaman publik (isi-mandiri, upload bukti, kuitansi) memakai token acak tak-tertebak; tidak ada enumerasi ID                                                  |
| NFR-04 | Privasi       | Data penghuni tidak dibagikan ke pihak ketiga; EXIF dihapus dari semua unggahan; ekspor data tersedia bagi pemilik kapan pun                                  |
| NFR-05 | Kinerja       | Halaman upload bukti <200KB; dashboard memuat <3 detik pada koneksi 4G                                                                                        |
| NFR-06 | Keandalan     | Cron idempoten; kegagalan job dapat diulang tanpa efek samping; tidak ada single point yang menghentikan generate tagihan                                     |
| NFR-07 | Kapasitas     | Mendukung ≥50 properti × 50 kamar dalam batas Supabase Free (500MB DB, 1GB storage) dengan kompresi bukti ≤200KB                                              |
| NFR-08 | Bahasa        | Seluruh antarmuka Bahasa Indonesia non-teknis ("catatan kost", bukan "dashboard rekonsiliasi")                                                                |
| NFR-09 | Upgrade path  | Notifikasi dan pencatatan pembayaran berupa interface yang implementasinya dapat diganti (wa.me → WABA; manual → QRIS webhook) tanpa menulis ulang modul lain |
| NFR-10 | Auditabilitas | Semua aksi finansial (konfirmasi, tolak, edit tagihan) memiliki audit trail dengan timestamp dan aktor                                                        |

## 5. Aturan Bisnis

| ID    | Aturan                                                                                                                                                |
|-------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| BR-01 | Pencocokan pembayaran via token halaman upload (unik per tagihan), bukan via nominal — tahan terhadap harga beragam & pembayaran multi-bulan |
| BR-02 | Kamar bernomor >999 tidak didukung (di luar lingkup; batas kamar MVP = 50)                                                                            |
| BR-03 | Tagihan hanya ter-generate untuk kamar berstatus terisi pada tanggal siklus                                                                           |
| BR-04 | Timeout state: menunggu_konfirmasi 72 jam → pengingat ke pemilik; terkirim lewat jatuh tempo → telat; telat H+30 → menunggak                          |
| BR-05 | Reminder bertingkat: H-3, hari-H, H+3, H+7 — hanya untuk tagihan belum lunas, masuk antrean siap-kirim (tidak terkirim otomatis di Tahap 0)           |
| BR-06 | Uang tidak pernah melewati platform; Semang tidak menyimpan nomor rekening penghuni, hanya rekening tujuan milik pemilik                              |
| BR-07 | Satu kamar maksimal satu penghuni aktif; pergantian penghuni melalui checkout → isi-mandiri baru                                                      |
| BR-08 | Penghapusan properti bersifat soft-delete dengan masa tenggang 30 hari sebelum data dimusnahkan                                                       |
| BR-09 | Penghuni masuk tengah bulan: tagihan pertama dibuat manual oleh pemilik (nominal bebas); siklus otomatis dimulai bulan berikutnya                     |
| BR-10 | Jatuh tempo tanggal 29–31: bila melebihi hari terakhir bulan, jatuh tempo dipindah ke hari terakhir bulan tersebut                                    |
| BR-11 | Pembayaran sebagian tidak didukung di MVP: satu bukti melunasi satu tagihan penuh; jumlah kurang ditolak dengan catatan                               |
| BR-12 | Bayar beberapa bulan sekaligus didukung: satu bukti, pemilik konfirmasi beberapa tagihan terkait (pencocokan via token menjamin tanpa ambiguitas)    |
| BR-13 | Perubahan harga sewa hanya berlaku untuk tagihan yang belum ter-generate; tagihan yang sudah ada tidak berubah surut                                  |
| BR-14 | Checkout dengan tunggakan: tagihan menunggak tetap hidup, tertaut ke penghuni yang sudah keluar, muncul di laporan piutang                            |
| BR-15 | Deposit/uang jaminan dikecualikan dari MVP (keputusan sadar, bukan kelalaian) — lihat §8                                                              |
| BR-16 | Bila kode unik opsional (TGH-09) aktif: nominal dasar dibulatkan ke ribuan terdekat ke bawah sebelum kode kamar ditambahkan; pemilik diberi tahu nominal final |

## 6. Batasan (Constraints)

- Tidak ada integrasi payment gateway, WABA, atau layanan berbayar apa pun pada Tahap 0.
- Pengiriman pesan WA selalu melalui aksi manual pemilik (tap wa.me); sistem tidak pernah mengirim WA otomatis di Tahap 0.
- Penghuni tidak memiliki akun; semua interaksi penghuni stateless via link bertoken.
- Penyimpanan bukti dibatasi kuota Supabase Free; kebijakan retensi ditentukan di Open Questions.

## 7. Kebutuhan Antarmuka

- **Dashboard pemilik (web, mobile-first):** wizard onboarding, antrean siap-kirim, daftar tagihan, konfirmasi bukti, laporan, pengaturan properti.
- **Halaman publik penghuni:** form isi-mandiri, halaman upload bukti, halaman kuitansi — semuanya tanpa login, ringan, bertoken.
- **Deep link wa.me:** `https://wa.me/<nomor>?text=<pesan ter-encode>` — dihasilkan `NotificationSender` implementasi Tahap 0.
- **Email (Resend):** notifikasi bukti masuk, pengingat konfirmasi 72 jam, ringkasan bulanan.

## 8. Lingkup yang Dikecualikan

QRIS/payment gateway, pengiriman WA otomatis (WABA), portal penghuni ber-akun, peran staf/penjaga kost, listing & booking publik, kontrak digital, screening/KYC, meter listrik, laporan pajak, aplikasi mobile native, multi-properti per akun, smart lock/IoT. Semua berada di roadmap PRD §15.

## 9. Kriteria Penerimaan (selaras KPI PRD)

| Kebutuhan terkait | Kriteria lulus                                                                |
|-------------------|-------------------------------------------------------------------------------|
| ONB-01…05         | ≥70% pendaftar mencapai momen wow (contoh tagihan terbuka di WA)              |
| PHN-01            | ≥60% kamar terisi datanya via isi-mandiri tanpa input pemilik pada kost pilot |
| TGH, BKT          | ≥1 pembayaran tercatat via alur bukti + konfirmasi per kost pilot per bulan   |
| Keseluruhan       | 2–3 kost pilot bertahan ≥2 siklus tanpa intervensi founder                    |
| NFR-06            | Tidak ada tagihan duplikat atau hilang selama masa pilot                      |

## 10. Open Questions

- Kebijakan retensi foto bukti pada kuota 1GB: hapus setelah N bulan, atau kompres ulang bertahap?
- Apakah link isi-mandiri perlu PIN tambahan untuk kost yang QR-nya tertempel di area publik?
- Format nomor kamar non-numerik (mis. "A1", "B2") — `room_number` numerik untuk logika + `label` bebas untuk tampilan; konfirmasi cukup untuk semua kasus pilot?
- Masa tenggang penghapusan akun pemilik (PDP-04): berapa lama sebelum data benar-benar dimusnahkan?
