---
judul: Riwayat Perbaikan Bug
tipe: catatan
tags: [proyek, perbaikan, penting]
diperbarui: 2026-11-14
---

# Riwayat Perbaikan Bug

Bagian dari [[index]]. Fitur baru dicatat di [[riwayat-fitur]].

> [!warning] Aturan wajib
> **Sebelum memperbaiki bug apa pun**: baca catatan ini + `git log --oneline -- <file>` untuk file terkait. Kalau gejala mirip entri di bawah, mulai dari entri itu — jangan tanya ulang ke user dan jangan ulangi pendekatan yang sudah gagal.
> **Setelah perbaikan berhasil**: tambah entri baru di paling atas (format: [[templates/perbaikan]]). Jangan tunggu akhir sesi.
> **Untuk `.htaccess` / `*.php`**: minta versi server dulu (repo bisa basi) — lihat [[sinkronisasi-repo-vs-production]].

Entri terbaru di atas. Entri berstatus "belum di-deploy" berarti bug masih ada di live sampai file di-upload ke Hostinger.

---

## 2026-11-14 — Audit UI/UX "Diagnostic Studio": 4 perbaikan (paket d)
- **Status**: ✅ sudah di-upload user dan diverifikasi live 14 Nov 2026 (22 HTML + 2 CSS identik byte-per-byte; `/program/kb-tkit` & `/jenjang/kb-tkit` → 301 `/kb-tkit`; render 390/940/1280/1920px tanpa scroll horizontal). Sisa: di lebar tablet (±861–1100px) paragraf hero masih berakhir di ±58% lebar layar, sedikit menimpa foto.
- **Gejala**: (1) `/program/kb-tkit` 404; (2) lebar 861–1040px header tanpa tombol PPDB dan tanpa hamburger; (3) `<ul id="mainNav">` tidak dibungkus `<nav>`; (4) paragraf hero beranda menimpa foto di desktop.
- **Solusi**: (1) `RewriteRule ^program/kb-tkit/?$ /kb-tkit [R=301,L]` — pola sama dengan `/program/smpit` & `/program/sdit` yang sudah ada di server; (2) tautan menu "PPDB" jadi tombol hijau di 861–1040px; (3) `<nav class="nav-utama" aria-label="Navigasi utama">` + `.nav-utama{display:contents}`; (4) `.hero p` 46ch → 42ch, stop gradasi putih digeser (36/48/60/70%). CSS naik ke `?v=20261114a`; beranda juga diubah di `<style id="aq-kritis">`.
- **Jangan diulang**: menganggap submenu Jenjang/Program tidak bisa diakses keyboard — **bisa** (`.has-sub:focus-within` sudah ada). Uji otomatis yang membaca gaya sebelum transisi 0,16 dtk selesai memberi hasil palsu. Menampilkan lagi `.header-actions .hbtn` di ≤1040px (meluber, lihat catatan 30/09 di chrome.css).
- **Temuan audit yang tidak terbukti**: unduhan ganda foto hero (ada pengaman `data-snapshot`), "32 tahun"/"3 juz" (situs konsisten 35 tahun & 2 juz), angka CWV "P75", kontras `.jicon.orange` (elemen tersembunyi di beranda).
- **`.htaccess`**: versi server ditempel user 14 Nov 2026 dan diarsipkan ke root repo (+ baris redirect baru di bawah aturan `jenjang/tkit|tkit`). Salinan diketik ulang dari chat — hanya baris CSP yang dicocokkan dengan header live; jangan upload menimpa server, tambahkan barisnya langsung di server.
- **Belum tercakup**: `berita-detail.php` (butuh versi server) — belum ber-`<nav>`, masih merujuk chrome.css versi lama. Drawer menu HP di beranda tanpa padding kiri (sudah begitu di live sebelum paket ini).
- **Cek ulang**: setelah upload + purge — `curl -I /program/kb-tkit` → 301; sumber halaman memuat `nav-utama` dan `20261114a`; di lebar 940px tombol hijau "PPDB" tampil di header tanpa scroll horizontal.

## 2026-11-14 — 404 tanpa Google Fonts + tanggal `/biaya`
- **Status**: ✅ sudah di-upload user, di-purge, dan diverifikasi live 14 Nov 2026 (identik; 0 request ke Google)
- **Gejala**: `404.html` masih memanggil Google Fonts dan punya canonical ke `/404.html`; `/biaya` menulis "Terakhir diperbarui: 25 Oktober 2026" padahal isinya berubah 14 Nov.
- **Solusi**: hapus tautan Google + canonical di `404.html`, rujuk `pages.css?v=20261114`; ganti tanggal di `/biaya` (teks + meta description) ke 14 November 2026.
- **Cek ulang**: buka URL ngawur → sumber halaman tidak memuat `fonts.googleapis`; `/biaya` menampilkan 14 November 2026. Purge Cloudflare setelah upload.

## 2026-11-14 — Font: lepas dari Google Fonts di 7 halaman lama
- **Status**: ✅ sudah di-upload user dan diverifikasi di server asli 14 Nov 2026 (7 halaman, `pages.css`, font Nastaliq identik). Edge Cloudflare sempat masih menyajikan versi lama `/biaya`, `/tahfidz`, dan `/css/pages.css` tanpa `?v=` → perlu Purge Everything setelah upload.
- **Gejala**: `/biaya`, `/fasilitas`, `/prestasi`, `/privacy`, `/syarat`, `/tahfidz`, `/sekolah-islam-jakarta-barat` masih memanggil `fonts.googleapis.com` (render-blocking), beda dari beranda yang sudah self-hosted.
- **Penyebab**: `<link>` Google Fonts di tiap halaman **dan** `@import` Google Fonts di baris 7 `css/pages.css` (yang ini mudah terlewat).
- **Solusi**: hapus `<link>`/preconnect Google; `pages.css` memakai `@font-face` lokal (Source Serif 4, Playfair) dan dirujuk sebagai `/css/pages.css?v=20261114` (file lama di-cache immutable 1 tahun); `/tahfidz` dan `/sekolah-islam-jakarta-barat` dapat blok `<style id="aq-font-lokal">`. Font baru yang harus di-upload: `fonts/noto-nastaliq-urdu-arabic-400-normal.woff2` (dari paket npm `@fontsource/noto-nastaliq-urdu` 5.3.0). Font lain sudah ada di `/fonts/` server.
- **Jangan diulang**: mengira `/guru` dan `/rqaq` memakai Google Fonts — tidak (hanya 7 halaman). Mengubah `pages.css` tanpa menaikkan `?v=`.
- **Cek ulang**: setelah upload, `curl` ketujuh halaman + `pages.css` → tidak boleh ada `fonts.googleapis` / `fonts.gstatic`. Uji render lokal: 0 request ke Google, semua font `loaded`.
- **Catatan tampilan**: italic Playfair di server berbobot 600 (Google memberi 700) dan italic Source Serif 400 (Google 300) — beda tipis, disengaja.

## 2026-11-14 — Koreksi isi hasil audit (jadwal, Sekolah Penggerak, BAN-PDM, kokurikuler, ODOA)
- **Status**: ✅ sudah di-upload user dan diverifikasi live 14 Nov 2026 (11 halaman identik byte-per-byte dengan `_perbaikan/2026-11-14/`; teks lama nihil)
- **Gejala**: (1) `/spmb-online` menulis tes Gelombang 2 "Pekan ke-2 Des 2026" padahal 9 Januari 2027; (2) Sekolah Penggerak ditulis sebagai status aktif di 5 halaman; (3) lembaga akreditasi SMPIT ditulis "BSANP" di `/tentang` dan `/smpit`; (4) `/smpit` masih memakai istilah P5; (5) `/tahfidz` menulis "Metode ODOA".
- **Penyebab**: konten antarhalaman diperbarui terpisah; istilah regulasi lama belum disesuaikan.
- **Tambahan (permintaan user, hari yang sama)**: nominal SPP dihapus dari `biaya`, `ppdb`, `kb-tkit`, `sdit`, `smpit` (20 penggantian); kolom SPP di tabel `/biaya` dihapus, baris SDIT digabung, FAQ diganti arahan ke Tata Usaha. Total 11 file.
- **Solusi**: 27 penggantian teks di 8 file (`spmb-online`, `tentang`, `index`, `guru`, `ppdb`, `smpit`, `sekolah-islam-jakarta-barat`, `tahfidz`), dibuat dari **salinan HTML live** (bukan dari root repo yang tertinggal). Acuan isi: [[keputusan/2026-11-14-fakta-konten-baku]].
- **Jangan diulang**: mengedit/upload file HTML root repo — `main` tertinggal jauh dari live (lihat [[audit-situs-2026-11-14]]). Menulis "Metode ODOA" atau Sekolah Penggerak sebagai status aktif.
- **Cek ulang**: setelah upload, cari di situs live: "Pekan ke-2", "adalah Sekolah Penggerak", "BSANP)", "Projek Penguatan", "Metode ODOA", "Rp300.000", "Rp550.000", "Rp600.000" — semuanya harus nihil. Nomor SK SMPIT (`024/BSANP/K/SK/2026`) belum dicocokkan dengan dokumen asli.
- **Commit**: lihat `git log -- _perbaikan/2026-11-14`

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
