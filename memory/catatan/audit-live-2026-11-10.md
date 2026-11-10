---
judul: Audit situs live 10 Nov 2026
tipe: catatan
tags: [audit, seo, keamanan, ppdb]
dibuat: 2026-11-10
---

# Audit situs live www.alqomar.sch.id — 10 Nov 2026

Audit dilakukan langsung ke server (curl + Chromium headless + advisor Supabase), bukan dari repo.

## Fakta penting
- **Situs live = "v3", repo ini basi total.** Live memakai `/css/alqomar-v3.css`, `/js/alqomar-v3.js`, Tailwind/DaisyUI lokal, 21 halaman (`/tentang`, `/jenjang`, `/program`, `/biaya`, `/galeri`, `/fasilitas`, `/prestasi`, `/ekstrakurikuler`, dst.) yang **tidak ada di repo**. `index.html` live ±40 KB, repo 102 KB. Jangan upload apa pun dari repo ke server.
- Host kanonik: `www.alqomar.sch.id` (apex 301 ke www). Di belakang Cloudflare. CSP ketat berbasis hash aktif.
- WA resmi di live: `0811-1597-678`; email `contact@alqomar.sch.id`; IG `@alqomar.sekolahku` (CLAUDE.md masih data lama).
- Sesi cloud butuh environment `alqomar-muthmainnah` (host situs + Supabase diizinkan) supaya bisa menguji live.

## Temuan terbuka
> Paket perbaikan no. 1–7 di bawah **sudah tayang & terverifikasi 10 Nov 2026**, kecuali no. 4 (beacon Cloudflare) yang sengaja dilewati. Tautan `/berita/w)` ternyata bukan bug.

1. `berita-detail.php`: skrip inline utama diblokir CSP (hash tidak terdaftar) → "Berita Lainnya", Salin Link, pembaruan klien mati. Isi artikel tetap tampil karena dirender server.
2. `aggregateRating` 4.8/120 di JSON-LD `/ppdb` dan `/berita` — tanpa ulasan tampil di halaman; risiko manual action Google.
3. `site.webmanifest` menunjuk `/logo/logo-192.png` & `logo-512.png` → 404.
4. Beacon Cloudflare Web Analytics diblokir CSP di semua halaman.
5. `robots.txt` live tidak lagi memuat Disallow (versi repo punya).
6. Tautan `.html` lama di `/spmb-online`, `/syarat`, `/tahfidz`, `/sekolah-islam-jakarta-barat` (301); tautan rusak `/berita/w)` di artikel kurban-1447h.
7. `berita-detail.php` masih memakai anon key JWT lama; halaman lain sudah `sb_publishable_`.
8. Funnel: 7 pendaftar online sejak Sep 2026 (SMPIT 0). Uang pangkal tidak dipublikasikan.

## Yang sudah sehat
RLS semua tabel aktif, `spmb_pendaftar` tidak terbaca publik, pendaftaran lewat RPC ber-rate-limit, file repo/`.git`/`.env` 403, HSTS + header keamanan lengkap, 1 H1 + canonical + alt di semua halaman, tidak ada overflow horizontal di mobile.
