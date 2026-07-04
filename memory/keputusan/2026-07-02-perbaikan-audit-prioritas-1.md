---
judul: Perbaikan Audit Prioritas 1
tipe: keputusan
tags: [keputusan, seo, keamanan, deploy]
tanggal: 2026-07-02
---

# Perbaikan Audit Prioritas 1 (2 Juli 2026)

Konteks: audit multi-agent (laporan lengkap di `docs/audit-multi-agent-2026-07-02.md`) menemukan 3 masalah kritis. Perbaikan dikerjakan di branch `claude/alqomar-multi-agent-audit-yjcxr9`.

## Keputusan yang diambil

1. **`/spmb-online` di-redirect 302 → `/ppdb.html`** (di `_redirects`). Dipilih 302 (bukan 301) agar mudah dialihkan ke form pendaftaran asli begitu tersedia. **TODO: ganti target ke form SPMB asli bila sudah ada.**
2. **File arsip dihapus dari HEAD**: `index-live-latest.html` (22 MB), `index-live.html`, `_backup/index.html.2026-04-14` & `-15` (@22 MB), `berita/.htaccess`. Semuanya masih ada di riwayat git bila dibutuhkan. `IMG_5490.jpg` dipindah ke `images/gedung-sekolah-malam.jpg`.
3. **`images/og-image.jpg` (1200×630) dibuat dari gambar hero slide 1** (identik dengan `gal-001.webp`). Semua tag `og:image`/`twitter:image` kini menunjuk ke sana.
4. **Redirect tambahan**: `/rqaq.html → /#rumah-quran`, `/guru.html → /#guru`, `/tahfidz.html → /#jenjang` (302); rewrite 200 untuk `/event` dan `/sekolah-islam-jakarta-barat`. Entri 404 dihapus dari `sitemap.xml`.

## Fakta penting yang ditemukan

- **`logo/logo.png` TIDAK ADA di repo** padahal dirujuk sebagai favicon, logo navbar, dan JSON-LD di semua halaman → navbar jatuh ke fallback "ق", favicon 404. **Pemilik situs harus mengunggah logo asli ke `logo/logo.png`.**
- **13 PIN divisi di `login-divisi.html` terekspos plaintext** di JS klien (dan tersimpan di riwayat git) — harus dianggap bocor. Butuh keputusan pemilik: rotasi PIN + pindah ke autentikasi ber-backend, atau hapus halaman. **Belum dikerjakan — menunggu keputusan.**
- Gambar hero slide 1 (base64 di index.html) identik dengan `images/galeri/gal-001.webp` — relevan untuk rencana ekstraksi base64 (Prioritas 2 di laporan audit).
- Live site tidak bisa diakses dari lingkungan sesi remote (kebijakan jaringan) — verifikasi produksi harus manual setelah deploy.
