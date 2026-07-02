# Audit Multi-Agent Website alqomar.sch.id

**Tanggal:** 2 Juli 2026
**Metode:** 4 agent audit berjalan paralel, masing-masing dengan lensa berbeda:

| Agent (persona) | Lensa Audit |
|---|---|
| "Claude Code" | Arsitektur kode & maintainability |
| "Grok" | Performa & UX mobile |
| "Gemini" | SEO, konten & aksesibilitas |
| "Codex" | Keamanan & correctness |

> Catatan: keempat persona dijalankan sebagai subagent Claude paralel dengan fokus audit berbeda (bukan model Grok/Gemini/Codex asli). Semua angka diverifikasi langsung dari file repo dengan shell (ls, du, wc, grep).

---

## 🔴 Temuan Lintas-Agent (ditemukan ≥2 agent — keyakinan tinggi)

### 1. [KRITIS — Keamanan] PIN login divisi terekspos plaintext
`login-divisi.html` baris 142–156 berisi **13 PIN divisi hardcoded di JavaScript** (Ticketing, Hotel, Finance, Visa, HR, IT, dll). Siapa pun bisa View Source dan melihat semua PIN. Verifikasi 100% sisi klien (`checkPin()`, case-insensitive), tanpa sesi/server — login ini murni kosmetik. **Semua PIN harus dianggap sudah bocor** (juga tersimpan di git history). Anomali: halaman berjudul "Dar Tanur — Portal Akses Divisi Internal" (bisnis travel umroh), bukan sekolah.

### 2. [KRITIS — Bisnis] Funnel pendaftaran PPDB kemungkinan 404
CTA utama seluruh situs menunjuk `alqomar.sch.id/spmb-online` (index.html baris 559, 582, 618, 2139; ppdb.html 9×), tetapi file `spmb-online*.html` **tidak ada** di repo dan **tidak ada aturan** di `_redirects`. Sitemap juga mendaftarkan `guru.html`, `tahfidz.html`, `rqaq.html` yang tidak ada (404 terindeks); `rqaq.html` bahkan di-link 3× dari index.html.

### 3. [KRITIS — Performa/Keamanan] ~47 MB file sampah ter-deploy publik
Ter-commit dan ikut deploy ke Netlify: `index-live-latest.html` (**22,4 MB**, berisi 147 gambar base64 + ribuan string PIN/NoHP usang), `_backup/index.html.2026-04-14` & `-15` (**~22 MB each**), `IMG_5490.jpg` (2,7 MB di root, tak direferensikan), `index-live.html` (197 KB). Git pack membengkak jadi 35,75 MiB. `robots.txt` hanya mencegah crawl, **tidak mencegah akses langsung**, dan meta robots file-file ini masih `index, follow`.

### 4. [TINGGI — Performa] 67% ukuran index.html adalah gambar base64
Dari 536.816 byte, **361.112 byte (67%)** adalah 4 gambar hero `data:image/webp` base64 (baris 576, 588, 600, 612). Gzip hanya menurunkan ke ~317 KB, HTML ber-`max-age=0` sehingga **setiap kunjungan ulang mengunduh ulang ~310 KB**. Ditambah **269 KB preload hantu**: `gal-001.webp` di-preload `fetchpriority="high"` padahal tidak dipakai di mana pun; JS juga preload gal-002/003/004 yang tidak direferensikan file HTML mana pun. Estimasi LCP di 4G lambat saat ini ~3–4 detik; bisa turun ke ~1,5 detik.

### 5. [TINGGI — Keamanan] Tidak ada CSP, HSTS, Referrer-Policy, Permissions-Policy
`_headers` hanya berisi `X-Frame-Options` dan `X-Content-Type-Options` — **bertentangan dengan CLAUDE.md yang mengklaim ada CSP**. Berbahaya karena dikombinasikan dengan temuan #6.

### 6. [TINGGI — Keamanan] Jalur XSS nyata di halaman berita
`berita-detail.html:602-603` me-render konten dari Supabase mentah via `innerHTML` tanpa sanitasi; `judul` dan `foto_url` juga diinterpolasi ke `innerHTML` (baris 589). Anon key + URL Supabase terekspos di 4 file (normal untuk Supabase, tapi **hanya aman jika RLS aktif** — perlu diverifikasi di dashboard). Kombinasi: RLS lemah → tulis konten jahat → render innerHTML → tanpa CSP = XSS tersimpan.

### 7. [SEDANG — Konsistensi] Duplikasi & drift antar halaman
- **3 sistem design token berbeda**: index/event pakai `--h:#1a5c38, --e:#c8922a`; berita/ppdb pakai `--h:#1B6B3A, --e:#C9A84C` (warna brand beda!); berita/index & berita-detail pakai nama variabel lain (`--hijau-tua`); login-divisi lain lagi.
- `berita/index.html` dan `berita-detail.html` **88% identik** (fungsi JS duplikat); `berita.html` masih ada padahal sudah di-301.
- Navbar/footer drift: href logo beda-beda, `event.html` tidak punya footer penuh, `toggleFaq()` diimplementasi 2× dengan API berbeda.
- **Nomor WhatsApp tidak konsisten**: index/berita/event pakai `628111597678`, ppdb pakai `6221559683440` — calon pendaftar bisa salah sasaran.

---

## Temuan Per Agent

### 🏗️ "Claude Code" — Arsitektur & Maintainability

**Kekuatan:** konvensi CSS variables & kelas singkat konsisten di halaman inti; CSS per-section dipatuhi (13 tag `<style>` tersebar); JS slider matang (pause on hover, swipe passive, keyboard nav, wrap-around); error handling `try/catch` + fallback di `loadBerita()`; robots/redirects/cache Netlify dikelola sadar; lazy-load iframe dengan fallback; `onerror` handler logo.

**Kelemahan tambahan:** CLAUDE.md kedaluwarsa di 4 klaim (menyebut "tanpa library eksternal" padahal 4 halaman load Supabase dari CDN; klaim CSP yang tidak ada; klaim IntersectionObserver nav-active padahal pakai scroll listener; struktur repo tak lengkap); tidak ada `.gitignore`, `.DS_Store` ter-commit; `berita/.htaccess` = config Apache mati di Netlify; `submitPPDB()` membuat No. Registrasi dari `Math.random()` (9.000 kemungkinan, bisa tabrakan, tidak tercatat di server); anon key Supabase di-hardcode di 4 file terpisah.

### ⚡ "Grok" — Performa & UX Mobile

**Kekuatan:** 133/133 `<img>` ber-`loading="lazy"` (hero slide 1 benar pakai `eager` + `fetchpriority="high"`); 48/48 gambar galeri WebP (3,8 MB total); YouTube/Maps lazy via IntersectionObserver + fallback; preconnect/dns-prefetch lengkap; `width`/`height` eksplisit di hero (anti-CLS); caching Netlify benar; halaman sekunder ringan (9–45 KB).

**Kelemahan tambahan:** 11 varian font dari 3 family (~150–250 KB render-critical) — weight 300/500 & italic Playfair hampir pasti jarang terpakai; scroll handler nav-active baca `offsetTop` semua section tiap event tanpa throttle → forced reflow / jank di Android low-end; **tap target di bawah standar**: dot hero 9×9px, dot mqs 7×7px (standar 44px — audiens orang tua!); menu mobile tidak menutup setelah link di-tap; **0 dukungan `prefers-reduced-motion`** padahal ada ticker infinite, pulse WA, tooltip WA berkedip tiap 2,2 detik; srcset = 0 (HP unduh gambar 900px); 5 breakpoint berbeda (480/600/768/900/968) padahal konvensi hanya 768/480.

### 🔍 "Gemini" — SEO, Konten & Aksesibilitas

**Kekuatan:** title/description/canonical unik semua halaman (title tepat 60 karakter, kata kunci lokal); **JSON-LD kaya di atas rata-rata website sekolah** (FAQPage, Organization, BreadcrumbList, Event+Offer, NewsArticle, School); duplicate content berita ditangani benar (301 + canonical); robots.txt tepat sasaran + noindex lapis ganda di login; **alt text 100%** (133/133) dan deskriptif; `lang="id"`, tepat satu `<h1>` per halaman, hierarki heading sehat; info penting mudah ditemukan (telepon 9×, PPDB 9×).

**Kelemahan tambahan:** **og:image menunjuk file yang TIDAK ADA di semua halaman** (`/logo/logo.png` dan `/images/og-image.jpg` — keduanya tidak ada) → share ke WhatsApp/Facebook (kanal utama orang tua!) tampil tanpa gambar; markup Cloudflare email-protection mati di Netlify → pengunjung melihat teks literal "[email protected]" dengan link 404 (index.html baris 511, 517); **kontras emas #c8922a di putih ≈ 2,8:1, gagal WCAG AA** (dipakai sebagai warna teks 58×); FAQ akordeon `<div onclick>` tanpa tabindex/aria-expanded → tidak bisa diakses keyboard; hamburger & panah slider tanpa aria-label; Twitter Card absen di berita.html & ppdb.html; konten off-topic `itinerary-umroh-tanur-muthmainnah.html` di root domain sekolah; homepage pakai `@type: Organization` alih-alih `EducationalOrganization`/`School`.

### 🔒 "Codex" — Keamanan & Correctness

**Kekuatan:** X-Frame-Options + nosniff ada; semua resource eksternal HTTPS (0 mixed content); `_redirects` dirancang cermat (301 GSC, shadowing benar); HTML index.html seimbang tanpa id duplikat (div 877/877, section 22/22); `textContent` dipakai untuk field teks berita (sebagian aman-XSS); tidak ada secret server-side terekspos.

**Kelemahan tambahan:** `target="_blank"` tanpa `rel="noopener"` di seluruh situs (index 28×, ppdb 15×, dll — 0 yang punya) → celah tabnabbing.

---

## 📋 Rencana Perbaikan Terkonsolidasi (urut prioritas)

### Prioritas 1 — Kerjakan minggu ini
1. **Amankan/hapus `login-divisi.html`**: rotasi ke-13 PIN (sudah bocor di git history), lalu pindah ke autentikasi ber-backend (Supabase Auth / Netlify Identity) atau minimal Netlify password protection. Jangan pernah simpan kredensial di JS klien.
2. **Perbaiki funnel PPDB**: tambah aturan `_redirects` untuk `/spmb-online` (ke ppdb.html atau form asli). Ini CTA utama situs — setiap hari rusak = calon pendaftar hilang.
3. **Bersihkan file sampah dari deploy**: hapus `index-live-latest.html`, `index-live.html`, `IMG_5490.jpg` (pindah ke `images/` bila perlu), keluarkan `_backup/` dari deploy. Idealnya bersihkan git history (`git filter-repo`).
4. **Perbaiki og:image**: upload gambar nyata 1200×630 ke path yang dirujuk, atau ubah tag ke file yang ada. Share WhatsApp = kanal marketing utama sekolah.

### Prioritas 2 — Kerjakan bulan ini
5. **Ekstrak 4 gambar base64 hero ke `images/hero-*.webp`** (index.html 536 KB → ~235 KB; kunjungan ulang nyaris instan) + hapus preload hantu gal-001..004 (269 KB terbuang, 5 menit kerja).
6. **Tambah header keamanan di `_headers`**: CSP (izinkan self, fonts, youtube, maps, jsdelivr, *.supabase.co; `unsafe-inline` diperlukan untuk arsitektur inline), HSTS, Referrer-Policy, Permissions-Policy.
7. **Verifikasi RLS Supabase** (SELECT publik saja, tolak write untuk `anon`) + **sanitasi `innerHTML`** di berita-detail.html (DOMPurify atau whitelist tag).
8. **Sinkronkan sitemap & link**: hapus entri `guru.html`, `tahfidz.html`, `rqaq.html`; hapus 3 link `rqaq.html` di index.html; perbaiki email Cloudflare-obfuscated jadi `mailto:` biasa.
9. **Satukan design token & nomor WhatsApp** di semua halaman (pilih satu set warna sesuai CLAUDE.md, satu nomor WA resmi).

### Prioritas 3 — Perbaikan berkelanjutan
10. Tambah `rel="noopener noreferrer"` ke semua `target="_blank"`.
11. Aksesibilitas: FAQ jadi `<button>` + `aria-expanded`; aria-label di hamburger/panah; perbesar tap target dot ≥44px; menu mobile menutup saat link di-tap; blok `prefers-reduced-motion`.
12. Ganti warna teks emas dengan varian gelap (mis. `--e-dark:#8a6114`) agar lolos kontras WCAG; emas asli jadi aksen/dekorasi saja.
13. Pangkas font ke 6–7 varian; throttle scroll handler nav-active (atau ganti IntersectionObserver); srcset untuk gambar galeri.
14. Konsolidasi berita (hapus `berita.html` fisik, satukan `berita/index.html` + `berita-detail.html`); hapus `berita/.htaccess`; tambah `.gitignore`.
15. Perbarui CLAUDE.md agar sesuai kode nyata (Supabase, CSP, nav-active, daftar file); ganti No. Registrasi `Math.random()` di `submitPPDB()` dengan timestamp/Supabase; keluarkan file itinerary umroh dari domain sekolah.

---

## Kesimpulan

Fondasi situs **lebih baik dari rata-rata website sekolah** — SEO on-page rapi, structured data kaya, lazy loading disiplin, alt text 100%, dan konfigurasi Netlify dikelola dengan sadar. Namun ada **3 masalah kritis yang butuh tindakan segera**: (1) PIN internal terekspos publik, (2) tautan pendaftaran PPDB — CTA utama situs — kemungkinan 404, dan (3) ~47 MB file arsip berisi data usang ikut ter-deploy publik. Setelah itu, perbaikan berdampak terbesar adalah mengeluarkan gambar base64 dari index.html (memangkas waktu muat halaman utama dari ~3–4 detik menjadi ~1,5 detik di 4G) dan memperbaiki og:image agar share WhatsApp — kanal utama orang tua — menampilkan preview yang benar.
