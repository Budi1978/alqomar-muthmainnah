# Perbaikan audit UI/UX — 14 November 2026 (paket d)

Empat perbaikan dari audit "Diagnostic Studio". Dibuat dari salinan live 14 Nov 2026 (sudah termasuk paket `2026-11-14`, `-c`, dan `-font`).

## 1. Upload ke `public_html`

| File di folder ini | Tujuan di server |
|---|---|
| `css/alqomar-v3-chrome.css`, `css/alqomar-v3.css` | `public_html/css/` (timpa) |
| 22 file `.html` | `public_html/` (timpa) |

Urutan: **CSS dulu, baru HTML.** Setelah selesai: Cloudflare → **Purge Everything**.

## 2. Tambah dua baris di `.htaccess` server (edit langsung, jangan timpa file)

Cari baris ini di `.htaccess` server:

```apache
  RewriteRule ^(?:jenjang/tkit|tkit)/?$ /kb-tkit [R=301,L]
```

Tepat **di bawahnya**, tempel:

```apache
  # 14/11/2026: /program/kb-tkit (dan /jenjang/kb-tkit) masih 404; SDIT & SMPIT sudah ditangani di atas.
  RewriteRule ^(?:program|jenjang)/kb-tkit/?$ /kb-tkit [R=301,L]
```

Setelah disimpan, `https://www.alqomar.sch.id/program/kb-tkit` harus pindah ke `/kb-tkit` (sekarang 404). Kalau situs error setelah disimpan, hapus dua baris itu lagi.

`.htaccess` di root repo sudah berisi versi server 14 Nov 2026 + dua baris ini, sebagai arsip. Jangan upload file itu menimpa server: salinannya diketik ulang dari tempelan chat (hanya baris CSP yang dicocokkan dengan header live).

## Isi perubahan

| # | Masalah | Perbaikan |
|---|---|---|
| 1 | `/program/kb-tkit` 404 | Redirect 301 ke `/kb-tkit` (baris `.htaccess` di atas) |
| 2 | Lebar 861–1040px: header tanpa ajakan daftar | Tautan "PPDB" di menu tampil sebagai tombol hijau di rentang itu (`alqomar-v3-chrome.css` + CSS inline beranda) |
| 3 | Menu utama tanpa `<nav>` | `<ul id="mainNav">` dibungkus `<nav class="nav-utama" aria-label="Navigasi utama">` di 22 halaman; `.nav-utama{display:contents}` menjaga tata letak |
| 4 | Paragraf hero menimpa foto | `.hero p` 46ch → 42ch; gradasi putih digeser sedikit ke kanan (`alqomar-v3.css` + CSS inline beranda) |

Versi CSS naik ke `?v=20261114a` (file lama di-cache 1 tahun, jadi nomor versi wajib naik).

## Belum tercakup

Halaman detail berita (`/berita/<slug>`, dari `berita-detail.php`) tidak ikut diubah karena versi server file itu belum ada di sini. Halaman itu tetap berfungsi; hanya belum punya `<nav>` dan masih merujuk CSS versi lama.
