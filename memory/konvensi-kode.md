---
judul: Konvensi Kode
tipe: catatan
tags: [konvensi, konteks]
diperbarui: 2026-06-25
---

# Konvensi Kode

Bagian dari [[index]]. Aturan ini **wajib** diikuti saat mengubah kode (ringkasan dari `CLAUDE.md`).

## CSS
- **Selalu** pakai CSS custom properties, jangan hardcode hex:
  `--h #1a5c38` (hijau utama) · `--h2 #1e6e42` · `--h3 #2a8a54` · `--e #c8922a` (emas) · `--e2 #e0a832` · `--ep #fdf3e0` · `--kr #faf7f2` · `--kr2 #f0e9d8`
- Nama kelas **sangat singkat** (2–4 karakter), ikuti prefix per-section (`.ti`, `.nb`, `.sc`, `.jc`, `.faqg`, dst.)
- Tag `<style>` diletakkan **tepat sebelum** HTML section terkait — bukan di `<head>`

## JavaScript
- **Vanilla JS saja** — tanpa jQuery/library eksternal
- Semua JS di akhir `<body>` dalam `<script>`

## HTML / UX
- Konten tampil ke pengguna **dalam Bahasa Indonesia**
- Responsif wajib: breakpoint `768px` (tablet) & `480px` (mobile)
- Tambah class `rv` pada elemen baru agar ikut animasi scroll-reveal
- Jaga konsistensi navbar, footer, warna, font antar semua halaman

## Workflow
- Satu file HTML mandiri per halaman (CSS+JS inline)
- Backup `index.html` ke `_backup/index.html.YYYY-MM-DD` sebelum perubahan besar
- Jangan commit gambar besar ke root — taruh di `images/`
- Tambah halaman baru → perbarui `sitemap.xml`
- Deploy: push `main` → Netlify auto-build
