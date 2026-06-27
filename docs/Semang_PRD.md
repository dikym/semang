# SEMANG — Product Requirement Document (PRD)

**Versi:** 1.0 (MVP) · **Status:** Draft · **Bahasa:** Indonesia
**Acuan:** Riset pain point pemilik kost Indonesia (Juni 2026); diskusi desain produk Semang

> **Tagline:** Kost-mu ditagih otomatis, uang masuk tercatat sendiri, tanpa kamu menagih siapa-siapa.
> **Fokus:** menghapus rasa sungkan menagih · merapikan pencatatan · membangun kepercayaan bertahap

## 1. Product Overview

**Product Name:** Semang

**Product Type:** Platform manajemen kost berbasis web (SaaS), modular, multi-tenant — dengan portal penghuni sebagai pembeda di fase berikutnya.

**Problem Statement:** Mayoritas pemilik kost Indonesia (skala 5–20 kamar) masih mengelola bisnis dengan buku tulis dan WhatsApp. Tiga masalah paling menyakitkan secara berurutan: (1) menagih sewa terasa sungkan sehingga tunggakan menumpuk, (2) pencatatan manual berantakan — bukti transfer terselip di chat, KTP tercecer, (3) pembayaran nyasar karena transfer masuk tanpa keterangan. Kompetitor yang ada (SuperKos, KelolaPro, Mamikos) sudah menyentuh masalah ini tetapi belum ada pemenang dominan di sisi manajemen; celah masuknya ada di harga yang lebih adil, friksi adopsi yang lebih rendah, dan kepercayaan yang dibangun bertahap.

**Konteks pengembangan:** Side project solo untuk mengasah skill full-stack, product thinking, dan bisnis. Batasan keras: biaya operasional Rp0 pada Tahap 0. Prioritas proyek ini berada di atas Holdin karena tidak menampung dana pengguna sehingga bebas beban lisensi PJP.

## 2. Filosofi Inti

Semua keputusan produk tunduk pada empat prinsip berikut — bila ada konflik, urutan ini adalah prioritasnya:

1. **Platform tidak pernah menampung uang pengguna.** Uang mengalir langsung penghuni → rekening pemilik. Ini menghilangkan beban regulasi sekaligus membangun kepercayaan awal.
2. **Friksi adopsi serendah mungkin.** Onboarding <10 menit, penghuni mengisi datanya sendiri, bahasa non-teknis di seluruh antarmuka. Pemilik kost non-teknis (45–60 tahun) harus bisa memakai tanpa panduan.
3. **Nilai terasa di siklus pertama.** Momen "wow" harus terjadi sebelum tagihan pertama: pemilik melihat pesan tagihan WhatsApp profesional atas nama kost-nya sendiri dalam 5 menit setelah daftar.
4. **Upgrade path terbuka, bukan jebakan.** Data tidak pernah disandera. Downgrade ke Gratis tetap mempertahankan semua data. Setiap lapisan teknis (notifikasi, pembayaran) dapat diganti implementasinya tanpa menulis ulang modul lain.

## 3. Goals

**Primary Goal:** Menjadi cara paling sederhana bagi pemilik kost Indonesia untuk menagih, mencatat, dan mengelola kost — dimulai dari yang masih pakai buku tulis.

**MVP Goals:**

- Kalahkan buku tulis + WhatsApp sebagai sistem pencatatan kost, bukan kalahkan SuperKos.
- Capai ≥70% pendaftar yang menyelesaikan wizard sampai momen "kirim contoh tagihan ke WA saya".
- 2–3 kost pilot di Denpasar memakai produk untuk ≥2 siklus tagihan berturut-turut.
- ≥1 pembayaran tercatat melalui alur bukti transfer + konfirmasi pada setiap kost pilot per bulan.
- Validasi harga: ≥3 dari 10–15 pemilik kost yang diwawancara menyatakan minat berbayar konkret.

## 4. Target Market

**Initial Target:** Pemilik kost skala 5–20 kamar di kota-kota dengan populasi mahasiswa dan pekerja (Denpasar, Yogyakarta, Bandung, Surabaya, Jakarta) yang masih mengelola secara manual atau tidak puas dengan biaya/kompleksitas kompetitor.

**User Segments:**

- **Bu Sari — pemilik manual (persona utama):** 8–15 kamar, 45–60 tahun, non-teknis, catat di buku, tagih via chat pribadi. Kebutuhan: tidak perlu menagih sendiri; catatan rapi tanpa belajar aplikasi rumit.
- **Pak Dimas — pemilik berplatform:** 20–50 kamar, sudah pakai SuperKos atau sejenis. Kebutuhan: harga lebih adil (tagih per kamar terisi), migrasi mudah.
- **Rara — penghuni kost:** Mahasiswa/karyawan muda. Kebutuhan: tagihan jelas, bukti bayar tersimpan, status lunas transparan, lapor kerusakan mudah.
- **Mas Putu — penjaga kost (Tahap 2+):** Operasional harian atas nama pemilik. Kebutuhan: akses terbatas sesuai peran.

## 5. Initial Scope (MVP)

**Prinsip lingkup:** Hanya fitur yang menyasar pain point #1–#3 (sungkan menagih, pencatatan berantakan, pembayaran nyasar) yang masuk MVP. Semua fitur lain masuk roadmap.

**Fitur yang didukung MVP:**

- Manajemen kost & kamar (buat, generate massal, harga default, jatuh tempo).
- Data penghuni dengan input mandiri via link/QR per kamar.
- Tagihan otomatis dengan kode unik nominal per kamar.
- Pengiriman tagihan semi-otomatis via link wa.me pre-filled.
- Upload bukti transfer tanpa install aplikasi.
- Konfirmasi pembayaran satu-tap + kuitansi digital otomatis.
- Reminder bertingkat semi-otomatis (H-3, hari-H, H+3, H+7).
- Pencatatan dan laporan kas sederhana + ekspor CSV/Excel.
- Dashboard onboarding hidup (checklist progres, bukan layar kosong).
- Struktur entitlement/feature-flag sejak hari pertama (semua flag aktif selama gratis).

**Tidak termasuk MVP:** QRIS/payment gateway, WABA otomatis penuh, portal penghuni, peran staf, listing & booking publik, kontrak digital, screening/KYC penghuni, meter listrik, laporan pajak, aplikasi mobile native, multi-properti, smart lock/IoT.

**Velocity limit awal:** 1 akun per nomor WA; maksimal 50 kamar per properti pada free tier percobaan internal.

## 6. Core Features

### 6.1 Manajemen kost & kamar

Pemilik membuat kost dengan nama, kota, dan jumlah kamar via slider. Sistem men-generate kamar otomatis (Kamar 1…N) dengan harga sewa default dan tanggal jatuh tempo tunggal yang dapat dioverride per kamar. CRUD penuh tersedia setelah onboarding.

### 6.2 Data penghuni dengan input mandiri

Setiap kamar mendapat link/QR unik. Pemilik menyebarkan link ke grup WA kost; penghuni membuka di browser, mengisi nama dan nomor WA sendiri. Input manual dan impor sederhana tetap tersedia sebagai fallback. Beban input data pindah dari pemilik ke penghuni — pembeda utama dari kompetitor yang mewajibkan pemilik mengetik semuanya.

### 6.3 Tagihan otomatis & pencocokan via token

Tagihan ter-generate tiap siklus dengan nominal bulat dan wajar (mis. Rp1.500.000) — tidak diubah-ubah. Pencocokan pembayaran tidak bergantung pada nominal, melainkan pada **token halaman upload yang unik per tagihan**: ketika penghuni mengunggah bukti melalui link di pesan tagihannya, sistem sudah tahu persis bukti itu untuk tagihan mana. Ini lebih andal daripada trik nominal (tahan terhadap harga kamar yang berbeda-beda maupun pembayaran beberapa bulan sekaligus) dan menyelesaikan pain point "pembayaran nyasar" tanpa QRIS dan tanpa mengubah angka yang dilihat penghuni.

**Kode unik nominal (opsional).** Bagi pemilik yang gemar mengenali transfer langsung dari notifikasi m-banking sebelum membuka aplikasi, tersedia fitur opt-in yang menambahkan kode kamar sebagai tiga digit terakhir nominal (mis. Rp1.500.003 untuk Kamar 3). Fitur ini murni kenyamanan tambahan, bukan mekanisme pencocokan inti — default-nya mati, dan nominal tetap bulat kecuali pemilik menyalakannya.

### 6.4 Pengiriman tagihan semi-otomatis via wa.me

Sistem menulis pesan tagihan lengkap (nominal + nomor rekening pemilik + link upload bukti) dan menyimpannya di antrean "siap kirim". Pemilik tap tombol per penghuni → WhatsApp terbuka dengan pesan sudah terketik rapi → pemilik hanya tekan send. Sepuluh tagihan selesai dalam dua menit. Uang mengalir langsung ke rekening pemilik; platform tidak menyentuh dana. Biaya notifikasi: Rp0. Saat modal tersedia, lapisan ini diganti WABA tanpa mengubah modul lain (interface `NotificationSender`).

### 6.5 Upload bukti transfer tanpa install

Link dalam pesan tagihan membuka halaman web ringan (<200KB, berfungsi di HP murah dengan sinyal lemah). Penghuni memfoto atau mengunggah bukti transfer; gambar dikompres di sisi client sebelum dikirim. Selesai dalam 30 detik, tanpa install aplikasi apa pun.

### 6.6 Konfirmasi satu-tap + kuitansi digital

Pemilik menerima notifikasi: "Kamar 3 mengirim bukti untuk tagihan Juni Rp1.500.000 — Terima?" Satu ketukan → pembayaran tercatat, kuitansi digital otomatis tersimpan dan dapat diakses penghuni, laporan kas ter-update. Jejak waktu (audit trail) tersimpan di setiap aksi.

### 6.7 Reminder bertingkat semi-otomatis

Sistem menyiapkan pesan reminder H-3, hari-H, dan H+3 di antrean "siap kirim" untuk penghuni yang belum membayar. Pemilik tinggal tap — tidak perlu mengetik atau mengingat. Ini yang menghapus rasa sungkan: sistem yang mengingatkan, bukan pemilik.

### 6.8 Laporan kas & ekspor

Rekap uang masuk per bulan, daftar lunas/telat/menunggak per kamar, grafik tren sederhana. Ekspor CSV dan Excel. Laporan bulanan otomatis dikirim ringkasannya ke pemilik via WhatsApp/email sebagai pengingat nilai produk ("bulan ini Rp22 juta tercatat otomatis").

## 7. Trust & Safety

### 7.1 Kepercayaan pembayaran (tangga bertahap)

Tahap 0 (MVP): uang mengalir langsung penghuni → rekening pemilik. Platform hanya pembawa pesan dan pencatat. Kepercayaan dibangun selama berbulan-bulan sebelum QRIS ditawarkan. Saat QRIS hadir (Tahap 3), framing selalu: "settlement langsung ke rekening Anda — kami tidak pernah memegang uang Anda."

### 7.2 Keamanan data

Multi-tenant isolation via Supabase Row Level Security (RLS): setiap pemilik hanya dapat mengakses datanya sendiri, dikunci di level database bukan hanya aplikasi. Halaman upload bukti memakai token tak tertebak per tagihan. Kompresi gambar client-side tanpa menyimpan metadata EXIF.

### 7.3 Privasi penghuni

Data penghuni (nama, nomor WA, foto bukti transfer) hanya dapat diakses pemilik kost terkait. Data tidak dijual, tidak dibagikan ke pihak ketiga, tidak dipakai untuk iklan. Pemilik dapat mengekspor seluruh datanya kapan pun. Downgrade tier tidak pernah menghapus data.

### 7.4 Transparansi platform

Satu harga, semua fitur inti, tanpa komisi tersembunyi, tanpa pay-to-reply. Free tier permanen (≤5 kamar) tidak mengunci data. Pemilik yang berhenti berlangganan turun ke Gratis dengan anggun — tidak diblokir, tidak diancam.

## 8. Alur Tagihan (State Machine)

### 8.1 Prinsip state machine

Setiap node memiliki timeout dengan default aman — tidak ada tagihan yang menggantung tanpa batas. Prinsip ini sama dengan yang diterapkan di Holdin: seluruh state machine harus self-resolving tanpa intervensi manual.

### 8.2 Transisi state

| Status              | Timeout              | Aksi default saat timeout             | Pihak yang perlu bertindak   |
|---------------------|----------------------|---------------------------------------|------------------------------|
| terjadwal           | —                    | generate otomatis saat siklus tiba    | sistem                       |
| terkirim            | lewat jatuh tempo    | tandai telat; reminder H+3/H+7 antre  | pemilik (kirim reminder)     |
| menunggu_konfirmasi | 72 jam               | kirim pengingat konfirmasi ke pemilik | pemilik                      |
| telat               | H+30 tanpa bayar     | tandai menunggak                      | sistem                       |
| menunggak           | —                    | masuk laporan khusus (piutang)        | pemilik                      |

### 8.3 Pohon transisi

```
Siklus tagihan dimulai
└─ draft
   └─(siklus tiba) → terjadwal
      └─(pemilik tap kirim) → terkirim
         ├─(penghuni upload bukti) → menunggu_konfirmasi
         │  ├─(pemilik terima) → lunas
         │  ├─(pemilik tolak) → terkirim (dengan catatan)
         │  └─(timeout 72 jam tanpa aksi) → pengingat ke pemilik
         └─(lewat jatuh tempo) → telat
            ├─(reminder H+3, H+7) → terkirim*
            └─(H+30 tanpa pembayaran) → menunggak [laporan & badge]
```

### 8.4 Aturan penagihan kasus nyata

Selain happy path di atas, aturan berikut mengikat agar perilaku penagihan dapat diprediksi:

- **Penghuni masuk tengah bulan:** tagihan pertama dibuat manual oleh pemilik dengan nominal bebas (mis. prorata atau bayar di muka sesuai kesepakatan); siklus otomatis dimulai bulan berikutnya.
- **Jatuh tempo tanggal 29–31:** bila tanggal jatuh tempo melebihi hari terakhir bulan berjalan (mis. 31 di bulan Februari), tagihan jatuh tempo pada hari terakhir bulan tersebut.
- **Pembayaran sebagian:** tidak didukung pada MVP — satu bukti melunasi satu tagihan secara penuh; bukti dengan jumlah kurang ditolak pemilik dengan catatan.
- **Bayar beberapa bulan sekaligus:** didukung — penghuni mengunggah satu bukti, pemilik mengonfirmasi beberapa tagihan yang relevan; karena pencocokan via token bukan nominal, ini tidak menimbulkan ambiguitas.
- **Perubahan harga sewa:** hanya berlaku untuk tagihan yang belum ter-generate; tagihan yang sudah ada tidak berubah surut.
- **Checkout dengan tunggakan:** tagihan menunggak tetap hidup dan tertaut ke penghuni yang sudah keluar, muncul di laporan piutang.
- **Pembulatan kode unik (bila fitur opsional aktif):** nominal dasar dibulatkan ke ribuan terdekat ke bawah sebelum kode kamar ditambahkan; pemilik diberi tahu nominal final saat mengaktifkan fitur.

## 9. Onboarding & User Flow

### 9.1 Wizard onboarding web (target <10 menit sampai momen wow)

1. Daftar dengan email + nomor WA + password (tanpa verifikasi email demi friksi serendah mungkin); login berikutnya via email atau nomor WA + password.
2. Layar 1: nama kost, kota, jumlah kamar via slider → kamar ter-generate otomatis.
3. Layar 2: harga sewa default + tanggal jatuh tempo.
4. **Momen wow:** preview pesan tagihan WA atas nama kost sendiri + tombol "Kirim contoh ke WhatsApp saya". Pemilik menerima pesan di HP-nya dalam 5 detik.
5. Layar 3: pilih cara isi penghuni — QR isi mandiri, foto buku catatan, atau input manual.
6. Dashboard pertama: checklist progres hidup + kartu "Tagihan berikutnya siap tanggal 5 Juli", bukan layar kosong.

### 9.2 Siklus bulanan

1. Tagihan ter-generate otomatis di tanggal siklus.
2. Pemilik tap "Kirim semua" atau per penghuni → WA terbuka dengan pesan siap kirim.
3. Penghuni transfer langsung ke rekening pemilik, lalu upload bukti via link dalam pesan.
4. Pemilik menerima notif + preview bukti yang sudah dicocokkan → konfirmasi satu-tap.
5. Kuitansi digital terkirim ke penghuni, laporan kas ter-update, audit trail tersimpan.

### 9.3 Onboarding lanjutan via WhatsApp (tanpa WABA)

H+1: notif email/web "2 penghuni belum isi data — kirim ulang link?" H sebelum jatuh tempo: "Besok tagihan pertama siap dikirim ke 8 penghuni." Setelah pembayaran pertama tercatat: ringkasan nilai ("Kamar 3 Rp1.500.003 tercatat — tidak perlu cek mutasi manual").

## 10. Model Monetisasi

### 10.1 Struktur paket

|             | Gratis                                        | Starter                                                                 | Pro                                          | Bisnis                                |
|-------------|-----------------------------------------------|-------------------------------------------------------------------------|----------------------------------------------|---------------------------------------|
| Harga       | Rp0                                           | Rp2.000/kamar/bln                                                       | Rp3.500/kamar/bln                            | Rp5.000/kamar/bln                     |
| Minimum     | —                                             | Rp20.000/bln                                                            | —                                            | Rp250.000/bln                         |
| Batas kamar | ≤5 kamar                                      | ≤15 kamar                                                               | ≤50 kamar                                    | Tak terbatas                          |
| Properti    | 1                                             | 1                                                                       | 3                                            | Tak terbatas                          |
| Fitur inti  | Tagihan + bukti + konfirmasi + reminder dasar | + reminder bertingkat & denda otomatis, meter listrik, laporan + ekspor | + portal penghuni, tiket maintenance, 2 staf | + P&L per properti, staf tak terbatas |

### 10.2 Mekanisme trial & konversi

**Trial:** 2 siklus tagihan penuh (bukan 30 hari), semua fitur Pro terbuka, tanpa kartu kredit. Berakhir dengan downgrade anggun ke Gratis — data tidak hilang, tagihan manual tetap jalan, hanya otomasi yang berhenti. Opsi bayar tahunan diskon ±2 bulan (benchmark KelolaPro Rp999.000/tahun).

**Nudge konversi:** Di akhir trial tampilkan angka pengguna sendiri — "14 tagihan terkirim otomatis, Rp21.000.000 tercatat tanpa cek mutasi" — bukan diskon generik.

### 10.3 Add-on

- Listing + online booking: Rp50.000/bln.
- Kontrak digital + e-acknowledge aturan kost: Rp25.000/bln.
- Screening penghuni (KYC ringan): Rp25.000/bln.

### 10.4 Diferensiasi pricing

Pertimbangkan model **tagih hanya kamar terisi** (bukan total kamar) — menjawab keluhan eksplisit terhadap SuperKos ("6.000/pintu mahal kalau kamar tidak penuh"). Diputuskan sebelum monetisasi aktif.

> Tanpa markup fee transaksi saat QRIS hadir — MDR dibayar transparan ke gateway (kepatuhan larangan surcharge PBI 23/6/PBI/2021 Pasal 52).

## 11. Tech Stack (Tahap 0, biaya Rp0)

- **Frontend + API:** Next.js di Vercel Hobby plan — free tier memadai untuk ratusan pengguna; Vercel Cron untuk job harian.
- **Database + Auth + Storage:** Supabase free — PostgreSQL + RLS multi-tenant + 1GB storage bukti transfer (≈5.000–10.000 foto terkompresi).
- **Notifikasi:** Link wa.me pre-filled via interface `NotificationSender` — Rp0, legal, tanpa risiko ban; siap diganti WABA saat ada modal.
- **Email cadangan:** Resend free tier — 3.000 email/bulan untuk kuitansi dan notifikasi non-WA.
- **Domain:** Subdomain vercel.app → semang.my.id (±Rp15.000/tahun) saat ada pengguna di luar lingkaran.
- **Penjadwalan:** Vercel Cron + GitHub Actions schedule — idempoten, eksekusi ganda tidak menghasilkan tagihan ganda.

Keputusan arsitektur kunci:

- Notifikasi & pembayaran sebagai interface yang dapat ditukar implementasinya (wa.me → WABA; konfirmasi manual → QRIS webhook).
- Tagihan sebagai state machine dengan timeout default aman di setiap node.
- Tabel entitlement/feature-flag dibangun sejak hari pertama; semua flag aktif selama free.
- Pencatatan pembayaran terpisah dari pemrosesan pembayaran sehingga integrasi gateway kelak hanya menambah satu sumber data baru.

## 12. KPIs

| Metrik                                     | Target                                 |  Mengukur                |
|--------------------------------------------|----------------------------------------|--------------------------|
| Aktivasi wizard → contoh tagihan terkirim  | ≥70% pendaftar                         | Beratnya onboarding      |
| Penghuni isi-mandiri per kost pilot        | ≥60% kamar terisi tanpa input pemilik  | Efektivitas QR mandiri   |
| Pembayaran tercatat via bukti + konfirmasi | ≥1/kost/bulan, naik tiap siklus        | Nilai inti terasa        |
| Retensi pilot                              | 2–3 kost bertahan ≥2 siklus            | Kelayakan lanjut Tahap 1 |
| Sinyal bayar dari wawancara                | ≥3 dari 10–15 menyatakan minat konkret | Kelayakan monetisasi     |

## 13. Risks

### 13.1 Risiko operasional

| Risiko                                                        | Dampak                                    | Mitigasi                                                                                  |
|---------------------------------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------|
| Belum ada validasi pengguna nyata (riset masih desk research) | Membangun produk yang tidak dibutuhkan    | Wawancara 10–15 pemilik kost Denpasar sebelum/selama Tahap 0; pilot di kost nyata         |
| Unit economics WABA (biaya per pesan memakan margin Starter)  | Harga tier tidak menutup biaya di Tahap 2 | Hitung tarif WABA aktual sebelum monetisasi; kombinasi WA kunci + web/email untuk sisanya |
| Engagement rendah (produk disentuh beberapa kali/bulan)       | Churn "balik ke buku"                     | Laporan bulanan otomatis; notifikasi nilai rutin ("bulan ini Rp22jt tercatat")            |
| Godaan otomasi WA tidak resmi (Baileys, whatsapp-web.js)      | Nomor dibanned, reputasi rusak            | Tetap di wa.me hingga mampu WABA resmi                                                    |
| Data pribadi penghuni bocor                                   | Hukum & kepercayaan                       | RLS ketat, token upload tak tertebak, kompresi tanpa EXIF                                 |

### 13.2 Risiko bisnis

| Risiko                                                  | Dampak                        | Mitigasi                                                                                             |
|---------------------------------------------------------|-------------------------------|------------------------------------------------------------------------------------------------------|
| Moat fitur tipis — mudah ditiru kompetitor              | Kalah bersaing setelah traksi | Menang di distribusi (komunitas FB, konten TikTok/Reels, referral antar pemilik) & kecepatan iterasi |
| Waktu solo developer (kuliah UT + kerja + Holdin)       | Proyek mangkrak               | Blok waktu tetap; lingkup MVP dijaga ketat; fitur baru hanya lewat revisi PRD                        |
| Pemilik lebih suka bayar sekali/tahunan (bukan bulanan) | Konversi SaaS rendah          | Tawarkan opsi tahunan sejak awal; uji lisensi flat ≤10 kamar                                         |

## 14. Revenue Model

**Transaction Fee:** Tidak ada pada Tahap 0–2. Saat QRIS hadir (Tahap 3), MDR dibayar transparan ke gateway — platform tidak menambah markup atas MDR (kepatuhan PBI 23/6/PBI/2021).

**Subscription:** Rp2.000–5.000/kamar/bulan sesuai tier (lihat §10). Pendapatan utama.

**Add-on:** Listing + booking, kontrak digital, screening penghuni (lihat §10.3).

**Potensi Tahap 3+:** Setelah kepercayaan terbangun dan volume transaksi QRIS signifikan, evaluasi model revenue sharing atau settlement fee yang patuh regulasi — bukan surcharge ke penghuni.

> Validasi harga dan model tagih-per-kamar-terisi harus diselesaikan sebelum monetisasi aktif di Tahap 2.

## 15. Future Roadmap

**Tahap 1 — Publik terbatas** (pemicu: pilot bertahan ≥2 siklus, ada permintaan dari luar lingkaran):

- Domain semang.my.id.
- Meter listrik per kamar dengan foto meteran (FR-10).
- Perbaikan iteratif dari feedback pilot.

**Tahap 2 — Monetisasi** (pemicu: validasi harga tercapai §3):

- Aktifkan paket berbayar Starter/Pro/Bisnis.
- WABA pay-as-you-go — reminder full otomatis; biaya dibayar dari pendapatan langganan.
- Portal penghuni: riwayat tagihan, lapor kerusakan (tiket), info aturan kost (FR-11).
- Akun staf/penjaga kost dengan role terbatas (FR-12).

**Tahap 3 — Pembayaran** (pemicu: pengguna berbayar stabil & meminta otomasi penuh):

- QRIS/VA via gateway (Midtrans/Xendit) dengan settlement langsung ke rekening pemilik + auto-rekonsiliasi.
- Listing halaman publik kost + ketersediaan kamar + booking online (FR-14).
- Add-on kontrak digital + screening penghuni.

**Tahap 4 — Ekosistem:**

- Smart lock / IoT integrasi untuk segmen premium.
- API untuk integrasi properti manajemen pihak ketiga.
- Program referral terstruktur antar pemilik kost.

## 16. Success Criteria

Semang dianggap berhasil melewati Tahap 0 jika semua kondisi berikut terpenuhi dalam 3 bulan pertama:

- ≥2 kost pilot memakai produk aktif untuk ≥2 siklus tagihan berturut-turut tanpa diminta.
- ≥1 pembayaran per bulan tercatat via alur bukti + konfirmasi di setiap kost pilot.
- ≥3 pemilik kost dari luar lingkaran terdekat menyatakan minat membayar yang konkret setelah melihat demonstrasi atau landing page.
- Tidak ada insiden kebocoran data atau bug kritis yang memengaruhi data keuangan pengguna pilot.

## 17. Open Questions

- Reset password ditunda ke pasca-MVP; saat dibutuhkan, jalur gratis sudah jelas (Supabase Auth + Resend sebagai SMTP). Sampai itu hadir, pemilihan password harus aman dan pemilik diimbau mencatat kredensialnya.
- Model "tagih hanya kamar terisi": diferensiasi kuat vs kompleksitas penagihan dan edge case — diputuskan sebelum monetisasi.
- Tarif WABA aktual per kategori pesan (utility vs marketing) dan dampaknya ke breakeven harga Starter — wajib dihitung sebelum Tahap 2.
- Verifikasi nama Semang: cek merek terdaftar di PDKI (pdki-indonesia.dgip.go.id), ketersediaan domain semang.id / semang.my.id, tidak ada aplikasi lokal bernama sama di Play Store.
- Format impor "foto buku catatan": manual oleh founder di Tahap 0, atau OCR sejak awal?
- Kebijakan retensi foto bukti transfer pada free tier Supabase 1GB — berapa lama disimpan, apa yang terjadi saat mendekati batas?
