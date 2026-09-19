---
judul: Konvensi Kode
tipe: catatan
tags: [konvensi, konteks]
diperbarui: 2026-09-19
---

# Konvensi Kode

Bagian dari [[index]]. Aturan ini **wajib** diikuti saat mengubah kode (ringkasan dari `CLAUDE.md`).

## CSS
- **Dua sistem** — baca bagian "Variabel CSS" di CLAUDE.md dan artifact Design System ([[catatan/design-system-artifact]]):
  - **Aktif** (`index.html`, `spmb-online.html`, `rqaq.html`): kelas Tailwind dari `css/tailwind.min.css` — `cream #fdfbf3` · `emerald-700 #047857` · `emerald-800 #066149` · `emerald-900 #064e3b` · `emerald-950 #03261c` · `gold-300 #fcd34d` · `gold-500 #f59e0b` · `gold-600 #d97706`. Font `font-sans` (Plus Jakarta Sans), `font-display` (Fraunces), `font-arabic` (Amiri).
  - **Legacy** (`event.html`, `berita.html`, `ppdb.html`): variabel `--h #1a5c38` · `--h2` · `--h3` · `--e #c8922a` · `--e2` · `--ep` · `--kr #faf7f2` · `--kr2`. Tetap pakai variabelnya saat menyunting; migrasikan ke sistem aktif saat membangun ulang.
- Jangan hardcode hex di kedua sistem (kecuali `bg-[#25D366]` WhatsApp yang memang begitu di sumber)
- Halaman legacy: nama kelas **sangat singkat** (2–4 karakter), prefix per-section (`.ti`, `.nb`, `.sc`, `.jc`, `.faqg`, dst.); halaman aktif: utilitas Tailwind + sedikit kelas kustom (`.card`, `.reveal`, `.fld`, `.lbl`, `.marquee`)
- Tag `<style>` kustom diletakkan **tepat sebelum** HTML section terkait — bukan di `<head>` (halaman aktif menaruh kelas global seperti `.reveal`/`.card` di `<head>`)

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
