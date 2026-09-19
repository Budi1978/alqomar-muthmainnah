---
judul: Design System Artifact (Al-Qomar)
tipe: catatan
tags: [desain, konvensi, proyek]
diperbarui: 2026-09-19
---

# Design System Artifact — Al-Qomar Muthmainnah

Sistem desain resmi diekstrak dari kode (commit `6a2e4a5`) ke artifact tipe **Design System**:
https://claude.ai/artifact/NFCQMTR4wGeQoUqv85VMoT (privat; dibagikan lewat menu Share).

## Fakta penting
- **Sistem aktif** (`index.html`, `spmb-online.html`, `rqaq.html`) memakai Tailwind terkompilasi (`css/tailwind.min.css`): palet `emerald-*`, `gold-*` (= amber Tailwind), `cream #fdfbf3`, `cream-100 #fbf6e9`; `emerald-800 #066149` dan `emerald-950 #03261c` **bukan** default Tailwind.
- Font: Fraunces (display), Plus Jakarta Sans (teks), Amiri (Arab) — semua Google Fonts, tanpa file lokal.
- **Variabel `--h`, `--e`, `--kr` di CLAUDE.md adalah sistem lama** (masih dipakai `event.html`, `berita.html`, `ppdb.html`). Di artifact dicatat sebagai token `legacy-*` + peta migrasi.
- Dua pasangan kontras gagal tapi dipertahankan sesuai sumber: `gold-600` di `cream` (3.0:1, eyebrow) dan ikon putih di `whatsapp` (2.1:1).
- 9 komponen didokumentasikan (Button, Card, SectionHeader, Badge, Navbar, Field, Footer, WhatsAppFloat, Ticker) — pratinjau ditulis tangan dari `index.html`, tanpa bundle JS.

## Cara memperbarui
Baca `project/README.md` dan `project/tokens.json` di artifact, ubah file yang perlu, publish ke URL yang sama (jangan buat dari `type_url` lagi). `tokens.json` `meta.source` = github, jadi bisa di-re-sync dari repo.

## Progres migrasi halaman legacy
- **2026-09-19 — `event.html` selesai** dimigrasi ke sistem aktif (branch `claude/design-system-extraction-5zuukp`). Pola: Tailwind CDN + `tailwind.config` inline seperti `rqaq.html`, ditambah `fontWeight:{400..800}` supaya `font-700` bekerja (tanpa itu `font-700` di CDN v3 tidak jalan).
- ⚠️ `css/tailwind.min.css` di repo **tidak memuat** kelas yang dipakai `index.html` (`font-700`, `pt-36`, `md:flex`, dll.) — file di repo basi dari server. Situs live tidak bisa diakses dari sandbox (proxy 403), jadi belum bisa dibandingkan.
- Uji render: kompilasi Tailwind v3 lokal (npm) + headless Chromium; Chromium headless punya lebar minimum ±500px, uji mobile pakai `<iframe width=390>`.
- Sisa halaman legacy: `berita.html`, `berita-detail.html`, `ppdb.html`, `berita/index.html`.
