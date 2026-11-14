---
judul: Audit Situs Live 14 November 2026
tipe: catatan
tags: [proyek, seo, konten, todo]
diperbarui: 2026-11-14
---

# Audit Situs Live — 14 November 2026

Bagian dari [[index]]. Keputusan konten hasil audit: [[keputusan/2026-11-14-fakta-konten-baku]].

## Ringkasan

Audit menyeluruh www.alqomar.sch.id (30 halaman, header, sitemap, 75 aset, render mobile/desktop, advisor Supabase). Fondasi teknis kuat; masalah utama ada di konsistensi isi. Koreksi isi sudah disiapkan di `_perbaikan/2026-11-14/` (belum di-upload).

## Detail

**Kondisi repo vs live (penting):** `main` jauh tertinggal dari live. Live sudah desain v3 (`/css/alqomar-v3.css`, `/js/alqomar-v3.js`) dan punya halaman yang tidak ada di repo: `tentang`, `jenjang`, `program`, `biaya`, `fasilitas`, `prestasi`, `galeri`, `ekstrakurikuler`. Jangan upload file HTML dari root repo ke server. Semua koreksi dibuat dari salinan HTML live.

**Sudah benar (jangan diubah):** HSTS + CSP + header keamanan; redirect non-www/`.html`/trailing slash; title & description unik di 30 halaman; JSON-LD lengkap; cache aset 1 tahun; 0 aset rusak; mobile tanpa overflow, CLS ≈ 0, LCP 0,5–2,9 dtk; RLS aktif di 24/24 tabel Supabase; `daftar_spmb` punya pembatas laju.

**Koreksi isi yang sudah disiapkan (8 file, 27 penggantian):** lihat [[catatan/riwayat-perbaikan]] entri 2026-11-14.

**TODO terbuka (belum dikerjakan):**
- [ ] Upload 8 file dari `_perbaikan/2026-11-14/` ke `public_html` Hostinger.
- [ ] Cloudflare Web Analytics diblokir CSP (`static.cloudflareinsights.com` tidak ada di `script-src`): izinkan di `.htaccess` atau matikan di dashboard Cloudflare. Minta versi `.htaccess` server dulu.
- [ ] Testimoni (4 baris di tabel `testimoni`) tidak tampil di beranda, `/ppdb`, `/spmb-online`.
- [ ] Uang pangkal tidak dipublikasikan di `/biaya` (keputusan user belum ada).
- [ ] Video profil hanya di `/tentang`; tabel `video_youtube` punya 4 video.
- [ ] HTML tidak di-cache di edge Cloudflare (`cf-cache-status: DYNAMIC`, TTFB 1,0–1,3 dtk diukur dari AS).
- [ ] HTML server `/berita` dan beranda tertinggal (berhenti 15 Okt; hanya 9 dari 39 artikel bertaut; sisanya lewat JS).
- [ ] Tiga tumpukan CSS (v3; `pages.css` + Google Fonts; Tailwind/DaisyUI path relatif) dan tiga versi `alqomar-v3.js` (`20261006a`, `20261019`, `20261101`).
- [ ] `robots.txt` menyebut `/login-divisi` (kini 404) dan `/_backup/`.
- [ ] `/PPDB` (huruf besar) 404 — tambah redirect lowercase.
- [ ] Alt kosong pada foto konten (`/ppdb`, `/sdit`, `/smpit`, `/berita`, `/galeri`).
- [ ] `site.webmanifest` dikirim `text/plain`; 404 punya canonical ke `/404.html`.
- [ ] Supabase: 20 tabel punya dua policy SELECT permisif untuk `authenticated`; `supabase-js` dipatok 2.39.3.

**Temuan yang dicabut:** SPP SMPIT < SDIT (kebijakan, bukan masalah). Target tahfidz SMPIT: halaman `/smpit` ternyata sudah punya dua jalur (masuk baru: Juz 30; lanjutan SDIT: lanjut Juz 29 sesuai kemampuan) — sesuai keputusan user.

**Batasan uji:** host Supabase, jsDelivr, GTM tidak terjangkau dari sandbox; formulir PPDB tidak dikirim; GA4 tidak teruji.

## Tautan Terkait
[[catatan/sinkronisasi-repo-vs-production]] · [[keputusan/2026-11-14-fakta-konten-baku]]
