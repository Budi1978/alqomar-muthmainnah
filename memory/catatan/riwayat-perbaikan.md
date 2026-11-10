---
judul: Riwayat Perbaikan Bug
tipe: catatan
tags: [proyek, perbaikan, penting]
diperbarui: 2026-10-11
---

# Riwayat Perbaikan Bug

Bagian dari [[index]]. Fitur baru dicatat di [[riwayat-fitur]].

> [!warning] Aturan wajib
> **Sebelum memperbaiki bug apa pun**: baca catatan ini + `git log --oneline -- <file>` untuk file terkait. Kalau gejala mirip entri di bawah, mulai dari entri itu — jangan tanya ulang ke user dan jangan ulangi pendekatan yang sudah gagal.
> **Setelah perbaikan berhasil**: tambah entri baru di paling atas (format: [[templates/perbaikan]]). Jangan tunggu akhir sesi.
> **Untuk `.htaccess` / `*.php`**: minta versi server dulu (repo bisa basi) — lihat [[sinkronisasi-repo-vs-production]].

Entri terbaru di atas. Entri berstatus "belum di-deploy" berarti bug masih ada di live sampai file di-upload ke Hostinger.

---

## 2026-11-10 — Paket perbaikan audit live (no. 2–8)
- **Status**: ✅ selesai & terverifikasi di live 10 Nov 2026 (user upload manual via File Manager). No. 6 (beacon Cloudflare/CDN Hostinger vs CSP) **sengaja dilewati** — manfaat kecil, risiko edit `.htaccess` besar.
- **Catatan pelaksanaan**: di `berita-detail.php` hanya 1 baris diubah: `<script>` di atas `const SUPABASE_URL` → `<script src="/js/berita-detail.js?v=20261110">` (isi inline lama masih ada di file tapi diabaikan browser; `$KEY` PHP masih JWT lama — boleh dibersihkan nanti). Ikon 192/512 dibuat dari logo terbaru.
- **Gejala**: `aggregateRating` 4.8/120 tanpa ulasan nyata; skrip inline `berita-detail.php` diblokir CSP; ikon manifest 404; robots tanpa Disallow; beacon Cloudflare diblokir CSP; tautan `.html` lama; anon key JWT lama.
- **Solusi**: file live diunduh lalu ditambal minimal (lihat `PETUNJUK-UPLOAD.md`): hapus rating di `ppdb.html`/`berita.html` + baris `schema_markup` Supabase; skrip detail berita dipindah ke `/js/berita-detail.js` (kunci `sb_publishable_`); ikon 192/512; `robots.txt`; tautan bersih. `.htaccess` dan `berita-detail.php` butuh edit manual di server (instruksi cari-ganti disediakan).
- **Jangan diulang**: menambal dari file repo (repo basi — dasar harus unduhan live). Menaruh skrip inline baru di halaman PHP tanpa mendaftarkan hash CSP — taruh di `/js/`.
- **Cek ulang**: `curl -s https://www.alqomar.sch.id/ppdb | grep -c aggregateRating` harus 0; buka artikel berita, konsol tanpa error CSP inline; `/logo/logo-512.png` 200.
- **Bukan bug**: tautan `/berita/w)` (salah baca alat audit).

## 2026-09-14 — Repo `.htaccess` & `berita-detail.php` jauh beda dari production
- **Status**: ✅ sudah disinkronkan di repo (versi server jadi acuan)
- **Gejala**: Claude bekerja dengan asumsi repo = live, hasilnya salah; user mengulang penjelasan.
- **Penyebab**: file diedit langsung di server (File Manager/FTP) tanpa commit balik ke Git.
- **Solusi**: ganti versi repo dengan versi asli production.
- **Jangan diulang**: menimpa file server dengan upload dari repo tanpa cek dulu isi server. Menaruh backup `.php` di root.
- **Cek ulang**: bandingkan ukuran/isi file server vs repo sebelum upload.
- **Commit**: `e2517a6`, `cd03996`, catatan di `1b03c3a`, `ae29ed3`

## 2026-09-02 — Klaim absolut pada konten guru (100% bersertifikat)
- **Status**: ✅ selesai di repo (cek apakah sudah di-upload)
- **Gejala**: stat dan paragraf tim pengajar memuat klaim absolut ("100%", sertifikasi mutlak) — berisiko tidak akurat/regulasi.
- **Solusi**: klaim dihapus/dilunakkan.
- **Jangan diulang**: menulis angka/klaim absolut tanpa data pendukung.
- **Commit**: `cd35128`, `be4ee59`

## 2026-09-02 — File backup/snapshot HTML nyasar di root
- **Status**: ✅ selesai di repo
- **Gejala**: file backup ikut ter-deploy dan bisa terindeks Google sebagai duplikat.
- **Solusi**: pindah ke `_backup/`, diblokir `robots.txt`, redirect 301 di `.htaccess`.
- **Jangan diulang**: menaruh backup di root.
- **Commit**: `8f744a5`, `9426745`, `a2b6fba`

## 2026-09-02 — File repositori bisa diakses publik
- **Status**: ✅ selesai di repo (perlu upload `.htaccess` — pastikan versi server yang jadi dasar)
- **Solusi**: blokir akses file repositori lewat `.htaccess`.
- **Commit**: `48dd266`

## 2026-06-19 — SEO: sitemap, robots, routing berita
- **Status**: ✅ selesai
- **Gejala**: sitemap/robots salah, meta tag berita kurang, portal divisi terindeks, routing artikel berita rusak.
- **Solusi**: perbaiki sitemap/robots, noindex portal divisi, konsolidasi `/berita`.
- **Commit**: `fb79da7`, `4ae8cdd`

## 2026-04-23 — Hero slider: gambar hilang
- **Status**: ✅ selesai
- **Gejala**: gambar hero slider tidak tampil (kambuh beberapa kali dalam sehari — 5 commit).
- **Penyebab**: path gambar tidak terbawa + `inset:0` tidak jalan lintas browser.
- **Solusi**: gambar di-embed base64, ganti `inset:0` dengan `top/right/bottom/left`, kembalikan 5 slide & narasi lama dari index-live.
- **Jangan diulang**: mengandalkan path gambar eksternal untuk hero; memakai `inset:0` saja.
- **Cek ulang kalau muncul lagi**: buka di Safari/browser lama + mobile; cek `index.html` hero.
- **Commit**: `ab2e96f`, `a12fa0c`, `ec224bc`, `29bfec7`, `ac30de2`

<!-- Entri baru ditambah DI ATAS garis pertama (---) di bawah aturan wajib -->
