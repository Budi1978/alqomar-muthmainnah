# Notulen — 404 Link Berita ASAT (alqomar.sch.id)
Tanggal: 2026-06-04

## Masalah
Berita "Asesmen Sumatif Akhir Tahun (ASAT)" baru diupload via cms-alqomar.html. Klik link → 404.

## Diagnosa
- Slug ASAT ADA di Supabase (gzcgyqntluhxxrvbcwin), bukan NULL → berita/foto aman.
- `/berita-detail.html?slug=<slug>` → 200 (halaman normal).
- `/berita/<slug>` → 404 → rule clean-URL hilang dari `.htaccess` LIVE.
- `.htaccess` server = versi 2026-05-15 (header/cache lengkap, TANPA rule berita). Ke-overwrite saat deploy redesign. Insiden BERULANG (sama 2026-06-02).

## Fix
Tambah ke `.htaccess` (sebelum bagian PRETTY URLs):
```
RewriteRule ^berita/([^/]+)/?$ /berita-detail.html?slug=$1 [L,QSA]
```
Sudah dipatch lokal di: 06-WEBSITE LIVE/alqomar.sch.id/.htaccess (2026-06-04 08:05).
PENDING: user upload-replace ke public_html/.htaccess di hPanel (file hidden).

## Temuan tambahan (akar masalah)
- Ada 26 copy `.htaccess` di laptop, versi tidak sinkron → version sprawl.
- Sumber kebenaran LIVE hanya server Hostinger (public_html/.htaccess).
- Keputusan: tetapkan SATU folder kanonik deploy = 06-WEBSITE LIVE/alqomar.sch.id/, arsipkan sisanya.

## Aturan baru
- Jangan pernah tanya izin update memory — rekam otomatis semua. (preferences.md + feedback_always_record_memory.md)

## Update — Bug galeri foto (5 foto cuma tampil 1)
- Tabel berita punya `foto_url` (text, foto utama) + `foto_urls` (ARRAY, semua foto). Row ASAT: foto_urls = 5 foto, data AMAN.
- Bug: berita-detail.html baris 532-533 cuma render `berita.foto_url` (1), array `foto_urls` diabaikan. Berlaku utk SEMUA berita multi-foto.
- Fix: render loop `foto_urls` (fallback ke foto_url) + CSS `.foto-container img + img { margin-top:16px }`. Sudah dipatch lokal di 06-WEBSITE LIVE/berita-detail.html.
- PENDING: upload berita-detail.html ke public_html/ via hPanel, lalu verifikasi jumlah foto via Playwright.

## RESOLVED — 2026-06-04
- berita-detail.html ter-deploy ke server. Verifikasi Playwright: #foto-container img = 5, semua naturalWidth>0, src sesuai foto_urls.
- Kedua masalah ASAT tuntas: (1) link 404 via .htaccess, (2) galeri 5 foto via foto_urls loop.

## Update 2 — slug anti-spasi + layout galeri
- Insiden: user buka URL dgn `%20%20%20` nyelip di tengah slug (sum%20%20%20atif) → "Berita tidak ditemukan". Akar: copy-paste merusak URL, bukan server.
- Fix 1: cleanSlug() di berita-detail.html — decodeURIComponent + buang whitespace dari slug sebelum query. Link kotor tetap ketemu.
- Fix 2: layout foto diubah — cover 1 foto di atas, isi berita, lalu galeri grid (klik perbesar) di bawah. Sebelumnya 5 foto numpuk di atas.
- Verifikasi Playwright (pakai URL kotor): errorShown=false, cover=1, galeriVisible=true, galeriImgs=4, label "Galeri Kegiatan (5 foto)". RESOLVED.

## Update 3 — WhatsApp preview no-foto + PHP OG + Cloudflare
- Penyebab no-foto di WA: og:image/title/desc di berita-detail.html cuma di-set via JS. Crawler WA tidak jalankan JS → baca HTML mentah (default, tanpa og:image).
- Solusi: berita-detail.php (server-side) — fetch berita via Supabase REST (apikey publishable), tulis og:title/og:description/og:image(cover)/twitter ke <head>. Pakai berita-detail.html sbg sumber layout (file_get_contents + inject OG). Fallback default images/og-alqomar.jpg. PHP juga preg_replace buang spasi dari slug.
- .htaccess: rule clean-URL berita diarahkan ke berita-detail.php (bukan .html).
- INFRA BARU diketahui: situs alqomar.sch.id di belakang CLOUDFLARE (server: cloudflare, cf-fonts rewrite). Ada lapisan cache CF di atas Hostinger+browser → sumber utama "stuck versi lama". Verifikasi harus pakai cache-buster query (?cb=) atau cek cf-cache-status.
- Verifikasi: php direct & clean URL keduanya output og:image = cover ASAT (supabase .../1780534819313_ruy30abaqag.jpg), cf-cache-status DYNAMIC. RESOLVED sisi server.
- Sisa: cache preview WhatsApp per-URL (bukan masalah server) — share link bersih utk crawl ulang.

## Update 4 — Matikan cache-lag (atas permintaan user, capek ngejar cache)
- Konfirmasi: crawler facebookexternalhit dapat og:image cover ASAT yang BENAR (clean & ?v=2). Server 100% benar; preview default di WA = cache WhatsApp utk URL spasi lama (user masih share URL berspasi).
- Fix cache-lag di .htaccess:
  - ExpiresByType text/html → "access plus 0 seconds"
  - FilesMatch (html|htm|php) → Cache-Control "no-cache, no-store, must-revalidate, max-age=0" + Pragma no-cache
- berita-detail.php: tambah header no-cache.
- Efek: HTML/PHP tidak di-cache browser → perubahan berita langsung kelihatan. Asset (img/css/js) tetap cache 1th.
- PENDING upload: .htaccess + berita-detail.php. One-time: Cloudflare Purge Everything + hard refresh.
