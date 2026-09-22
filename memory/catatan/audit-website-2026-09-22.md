---
judul: Audit Website alqomar.sch.id — 22 Sep 2026
tipe: catatan
tags: [proyek, seo, todo, keamanan]
diperbarui: 2026-09-22
---

# Audit Website alqomar.sch.id — 22 Sep 2026

Bagian dari [[index]]. Basis audit: **isi repo** (akses live diblokir sandbox, lihat [[catatan/sinkronisasi-repo-vs-production]]). Belum ada perbaikan yang dieksekusi — status: menunggu keputusan user.

## Temuan prioritas
1. **KRITIS** `login-divisi.html`: PIN 6 divisi tertulis polos di JS (bisa dibaca via View Source). Juga berlabel "Dar Tanur" di domain sekolah.
2. **Bug CSP**: `guru.html` & `rqaq.html` memuat `cdn.tailwindcss.com`, tapi CSP enforced di `.htaccess` tidak mengizinkannya → kemungkinan tampilan rusak di live (perlu cek user).
3. **Konten basi**: `ppdb.html` masih "Gelombang 2 tutup 16 Mei 2026"; `event.html` masih TP 2025/2026.
4. **Performa**: `guru.html` 670 KB (30 gambar base64 inline); folder `images/` 46 MB, beberapa JPG 0,5–2,7 MB belum WebP.
5. **Konsistensi**: WA 628111597678 (34×) vs 6221559683440 di CLAUDE.md; satu link `wa.me/` kosong; klaim "Akreditasi A" di banyak halaman tanpa nomor SK/NPSN.
6. **Analytics**: GA4 hanya di 5 halaman (index, ppdb, rqaq, spmb-online, tahfidz) — sdit/smpit/kb-tkit/guru/event/berita tidak terlacak.
7. **SEO**: `sekolah-islam-jakarta-barat` masih di-route `.htaccess` tapi tidak ada di sitemap; lastmod sitemap Mei–Jun 2026; privacy/syarat tanpa OG.
8. **Brand**: `itinerary-umroh-tanur-muthmainnah.html/.docx` ada di repo sekolah — cek apakah ter-upload ke server.
