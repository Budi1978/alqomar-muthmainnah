# Paket perbaikan 10 Nov 2026 — temuan audit no. 2–8

Semua file di `public_html/` diambil dari **situs live** pada 10 Nov 2026 lalu ditambal seminimal mungkin
(bukan dari repo, karena repo basi). Folder `_perbaikan/` sendiri **jangan** di-upload.

## A. Upload langsung (timpa file lama) — hPanel → File Manager → `public_html`

Backup dulu file lama (unduh ke komputer), lalu upload:

| File | Perbaikan | Perubahan |
|---|---|---|
| `ppdb.html` | #2 | hapus `aggregateRating` 4.8/120 dari JSON-LD (1 baris) |
| `berita.html` | #2 | sama. Jika di server ada `berita/index.html` dengan isi yang sama, timpa juga dengan file ini |
| `spmb-online.html` | #7 | `/privacy.html` → `/privacy` |
| `syarat.html` | #7 | `/privacy.html` → `/privacy` |
| `tahfidz.html` | #7 | `…/spmb-online.html` → `…/spmb-online` (2 tempat) |
| `sekolah-islam-jakarta-barat.html` | #7 | `/ppdb.html` → `/ppdb` |
| `robots.txt` | #5 | tambah `Disallow: /login-divisi` dan `/_backup/` |
| `logo/logo-192.png`, `logo/logo-512.png` | #4 | ikon yang dirujuk `site.webmanifest` (sebelumnya 404) |
| `js/berita-detail.js` | #3 #8 | file baru — lihat bagian B |

Skrip inline yang dieksekusi tidak disentuh, jadi hash CSP yang ada tetap cocok.

## B. Edit `berita-detail.php` di server (#3 dan #8) — 1 blok

Skrip utama halaman detail berita saat ini inline dan hash-nya tidak terdaftar di CSP, jadi diblokir browser.
Isinya sudah dipindah ke `js/berita-detail.js` (identik, kecuali kunci Supabase diganti ke `sb_publishable_…`).

1. Upload `js/berita-detail.js` dulu.
2. Buka `berita-detail.php` di File Manager. Cari blok yang **dimulai** dengan:
   ```html
   <script>
     const SUPABASE_URL = 'https://gzcgyqntluhxxrvbcwin.supabase.co';
   ```
   dan **berakhir** dengan:
   ```html
   if(_cp)_cp.addEventListener('click',function(){copyLink(_cp);});
   </script>
   ```
3. Ganti seluruh blok itu (dari `<script>` sampai `</script>`) dengan satu baris:
   ```html
   <script src="/js/berita-detail.js?v=20261110"></script>
   ```
   Jangan pakai `defer` dan jangan pindahkan posisinya. Blok `<script>` berikutnya (`function tandaiPotret…`) biarkan.
4. Opsional (#8, sisi server): bila di bagian PHP atas ada kunci `eyJhbGciOi…` untuk cURL ke Supabase, ganti dengan
   `sb_publishable_F641BOnF7LUfmctyCmiJvw_yo6aiFXY`.

Uji: buka satu artikel → bagian "Berita Lainnya" terisi, tombol "Salin Link" bekerja, konsol (F12) tanpa error CSP inline.

## C. Edit `.htaccess` di server (#6) — Cloudflare Web Analytics

Di **kedua** baris header (`Content-Security-Policy` dan `Content-Security-Policy-Report-Only`):

- cari `script-src 'self' https://cdn.jsdelivr.net https://www.googletagmanager.com`
  ganti `script-src 'self' https://cdn.jsdelivr.net https://www.googletagmanager.com https://static.cloudflareinsights.com`
- cari `connect-src 'self' https://*.supabase.co`
  ganti `connect-src 'self' https://cloudflareinsights.com https://*.supabase.co`

Alternatif tanpa edit file: matikan Web Analytics di dashboard Cloudflare (Analytics & Logs → Web Analytics), karena GA4 sudah terpasang.

## D. Sudah dikerjakan langsung (tanpa upload)

- Supabase `schema_markup` (baris `homepage` / EducationalOrganization): `aggregateRating` dihapus.

## Catatan

- Temuan "tautan rusak `/berita/w)`" di audit **bukan bug** — salah baca alat audit terhadap kode JS. Diabaikan.
- `logo-512.png` diperbesar dari ikon 180 px yang ada di server, jadi agak lembut. Ganti dengan ekspor dari file master logo bila ada.
- Setelah upload: hard refresh (Ctrl+Shift+R); HTML di-cache 10 menit.
