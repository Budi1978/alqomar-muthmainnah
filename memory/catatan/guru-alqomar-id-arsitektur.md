---
judul: guru.alqomar.id — arsitektur aplikasi guru yang ASLI
tipe: catatan
tags: [proyek, platform-guru, penting, arsitektur]
diperbarui: 2026-09-19
---

# guru.alqomar.id — aplikasi internal guru (yang benar-benar dipakai)

Bagian dari [[index]]. **Baca ini sebelum menyentuh apa pun yang berkaitan dengan "Platform Guru".**

## Tiga website sekolah (konfirmasi user 19 Sep 2026)
1. **alqomar.sch.id** — website sekolah (repo `alqomar-muthmainnah`, Hostinger, Supabase Sydney `gzcgyqntluhxxrvbcwin`).
2. **guru.alqomar.id** — web internal guru: SEMUA aktivitas & pekerjaan kepsek + guru ada di sini. Menu: Beranda, Panduan, Data Guru, Data Siswa, RPP, Presensi, Jurnal, Nilai & Rapor, Jadwal, Tugas, Pelatihan Guru, Dokumenku, Supervisi, **Setoran ODOA**, Buat Soal, Notifikasi (Kepala Sekolah).
3. **gaji.alqomar.id** — web gaji, pribadi user (Supabase `cuqwjgxipzwwecolbuav` "gaji-guru").

## Arsitektur guru.alqomar.id — SUDAH LIHAT KODE (19 Sep 2026, user upload Page Source)
- **Satu file HTML ~1,28 MB, ~18 ribu baris**, judul "Platform Guru Al-Qomar". React 18 + **Babel standalone** (JSX dikompilasi di browser → nama variabel tidak diminifikasi), Chart.js. Arsip versi asli: `_backup/guru.alqomar.id/Platform_Guru_Al-Qomar.2026-09-19.asli.html` di repo ini.
- **Backend:** Firebase project `alqomar-guru` — Auth + Realtime Database `https://alqomar-guru-default-rtdb.asia-southeast1.firebasedatabase.app` (data), Supabase Tokyo `lnacvtvufgsxnqhuezox` hanya Storage (bucket `dokumen_`, `pelatihan-tugas`). Claude tidak punya akses Firebase.
- **Node RTDB terkait ODOA:** `halaqah/<hid>` (field `nama`, `pembimbing` = NIP, `daftarPembimbing{...nip}` sejak SK 13 Juli 2026, `anggota{siswaId:true}`), `odoa/<pushId>` (setoran: siswaId, tanggal, surah, nomor, dari, sampai, nilai), `odoaBulanan/<siswaId>__<YYYY-MM>` (nilai bulanan + ujianX), `odoaAwal/<siswaId>`. Pelatihan: `pelatihan/<pushId>`, `pelatihanSubmissions/`.
- **Komponen:** `SetoranODOA({user,isPriv})` ~baris 10968; `CreatePelatihanModal` ~baris 15245. Helper akses ODOA sudah ada di app: `window._odoaKoordinator(user)`, `_odoaKoordinatorPenuh(user)` (Ulfa & Rifa: rekap semua, rekap ujian, terbitkan rapor), `_odoaBolehCetak`, `_odoaJenjangBoleh` (ODOA khusus SDIT). Guru identifikasi lewat **NIP** (`user.nip`), daftar guru di localStorage `alqomar_guru`.
- **Bug diperbaiki 19 Sep 2026:** `CreatePelatihanModal.handleSave` memakai `deadlineISO` yang tidak pernah didefinisikan → "Can't find variable: deadlineISO". Fix: `const deadlineISO = new Date(deadline).toISOString()` + init edit pakai waktu lokal. File hasil fix dikirim ke user untuk di-upload manual (lokasi file di hosting belum diketahui; user sempat bersih-bersih public_html Hostinger).

## Arsitektur (catatan investigasi awal, sebelum lihat kode)
- **Kode: TIDAK ada di repo GitHub mana pun** yang bisa diakses (bukan `platform-guru-alqomar`, bukan `web-alqomar-next`). Kemungkinan HTML/JS statis di Hostinger (error JS tampil dengan nama variabel asli, tidak diminifikasi).
- **Data aktivitas (pelatihan, tugas, jurnal, setoran ODOA, dll.): Firebase Realtime Database** — bukti: path file di bucket `pelatihan-tugas` berpola `-Ovns4PiTdsBtdtCWkqy/<id-guru>/…` (push ID Firebase). Claude tidak punya akses Firebase.
- **File: Supabase Storage Tokyo** `lnacvtvufgsxnqhuezox`, bucket `dokumen_` (5.451 file, folder per guru = NIP/tanggal lahir/timestamp) dan `pelatihan-tugas` (234 file).
- Log API Supabase 24 jam: hanya auth, `app_roles`, `pembayaran`, `guru`, `siswa`, `tarif`, `kelas` (itu app pembayaran/SPP Next.js yang dipakai wali kelas) + upload storage. **Tidak ada request ke tabel `halaqah`/`setoran_tahfidz`/pelatihan** → tabel tahfidz di Postgres Tokyo tidak dipakai app asli.
- Insiden "jebol storage" (sebelum 19 Sep 2026) terjadi di app ini; data halaqah ODOA lama hilang.

## Konsekuensi
- Pekerjaan tahfidz 19 Sep 2026 (lihat [[platform-guru-tahfidz-odoa]]) hanya menyentuh app Next.js `platform-guru-alqomar` + Postgres Tokyo — **tidak berdampak ke guru.alqomar.id**.
- Untuk perbaikan apa pun di guru.alqomar.id (mis. bug "Can't find variable: deadlineISO" di modal Pelatihan Baru), **minta user upload file HTML dari File Manager Hostinger** dulu. Jangan eksekusi sebelum user setuju rencananya.

## Tautan Terkait
- [[platform-guru-tahfidz-odoa]] · [[sinkronisasi-repo-vs-production]]
