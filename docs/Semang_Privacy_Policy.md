# SEMANG — Kebijakan Privasi

**Versi:** 1.0 · **Berlaku sejak:** [tanggal rilis] · **Bahasa:** Indonesia
**Acuan:** UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP); Semang PRD/SRD v1.0

> **Ringkas:** Semang membantu pemilik kost menagih dan mencatat pembayaran. Kami menyimpan data secukupnya untuk itu, tidak menjualnya, dan tidak pernah memegang uang Anda.

## 1. Siapa Kami

Semang adalah platform manajemen kost berbasis web. Dokumen ini menjelaskan data pribadi apa yang kami kumpulkan, untuk apa, dan hak Anda atas data tersebut. Dengan menggunakan Semang, Anda menyetujui praktik yang dijelaskan di sini.

## 2. Data yang Kami Kumpulkan

**Dari pemilik kost (pengguna terdaftar):**

- Nama, alamat email, nomor WhatsApp, dan kata sandi (kata sandi disimpan dalam bentuk ter-enkripsi/hash, tidak pernah sebagai teks biasa).
- Data rekening bank tujuan transfer (nama bank, nomor rekening, nama pemilik rekening) — dipakai semata untuk dicantumkan pada tagihan kepada penghuni Anda.
- Data kost: nama, kota, daftar kamar, harga sewa, tanggal jatuh tempo.

**Dari penghuni kost:**

- Nama dan nomor WhatsApp — diisi sendiri oleh penghuni melalui tautan, atau dimasukkan oleh pemilik kost.
- Foto bukti transfer yang diunggah penghuni. Metadata lokasi (EXIF) dihapus otomatis sebelum disimpan.

**Yang TIDAK kami kumpulkan:** nomor rekening penghuni, data pembayaran kartu, lokasi GPS, atau data sensitif lain yang tidak diperlukan.

## 3. Untuk Apa Data Digunakan

| Data                                | Tujuan                                                               |
|-------------------------------------|----------------------------------------------------------------------|
| Email, nomor WA, kata sandi pemilik | Autentikasi akun dan menghubungi pemilik terkait akunnya             |
| Rekening bank pemilik               | Dicantumkan pada pesan tagihan agar penghuni dapat transfer langsung |
| Nama & nomor WA penghuni            | Menyusun pesan tagihan dan kuitansi yang ditujukan kepada penghuni   |
| Foto bukti transfer                 | Verifikasi pembayaran oleh pemilik kost                              |

Kami menerapkan prinsip pembatasan tujuan: data hanya dipakai untuk hal di atas. Kami tidak memakai data Anda untuk iklan, tidak menjualnya, dan tidak membaginya ke pihak ketiga untuk kepentingan komersial mereka.

## 4. Penyimpanan & Keamanan

- Data disimpan pada infrastruktur tepercaya (Supabase) dengan isolasi antar-pengguna di tingkat basis data: setiap pemilik hanya dapat mengakses data kostnya sendiri.
- Halaman publik (pengisian data, unggah bukti, kuitansi) diamankan dengan tautan bertoken acak yang tidak dapat ditebak.
- Uang tidak pernah melewati Semang. Transfer terjadi langsung dari penghuni ke rekening pemilik kost.

## 5. Pembagian Data

Kami tidak membagikan data pribadi Anda kecuali: (a) kepada penyedia infrastruktur yang memproses data atas perintah kami (penyimpanan, pengiriman email) dengan kewajiban menjaga kerahasiaan; atau (b) bila diwajibkan oleh hukum yang berlaku.

## 6. Hak Anda

Sesuai UU PDP, Anda berhak:

- **Mengakses** data pribadi Anda yang kami simpan.
- **Memperbaiki** data yang tidak akurat.
- **Menghapus** data Anda. Pemilik dapat menghapus akun beserta seluruh data kostnya; penghuni dapat meminta penghapusan datanya kepada pemilik kost atau kepada kami.
- **Menarik persetujuan** atas pemrosesan data, dengan konsekuensi sebagian layanan tidak dapat berjalan.

Permintaan dapat diajukan melalui kontak pada bagian akhir dokumen ini.

## 7. Penghuni yang Datanya Dimasukkan Pemilik

Sebagian data penghuni dimasukkan oleh pemilik kost. Pada formulir pengisian mandiri, penghuni diberi tahu bahwa datanya dipakai untuk keperluan penagihan kost. Penghuni dapat meminta penghapusan datanya kapan saja.

## 8. Retensi Data

Data disimpan selama akun aktif dan diperlukan untuk layanan. Saat akun dihapus, data dimusnahkan setelah masa tenggang. Foto bukti transfer dapat dihapus secara berkala sesuai kebijakan penyimpanan; kuitansi yang sudah terbit tetap dapat diakses pemilik selama dibutuhkan.

## 9. Perubahan Kebijakan

Kebijakan ini dapat diperbarui. Perubahan penting akan diberitahukan melalui aplikasi. Tanggal "Berlaku sejak" di atas menunjukkan versi terkini.

## 10. Kontak

Pertanyaan atau permintaan terkait data pribadi dapat disampaikan melalui [email/kontak resmi Semang]. Kami berupaya menanggapi dalam waktu yang wajar sesuai ketentuan UU PDP.

> Catatan: dokumen ini adalah draf kerja Tahap 0 dan bukan nasihat hukum. Sebelum rilis publik, tinjau bersama pihak yang memahami UU PDP dan lengkapi placeholder ([tanggal], [kontak]).
