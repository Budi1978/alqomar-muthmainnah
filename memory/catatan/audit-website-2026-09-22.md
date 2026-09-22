---
judul: Audit Website alqomar.sch.id — 22 Sep 2026
tipe: catatan
tags: [proyek, seo, todo, keamanan]
diperbarui: 2026-09-22
---

# Audit Website alqomar.sch.id — 22 Sep 2026

Bagian dari [[index]]. Basis audit: **isi repo** (akses live diblokir sandbox, lihat [[catatan/sinkronisasi-repo-vs-production]]). Status: poin 2 & 3 **sudah di-upload user** ke Hostinger (22 Sep 2026). Poin 5 & 6 selesai di repo (belum upload). Poin 7 menunggu data NPSN/SK akreditasi dari user.

## Temuan prioritas
1. **KRITIS** `login-divisi.html`: PIN 6 divisi tertulis polos di JS (bisa dibaca via View Source). Juga berlabel "Dar Tanur" di domain sekolah.
2. **Bug CSP**: `guru.html` & `rqaq.html` memuat `cdn.tailwindcss.com`, tapi CSP enforced di `.htaccess` tidak mengizinkannya → kemungkinan tampilan rusak di live (perlu cek user).
3. **Konten basi**: `ppdb.html` masih "Gelombang 2 tutup 16 Mei 2026"; `event.html` masih TP 2025/2026.
4. **Performa**: `guru.html` 670 KB (30 gambar base64 inline); folder `images/` 46 MB, beberapa JPG 0,5–2,7 MB belum WebP.
5. **Konsistensi**: WA 628111597678 (34×) vs 6221559683440 di CLAUDE.md; satu link `wa.me/` kosong; klaim "Akreditasi A" di banyak halaman tanpa nomor SK/NPSN.
6. **Analytics**: GA4 hanya di 5 halaman (index, ppdb, rqaq, spmb-online, tahfidz) — sdit/smpit/kb-tkit/guru/event/berita tidak terlacak.
7. **SEO**: `sekolah-islam-jakarta-barat` masih di-route `.htaccess` tapi tidak ada di sitemap; lastmod sitemap Mei–Jun 2026; privacy/syarat tanpa OG.
8. **Brand**: `itinerary-umroh-tanur-muthmainnah.html/.docx` ada di repo sekolah — cek apakah ter-upload ke server.

## Progres
- **Poin 3 (selesai)**: `guru.html` & `rqaq.html` tidak lagi pakai `cdn.tailwindcss.com` → pakai `css/tw-halaman.min.css` (Tailwind v3 build statis, config sama dengan yang dulu inline). Blok `@font-face` `/cf-fonts/` (sisa Cloudflare, file tidak ada) di guru.html diganti link Google Fonts. **Kalau ada class Tailwind baru di dua halaman itu, CSS harus di-build ulang**: `npx tailwindcss@3 -c <config> -i in.css -o css/tw-halaman.min.css --minify` dengan `content:[guru.html, rqaq.html]` dan theme extend (emerald/gold/cream, font sans/display/arabic).
- **Poin 2 (selesai, TENTATIF)**: semua "PPDB 2026/2027" → "PPDB 2027/2028" + frasa "sudah dibuka" → "segera dibuka"; jadwal gelombang di ppdb.html digeser +1 tahun (pola lama, dilabeli tentatif — **perlu konfirmasi user**). `spmb-online.html` kini kirim `tahun_ajaran:'2027/2028'` ke Supabase. `event.html` → TP 2026/2027 Semester Ganjil, JSON-LD Event basi dihapus, fallback event dikosongkan.
- **Temuan**: tabel Supabase `kegiatan` (project gzcgyqntluhxxrvbcwin) **kosong** → halaman event live tampil "Tidak ada kegiatan mendatang". Perlu diisi agenda TP 2026/2027 lewat CMS.
- Artikel lama (`berita.html` fallback "PPDB 2026/2027 Telah Dibuka", `berita/vortex-2026-...html`) sengaja dibiarkan — itu arsip berita bertanggal.

### Poin 5–7 (22 Sep 2026)
- **Poin 5 — gambar**: temuan utama BUKAN di folder `images/`, tapi upload CMS di Supabase Storage (bucket `cms-alqomar`): file PNG 1,7–2,8 MB yang diberi ekstensi `.webp`. Beranda & `berita.html` memuatnya ukuran penuh. Fix: helper `imgCms(u,w)` (pola sama dengan `berita-detail.php`) → Supabase Image Render API, width 600/800/1200/1600, quality 72. Juga: `berita.html` fallback `Ekskul_pramuka.JPG` (632 KB) → `.webp`; favicon `logo/favicon-32x32.png` (tidak ada) → `logo/logo-32x32.png` di guru/rqaq/spmb-online.
- **Gambar tidak terpakai**: 309 dari 324 file di `images/` (±39 MB) tidak dirujuk kode maupun DB (tabel `berita` & `program_pendidikan` 100% pakai URL Supabase). Daftar: `docs/gambar-tidak-terpakai-2026-09-22.txt`. **Belum dihapus** — tunggu persetujuan user (aturan: tanya dulu sebelum hapus).
- **Poin 6 — GA4**: G-8C4R8ZTBWP kini di 15 halaman publik (+10 halaman). Event baru: `klik_whatsapp` & `klik_daftar` (delegasi klik, param `lokasi`), `generate_lead` (spmb-online setelah insert Supabase sukses, param `jenjang`). `berita-detail.php` **belum** dipasang GA — file PHP rawan beda dengan server, user perlu tempel snippet langsung di server.
- **Poin 7**: NPSN/SK akreditasi tidak ditemukan di web publik. Butuh data dari user: NPSN, peringkat, nomor SK, masa berlaku per jenjang.
- Tabel `kegiatan` masih kosong (cek 22 Sep 2026).
