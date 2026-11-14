---
judul: Audit Situs Live 14 November 2026
tipe: catatan
tags: [proyek, seo, konten, todo]
diperbarui: 2026-11-14
---

# Audit Situs Live — 14 November 2026

Bagian dari [[index]]. Keputusan konten hasil audit: [[keputusan/2026-11-14-fakta-konten-baku]].

## Ringkasan

Audit menyeluruh www.alqomar.sch.id (30 halaman, header, sitemap, 75 aset, render mobile/desktop, advisor Supabase). Fondasi teknis kuat; masalah utama ada di konsistensi isi. Koreksi isi di `_perbaikan/2026-11-14/` sudah live per 14 Nov 2026.

## Detail

**Kondisi repo vs live (penting):** `main` jauh tertinggal dari live. Live sudah desain v3 (`/css/alqomar-v3.css`, `/js/alqomar-v3.js`) dan punya halaman yang tidak ada di repo: `tentang`, `jenjang`, `program`, `biaya`, `fasilitas`, `prestasi`, `galeri`, `ekstrakurikuler`. Jangan upload file HTML dari root repo ke server. Semua koreksi dibuat dari salinan HTML live.

**Sudah benar (jangan diubah):** HSTS + CSP + header keamanan; redirect non-www/`.html`/trailing slash; title & description unik di 30 halaman; JSON-LD lengkap; cache aset 1 tahun; 0 aset rusak; mobile tanpa overflow, CLS ≈ 0, LCP 0,5–2,9 dtk; RLS aktif di 24/24 tabel Supabase; `daftar_spmb` punya pembatas laju.

**Koreksi isi yang sudah disiapkan (11 file, 47 penggantian, termasuk penghapusan nominal SPP):** lihat [[catatan/riwayat-perbaikan]] entri 2026-11-14.

**TODO terbuka (belum dikerjakan):**
- [x] (selesai, terverifikasi live 14 Nov 2026) Upload 11 file dari `_perbaikan/2026-11-14/` ke `public_html` Hostinger.
- [ ] `/biaya` masih menulis "Terakhir diperbarui: 25 Oktober 2026" padahal isinya berubah 14 Nov 2026.
- [ ] Cloudflare Web Analytics diblokir CSP (`static.cloudflareinsights.com` tidak ada di `script-src`): izinkan di `.htaccess` atau matikan di dashboard Cloudflare. Minta versi `.htaccess` server dulu.
- [ ] Testimoni (4 baris di tabel `testimoni`) tidak tampil di beranda, `/ppdb`, `/spmb-online`.
- [ ] Uang pangkal tidak dipublikasikan di `/biaya` (keputusan user belum ada).
- [ ] Video profil hanya di `/tentang`; tabel `video_youtube` punya 4 video.
- [ ] HTML tidak di-cache di edge Cloudflare (`cf-cache-status: DYNAMIC`, TTFB 1,0–1,3 dtk diukur dari AS).
- [ ] HTML server `/berita` dan beranda tertinggal (berhenti 15 Okt; hanya 9 dari 39 artikel bertaut; sisanya lewat JS).
- [x] (selesai 14 Nov 2026) Upload `_perbaikan/2026-11-14-font/` (font self-hosted 7 halaman) — lihat [[catatan/riwayat-perbaikan]].
- [x] **Cache Rule Cloudflare untuk HTML** — aktif 14 Nov 2026 (dibuat user di dashboard). Aturan "Cache HTML publik": hostname `www.alqomar.sch.id`, kecuali path diawali `/spmb-online`, `/cms`, `/login`; Eligible for cache; Edge TTL ikut cache-control origin. Browser Cache TTL zona diubah dari 4 jam ke **Respect Existing Headers** (kalau tidak, Cloudflare menaikkan `max-age` HTML jadi 14400). Hasil: TTFB 1,1–1,6 dtk → 0,12–0,2 dtk (HIT, diukur dari AS). **Setelah upload ke Hostinger: Purge Everything di Cloudflare**, kalau tidak versi lama bertahan sampai 10 menit.
- LCP `/spmb-online` dan `/berita` sudah diuji (14 Nov): hanya ±300 ms di atas TTFB, tidak perlu perubahan kode; angka 2,8–2,9 dtk sebelumnya adalah artefak sandbox (pihak ketiga tak terjangkau).
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
