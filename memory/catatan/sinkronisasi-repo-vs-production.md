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
5. **Ketimpangan berlaku dua arah.** File di repo belum tentu pernah sampai ke server — dikonfirmasi 14 Sept 2026: `IMG_5490.jpg` dan `berita-detail-backup-20260614-010209.php` ada di repo tapi **tidak pernah ada** di `public_html` Hostinger. Jadi "ketemu di repo" ≠ "perlu dibersihkan di server juga" — cek server dulu sebelum minta user hapus sesuatu di sana.

## Catatan Penting: Claude Tidak Punya Akses Langsung ke Hostinger

Sesi Claude berjalan di sandbox tanpa kredensial FTP/API Hostinger, dan akses jaringan sandbox ke `alqomar.sch.id` diblokir. **Claude tidak bisa cek File Manager sendiri** — semua verifikasi kondisi live (isi `.htaccess`, ada/tidaknya file tertentu, dll) harus lewat screenshot/paste dari user. Jangan janji "saya cek sendiri" ke server.

## Tautan Terkait

- [[konteks-proyek]]

## Insiden 23 Sep 2026 — Upload dari branch basi menimpa desain live

Claude membuat ZIP upload dari branch yang bercabang dari `main` (16 Sep). Padahal banyak perubahan desain yang **sudah live tapi tidak pernah di-merge ke `main`**, tersebar di branch: `jolly-volta-k5cxy9` (redesain beranda 17 Sep), `design-system-extraction-5zuukp` (event.html 19 Sep), `blissful-fermat-50yo0r`, `gracious-babbage-c6ncjx`, `beautiful-franklin-x9uxqk`, `alqomar-security-audit-hdisvr`, `cek-sistem-c2wnam`. Hasil: desain live mundur ke versi lama.

**Aturan tambahan (WAJIB):**
6. `main` BUKAN sumber kebenaran untuk file HTML. Sebelum mengubah/mengirim file apa pun untuk di-upload, **minta user download dulu file yang sedang live** (atau restore backup Hostinger), lalu terapkan perubahan di atas file live itu.
7. Jangan pernah kirim file utuh untuk timpa server tanpa verifikasi basisnya = versi live.
8. Daftar "gambar tidak terpakai" dihitung dari repo → TIDAK valid untuk server. Jangan hapus gambar di server berdasarkan daftar itu.
