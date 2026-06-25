---
judul: Konteks Proyek
tipe: catatan
tags: [proyek, konteks]
diperbarui: 2026-06-25
---

# Konteks Proyek

Bagian dari [[index]].

## Identitas
- **Proyek**: Website Sekolah Al-Qomar Muthmainnah (statis, multi-halaman)
- **Naungan**: Yayasan Pendidikan Islam Purnama Cendekia (YPIPC)
- **Jenjang**: KB, TKIT, SDIT, SMPIT
- **Domain**: alqomar.sch.id (file `CNAME`)
- **Hosting**: Netlify — push ke `main` = auto-deploy
- **Lokasi**: Jl. Kamal Raya No.1 Tegal Alur, Kalideres, Jakarta Barat
- **Kontak**: (021) 55968344 · info@purnamacendekia.sch.id

## Stack
- HTML5 + CSS3 (inline `<style>` per-section) + Vanilla JS (di akhir `<body>`)
- **Tanpa** build system, package manager, atau framework
- Google Fonts: Plus Jakarta Sans, Amiri, Playfair Display

## Halaman Utama
`index.html` (22 section) · `berita.html` + `berita/` · `berita-detail.html` · `event.html` · `ppdb.html` · `login-divisi.html`

## File Konfigurasi
- `_headers` — CSP & header keamanan Netlify
- `_redirects` — rewrite URL (mis. `/berita/`)
- `robots.txt`, `sitemap.xml` — SEO
- `CNAME` — domain kustom

## Tautan Eksternal Penting
- WhatsApp: `wa.me/6221559683440`
- PPDB Online: alqomar.sch.id/spmb-online
- Instagram: @alqomar.school · YouTube channel `UCA3iOPu9iYC7ZOD4PyW9VPw`

> Sumber lengkap: lihat `CLAUDE.md` di root repo.
