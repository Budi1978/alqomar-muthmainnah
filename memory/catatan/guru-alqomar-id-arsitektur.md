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

## Struktur akses ODOA yang diinginkan user (konfirmasi 19 Sep 2026, cocok dengan kode)
- ADMIN (kepsek): semua data. **KOORDINATOR (5)**: Iman, Ulfa, Rifa, Een, Ellida — lihat seluruh halaqah; tier penuh (cetak rapor/rekap semua) hanya Ulfa & Rifa (`_ODOA_KOORDINATOR_PENUH`). **PEMBIMBING 22 guru (2 per kelompok, 11 kelompok, ±309 siswa)** — hanya lihat & input halaqah sendiri.
- Saklar menu setoran untuk guru: `window._ODOA_UNTUK_GURU` (baris ~10405; `false` = ditutup, kondisi 19 Sep). Pembimbing per halaqah disimpan di RTDB `halaqah/<hid>.pembimbing` (NIP) + `daftarPembimbing{i:{nip,nama}}`; **tidak ada UI untuk mengaturnya dan nama pembimbing tidak tampil di dropdown** → usulan 19 Sep: tampilkan nama, tambah panel "Atur Pembimbing Halaqah" (admin & tier penuh), buka saklar. Menunggu OK user + data node halaqah & rules dari laptop.
- Nama halaqah di app: Abu Bakar Ash-Shiddiq (IA), Umar bin Khattab (IB), Utsman bin Affan (IIA), Ali bin Abi Thalib (IIB), Abu Hurairah (IIIA), Bilal bin Rabah (IIIB), Salman Al-Farisi (IVA), Mush'ab bin Umair (IVB), Khadijah binti Khuwailid (VA), Aisyah binti Abu Bakar (VB), Fatimah Az-Zahra (VI). Kunci RTDB `h1`…`h11`.

## Spesifikasi ODOA dari user (19 Sep 2026) & gap dengan app
- **Matriks akses** (user): Admin 1 = semua + cetak rapor; Koordinator 5 = semua halaqah sesuai kewenangan, tidak cetak rapor; Pembimbing 22 = halaqah sendiri; Pencetak rapor 2 (Ulfa & Rifa); Siswa ±309 opsional lihat data sendiri (belum ada login siswa). → **Sudah sesuai kode.**
- **Bagan data** (user): HALAQAH → ZIYADAH & MUROJAAH harian, masing-masing: Tanggal, Surah, Ayat, Juz, Nilai, Catatan → RIWAYAT SISWA.
- **Gap:** app hanya punya ziyadah harian (`odoa/<siswaId>__<tgl>__<ts>`: siswaId, tanggal, nomor, surah, dari, sampai, nilai, oleh) — tanpa juz & catatan; murojaah hanya bulanan di `odoaBulanan` (murojaah1..4 + kelancaran1..4); riwayat siswa admin-only.
- **Bagan ujian (user):** ziyadah+murojaah → perkembangan siswa → **UTS & UAS Al-Qur'an per semester** → rapor tahfizh → dicetak Ulfa & Rifa. Gap: app sekarang rapor **per bulan** (`odoaBulanan/<siswa>__<YYYY-MM>`, bulanKe I..), ujian disimpan per bulan (field ujianX). Perubahan ke semesteran = Paket B.
- **Menu standar yang disarankan user (19 Sep) untuk modul ODOA:** MASTER DATA (Data Siswa, Data Guru, Data Halaqah, Pembagian Siswa, Pembagian Pembimbing) · TAHFIZH (Ziyadah, Murojaah, Riwayat Hafalan) · UJIAN (UTS, UAS, Rekap Nilai Ujian) · RAPORT (Rekap Nilai, Preview, Cetak) · REKAP & LAPORAN (per Siswa/Halaqah/Guru, Ziyadah, Murojaah, Ujian) · PENGATURAN (User & Hak Akses, Semester, Tahun Ajaran). Paket B = bangun ulang modul mengikuti menu ini, dipecah per tahap deploy.
- **Paket A DISETUJUI user 19 Sep 2026** → instruksi patch dikirim ke Claude laptop: (1) `_ODOA_UNTUK_GURU = true`; (2) helper `_odoaNamaPembimbing(h, allGuru)` + nama pembimbing di dropdown, baris info, rekap kelas; (3) panel "Atur Pembimbing Halaqah" (isPriv || koordinator penuh) menulis `halaqah/<hid>` {pembimbing, daftarPembimbing{p1,p2,p3:{nip,nama}}} + peringatan jenjang non-SDIT. Node halaqah live: kunci `h01`..`h11` (bukan `h1`), semua 11 terisi pembimbing (laporan laptop terpotong; h01 Abu Bakar → NIP 0909197… = Een). Status deploy Paket A: MENUNGGU laporan laptop.
- **Isi node `halaqah` live (dibaca laptop 19 Sep 2026, semua 11 terisi, sesuai SK):**
  h01 Abu Bakar Ash-Shiddiq (30) — Een Muflihat `09091978` + Rahayu Vina Purwanti `190399` · h02 Umar bin Khattab (29) — Sa'adiyah Ulfa `1775734980152` + Dimiyati Dyas Anindita `1775735089921` · h03 Utsman bin Affan (32) — Kustiah `101079` + Mita Yulianah `1784874023793` · h04 Ali bin Abi Thalib (30) — Ningsih Nurna `1782210920924` + Widya `1784874163500` · h05 Abu Hurairah (29) — Dra. Sjarniwati `161265` + Yushal Rachmat Gumilar `020790` · h06 Bilal bin Rabah (29) — Syafsilaroza Octaria `071099` + Siti Salamatul Laila `1775735665842` · h07 Salman Al-Farisi (27) — Ninik Puji Rahayu `1776392190374` + Ropiyati `03-04-87` · h08 Mush'ab bin Umair (27) — Andi Ilham `1781491343910` + Aranda Firdaus `021101` · h09 Khadijah binti Khuwailid (19) — Ellida Siregar `1775904802547` saja (pembimbing 2 sesuai SK sudah keluar, anggota dialihkan ke wali kelas) · h10 Aisyah binti Abu Bakar (20) — Selvi Nur Fitriah `060911` + Rifatul Hasanah `09 Maret 1997` · h11 Fatimah Az-Zahra (37) — Fatmarianti `1776161720765` + Iman Paojan `04081993` + Rifatul Hasanah. Struktur: `pembimbing` = NIP utama, `daftarPembimbing` = daftar {nip, nama}. NIP tidak seragam (ada tanggal lahir/timestamp).
- **Rules RTDB `halaqah` (file docs/keamanan/rtdb-rules-phase1-target-auth.json, cocok dengan live):** `.read`/`.write` = `auth != null`, validate `hasChildren(['nama','jenjang'])`. → semua guru login bisa menulis halaqah siapa pun; pembatasan admin/koordinator direncanakan Fase 2 (belum dikerjakan). Panel Paket A akan bisa menyimpan.
- **Rencana:** Paket A (kecil): tampilkan nama pembimbing, panel "Atur Pembimbing Halaqah", buka `_ODOA_UNTUK_GURU`. Paket B (besar, belum disetujui): murojaah harian + juz + catatan + riwayat untuk pembimbing + rapor menyesuaikan; butuh desain node baru & rules RTDB.

## Hosting & alur deploy (dari ringkasan sesi 18 Sep 2026 yang di-upload user)
- **Folder proyek di laptop user (Mac):** `/Users/ahmadbudi/Downloads/Al Qomar Project/Aplikasi Sekolah/Supervisi Guru Al Qomar/` (skrip di `docs/skrip/cek-harian.py`; ada beberapa `.bak`). Duplikat di `Arsip Al Qomar Project/2026-09-14 - pre-redesign mobile UX/` = arsip basi, jangan dipakai.
- **Hosting: VERCEL** (bukan Hostinger). Deploy dari **folder proyek di laptop user** lewat `vercel` CLI (4× deploy 18 Sep, verifikasi etag = md5 lokal). Folder itu punya `vercel.json` (`cleanUrls: true`, header keamanan), `.vercelignore`, `docs/audit/`, `docs/notulen/`, `docs/keamanan/` (rules RTDB, SQL Supabase), `cek-harian.py`. **Folder ini tidak ada di GitHub** — Claude di cloud tidak bisa akses; perubahan kode harus lewat user (upload file / sesi Claude di laptop).
- Bersih-bersih `public_html` Hostinger 18–19 Sep **tidak berdampak** ke guru.alqomar.id.
- **Deploy 19 Sep 2026 (fix deadlineISO): SELESAI.** Deploy oleh Claude di laptop dari `stage-deploy/` (source deploy = `stage-deploy/index.html`; file kerja = `guru-embedded.html` di folder induk), Vercel project `guru-alqomar-app`, alias guru.alqomar.id. Etag live = md5 `8838334d9f6623ef3f9ee296fd92d65a` (sebelumnya `6fb0238b`). Backup: `guru-embedded.html.bak-2026-09-19` dan `stage-deploy/index.html.pra-fix-deadlineISO.bak`.
- Bug `deadlineISO` (19 Sep) adalah **regresi dari fix 18 Sep butir "deadline pelatihan zona waktu UTC → lokal"**: definisi `deadlineISO` terhapus saat validasi diubah.
- Sudah dilakukan 18 Sep: cabut policy anon UPDATE/DELETE bucket Supabase, rules RTDB per-field (guru tidak bisa naikkan jabatan sendiri; `adminCreds` 401), `_saveGuru` tulis per kunci, logout signOut+bersih cache, header keamanan, PWA manifest, paket mobile.
- **Backlog audit (prioritas):** 1) performa login (nilai dimuat per kelas, bukan seluruh sekolah 2,4 MB); 2) rules RTDB Fase 2 per role (`docs/keamanan/2026-09-16-rencana-fase2-granular-per-role.md`); 3) hapus jalur login lama & cache hash password; 4) build step (tanpa Babel 2,8 MB di HP); 5) pemulihan sesi saat refresh + banner "versi baru"; 6) matriks Review Dokumen, maxLength, XSS gambar/fileUrl, upload terautentikasi; 7) fitur pengumuman. Skor kesiapan 55–60/100.
- Pelajaran penting: rules per-anak `guru/$id` tidak memberi hak `set()` di induk; X-Frame-Options harus SAMEORIGIN (app meng-iframe dirinya); tab lama tetap pakai kode lama sampai reload.

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
