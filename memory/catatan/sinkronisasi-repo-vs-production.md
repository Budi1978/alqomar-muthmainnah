---
judul: Repo Git BISA Basi dari Production — Selalu Verifikasi
tipe: catatan
tags: [proyek, konvensi, todo, penting]
diperbarui: 2026-09-14
---

# Repo Git BISA Basi dari Production — Selalu Verifikasi

Bagian dari [[index]].

## Ringkasan

**14 September 2026**: ketahuan bahwa `.htaccess` dan `berita-detail.php` di server Hostinger sudah lama diedit **langsung di server** (lewat File Manager/FTP) tanpa pernah di-commit balik ke Git. Repo GitHub jadi jauh ketinggalan/salah — Claude sempat kerja berdasarkan asumsi repo = kondisi live, dan itu salah, bikin user harus mengulang penjelasan.

## Detail

**Kejadian:**
- `berita-detail.php` di repo: ~5 KB (basic OG tags saja). Di server: ~26 KB (sudah pakai Supabase JS SDK, DOMPurify, image CDN transform, halaman detail lengkap).
- `.htaccess` di repo: versi sederhana. Di server: jauh lebih lengkap — ada redirect apex→www, clean URL `/berita/{slug}`, sitemap-berita.xml rewrite, CSP aktif+report-only, HSTS, COOP, dengan komentar histori insiden spesifik (infinite loop 14/09/2026 di 30rb+ req/detik, insiden CSP 17 Agustus mematikan Cropper/Quill di cms-alqomar.html, dll).
- Kedua file production sudah disalin balik ke repo (commit `cd03996` dan `e2517a6` di branch `claude/alqomar-system-check-dx8bvd`) supaya tidak hilang.

**Root cause:** alur kerja proyek ini adalah "edit → commit → push → **upload manual** ke Hostinger" (lihat CLAUDE.md bagian Deployment). Tapi kenyataannya kadang ada perubahan **darurat/langsung di server** (fix insiden production) yang tidak pernah dibawa balik ke repo. Repo jadi searah saja (Git → server), padahal seharusnya dua arah.

## Aturan Kerja Baru (WAJIB diikuti tiap sesi)

1. **Jangan asumsikan isi repo = kondisi live** untuk file-file kritis (`.htaccess`, `*.php`, apa pun yang bisa diedit langsung di server). Kalau mau audit/"cek sistem", **minta user screenshot atau paste isi file dari server dulu** sebelum menyimpulkan sesuatu salah/usang berdasarkan repo saja.
2. **Setiap kali user paste/upload isi file dari server yang ternyata beda dari repo** → langsung commit & push versi server itu ke repo tanpa diminta dua kali, sebagai arsip/cadangan.
3. **Setiap selesai satu pekerjaan/perbaikan** (bukan cuma di akhir sesi) → catat ringkas di memory ini (folder `catatan/` atau `keputusan/`) supaya sesi berikutnya tidak mengulang analisis dari nol. User eksplisit minta ini (14 Sept 2026): *"setiap selesai pekerjaan dicatat, jadi saya nga capek ngulang2"*.
4. Kalau nemu file besar/aneh yang cuma ada di server (bukan di repo) atau sebaliknya, **tanya dulu** apakah itu sengaja atau residu, jangan langsung hapus/asumsikan.

## Tautan Terkait

- [[konteks-proyek]]
