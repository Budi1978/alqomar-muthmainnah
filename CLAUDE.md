# CLAUDE.md

## Ringkasan Proyek

**Website Sekolah Al-Qomar Muthmainnah** — website statis multi-halaman untuk lembaga pendidikan Islam di bawah naungan Yayasan Pendidikan Islam Purnama Cendekia (YPIPC), berlokasi di Jakarta Barat, Indonesia. Sekolah ini beroperasi di empat jenjang pendidikan: KB (Kelompok Bermain), TKIT (Taman Kanak-Kanak Islam Terpadu), SDIT (Sekolah Dasar Islam Terpadu), dan SMPIT (Sekolah Menengah Pertama Islam Terpadu).

- **Domain**: alqomar.sch.id (dikonfigurasi melalui file `CNAME`)
- **Hosting**: Netlify
- **Bahasa konten**: Bahasa Indonesia
- **Alamat**: Jl. Kamal Raya No.1 Tegal Alur, Kalideres, Jakarta Barat
- **Telepon**: (021) 55968344
- **Email**: info@purnamacendekia.sch.id

## Struktur Repositori

```
alqomar-muthmainnah/
├── index.html                              # Halaman utama (~533 KB, 35+ section)
├── berita.html                             # Halaman daftar berita/artikel
├── berita-detail.html                      # Template halaman detail artikel
├── event.html                              # Halaman daftar event/kegiatan
├── ppdb.html                               # Halaman PPDB (Pendaftaran Peserta Didik Baru)
├── login-divisi.html                       # Halaman login untuk divisi internal
├── itinerary-umroh-tanur-muthmainnah.html  # Itinerary paket Umroh Tanur Muthmainnah
├── itinerary-umroh-tanur-muthmainnah.docx  # Versi Word dari itinerary Umroh
├── index-live.html                         # Snapshot live sebelumnya (~197 KB)
├── index-live-latest.html                  # Snapshot live terbaru (~22 MB, berisi base64 inline)
├── berita/                                 # Subdirektori berita — URL bersih /berita/
│   ├── index.html                          # Daftar berita (dapat diakses di /berita/)
│   └── .htaccess                           # Konfigurasi URL rewrite
├── _backup/                                # Backup berterima tanggal (~22 MB masing-masing)
│   ├── index.html.2026-04-14
│   └── index.html.2026-04-15
├── docs/                                   # Dokumen pendukung
│   └── superpowers/
│       └── plans/
│           └── 2026-04-18-cms-website-upgrade.md  # Rencana integrasi CMS Supabase
├── images/                                 # Aset gambar
│   └── galeri/                             # 48 foto galeri (gal-001.webp … gal-048.webp)
├── .claude/                                # Konfigurasi Claude Code
│   └── skills/
│       ├── desain-profesional.md           # Skill: brief & panduan desain visual
│       └── konten-sosmed.md                # Skill: konten Instagram & TikTok
├── IMG_5490.jpg                            # Gambar aset (sebaiknya dipindah ke images/)
├── _headers                                # Header HTTP Netlify (cache, keamanan)
├── _redirects                              # Aturan redirect 404 dari Google Search Console
├── CNAME                                   # Domain kustom: alqomar.sch.id
├── robots.txt                              # Instruksi crawler mesin pencari
├── sitemap.xml                             # Sitemap XML untuk SEO
└── caption-ppdb-ig.txt                     # Teks caption Instagram kampanye PPDB
```

## Teknologi yang Digunakan

- **HTML5** — markup semantik dengan desain responsif
- **CSS3** — gaya tertanam menggunakan CSS custom properties, flexbox, dan grid
- **Vanilla JavaScript** — tanpa framework atau library eksternal
- **Google Fonts** — Plus Jakarta Sans, Amiri, Playfair Display
- **Embed eksternal** — Google Maps, video YouTube

**Tidak ada build system, package manager, atau framework.** Semua CSS dan JavaScript ditulis secara inline di dalam setiap file HTML.

## Halaman-Halaman Website

| File | URL | Deskripsi |
|------|-----|-----------|
| `index.html` | `/` | Halaman utama lengkap (35+ section) |
| `berita.html` | `/berita.html` | Daftar artikel/berita sekolah |
| `berita/index.html` | `/berita/` | Mirror berita dengan URL bersih |
| `berita-detail.html` | `/berita-detail.html` | Template halaman detail artikel |
| `event.html` | `/event.html` | Daftar event dan agenda sekolah |
| `ppdb.html` | `/ppdb.html` | Informasi dan pendaftaran PPDB |
| `login-divisi.html` | `/login-divisi.html` | Login internal divisi sekolah |
| `itinerary-umroh-tanur-muthmainnah.html` | `/itinerary-umroh-tanur-muthmainnah.html` | Itinerary paket Umroh Tanur |

**Halaman dalam sitemap.xml yang belum ada (rencana):**
- `/spmb-online.html` — Formulir SPMB online
- `/guru.html` — Profil dewan guru
- `/tahfidz.html` — Program tahfidz
- `/rqaq.html` — Rumah Quran Al-Qomar

## Variabel CSS (Sistem Desain)

| Variabel | Nilai | Kegunaan |
|----------|-------|----------|
| `--h` | `#1a5c38` | Hijau utama (gelap) |
| `--h2` | `#1e6e42` | Hijau menengah |
| `--h3` | `#2a8a54` | Hijau terang |
| `--e` | `#c8922a` | Emas utama |
| `--e2` | `#e0a832` | Emas terang |
| `--ep` | `#fdf3e0` | Latar belakang emas pucat |
| `--kr` | `#faf7f2` | Latar belakang krem |
| `--kr2` | `#f0e9d8` | Krem gelap / border |

Selalu gunakan variabel-variabel ini saat menambah elemen baru — jangan hardcode nilai warna.

## Bagian-Bagian `index.html` (berurutan)

Gunakan komentar HTML `<!-- NAMA SECTION -->` sebagai penanda navigasi antar section.

1. **TICKER** (baris ~444) — marquee pengumuman berjalan (PPDB, kontak, program) + tautan media sosial
2. **NAVBAR** (baris ~462) — navbar sticky dengan menu dropdown + hamburger menu mobile
3. **HERO SLIDER** (baris ~512) — carousel dengan rotasi otomatis (5,5 detik), tombol panah, dot navigasi; gambar dari file eksternal (bukan base64)
4. **ANNOUNCE** (baris ~581) — banner pengumuman di bawah hero (latar kuning `--ep`)
5. **WIDGET ROW** (baris ~589) — kartu statistik/informasi (latar hijau `--h`)
6. **KENAPA PILIH** (baris ~615) — "Kenapa memilih kami" (grid 3 kolom)
7. **PROFIL SEKOLAH** (baris ~634) — profil singkat sekolah
8. **JENJANG TABS** (baris ~667) — sistem tab untuk KB/TKIT/SDIT/SMPIT (4 tab) dengan galeri kegiatan tiap jenjang
9. **PANEL TAB GALERI KEGIATAN** (baris ~990) — tab konten: MUNAQOSYAH, SANTUNAN
10. **DEWAN GURU** (baris ~1067) — profil singkat guru
11. **FASILITAS** (baris ~1144) — fasilitas sekolah (grid 4 kolom)
12. **VISI MISI** (baris ~1162) — kartu visi dan misi sekolah
13. **STATS** (baris ~1189) — pencapaian/statistik angka (4 kolom)
14. **BERITA** (baris ~1205) — artikel/berita terkini (grid 3 kolom)
15. **MUNAQOSYAH** (baris ~1247) — section khusus Munaqosyah dengan slider foto kanan
16. **RUMAH QURAN** (baris ~1365) — program Rumah Quran Al-Qomar
17. **SANTUNAN** (baris ~1475) — kegiatan santunan sosial + grid foto + info kanan
18. **LIGHTBOX SANTUNAN** (baris ~1584) — lightbox foto santunan
19. **VIDEO YOUTUBE** (baris ~1604) — pemutar YouTube utama
20. **GALERI** (baris ~1641) — galeri foto kegiatan dengan filter tombol + grid masonry (48 foto webp dari `images/galeri/`)
21. **LIGHTBOX GALERI** (baris ~1829) — lightbox foto galeri
22. **PRESTASI** (baris ~1917) — pencapaian dan penghargaan sekolah
23. **JADWAL ISLAMI** (baris ~1989) — jadwal kegiatan islami rutin
24. **ALUR PPDB** (baris ~2025) — langkah-langkah pendaftaran peserta didik baru
25. **TESTIMONI** (baris ~2085) — ulasan orang tua siswa (carousel/grid kartu)
26. **EVENT & AGENDA** (baris ~2147) — kalender kegiatan mendatang (grid 3 kolom)
27. **FAQ** (baris ~2188) — pertanyaan sering ditanyakan (akordeon buka-tutup)
28. **PSB BANNER** (baris ~2257) — anchor PPDB (kept for URL anchor `#ppdb`)
29. **PPDB FORM SECTION** (baris ~2260) — formulir/info pendaftaran peserta didik baru
30. **KONTAK & MAPS** (baris ~2357) — form kontak + Google Maps tertanam
31. **SOCMED** (baris ~2436) — tautan Instagram, YouTube, Facebook, Website
32. **LEGALITAS** (baris ~2450) — akreditasi dan mitra resmi (Kemendikbud, BAN-S/M, NPSN, Kemenag, dll.)
33. **Footer** — navigasi, kontak, jenjang, tautan PPDB + copyright
34. **Tombol WhatsApp mengambang** — tombol chat WA melayang di pojok kanan bawah

## Pola Penamaan CSS

Kode CSS menggunakan **nama kelas yang sangat singkat** untuk mengurangi ukuran file. Ikuti pola ini saat menambah elemen baru.

| Awalan | Bagian | Contoh |
|--------|--------|--------|
| `.ti` | Ticker item | `.ti` |
| `.n*` | Navigasi | `.ni`, `.nb`, `.nl`, `.nm`, `.ncta` |
| `.s*` | Slide/Hero | `.sc`, `.stit`, `.sdesc`, `.sbtns` |
| `.w*` | Widget | `.wr`, `.wg`, `.wi` |
| `.k*` | Kenapa | `.kg`, `.kc` |
| `.j*` | Jenjang | `.jg`, `.jc` |
| `.f*` | Fasilitas | `.fg`, `.fc` |
| `.vm*` | Visi Misi | `.vmg`, `.vmc` |
| `.p*` | Prestasi | `.pg`, `.pc` |
| `.ts*` | Testimoni | `.tsg`, `.tsc`, `.tst` |
| `.b*` | Berita | `.bg2`, `.bc` |
| `.ev*` | Event | `.evg`, `.evc`, `.evd` |
| `.faq*` | FAQ | `.faqg`, `.faqc`, `.faqh`, `.faqb` |
| `.psb*` | PSB/PPDB | `.psb`, `.psbi` |
| `.m*` | Maps/Kontak | `.mgi`, `.minfo`, `.mitem` |
| `.soc*` | Sosial Media | `.soci`, `.socg` |
| `.leg*` | Legalitas | `.legg`, `.ll` |
| `.f*` | Footer | `.fg2`, `.fb`, `.fcol`, `.fbot` |
| `.waf` | WhatsApp Float | `.waf`, `.wab`, `.wat` |

## Fitur JavaScript

Semua JavaScript ada di akhir setiap file HTML (di dalam tag `<script>` sebelum `</body>`):

- **Hero slider** (`go()`, `mv()`) — rotasi otomatis setiap 5,5 detik + navigasi manual dot dan panah
- **Toggle FAQ** (`toggleFaq()`) — akordeon buka-tutup, hanya satu FAQ terbuka pada satu waktu
- **Scroll reveal** — `IntersectionObserver` pada elemen `.rv`, menambahkan class `.up` saat masuk viewport
- **Navigasi aktif** — highlight menu berdasarkan posisi scroll menggunakan `IntersectionObserver`
- **Mobile menu** (`toggleNav()`) — toggle hamburger menu pada layar kecil
- **Tampilan tanggal** — menampilkan hari dan tanggal saat ini dalam Bahasa Indonesia
- **Galeri filter** — filter foto galeri berdasarkan kategori (tombol filter + masonry grid)
- **Lightbox** — tampilan fullscreen foto galeri dan santunan
- **Tab jenjang** — toggle konten antar tab KB/TKIT/SDIT/SMPIT

## Konfigurasi Netlify

### `_headers`
Mendefinisikan header HTTP untuk semua route:
- **Semua halaman**: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`
- **Aset statis** (`/images/*`, `*.webp`, `*.jpg`, `*.png`, `*.css`, `*.js`): cache 1 tahun (`max-age=31536000, immutable`)
- **HTML dinamis** (`/index.html`, `/event.html`): no-cache (`max-age=0, must-revalidate`)

Edit file ini saat menambah sumber eksternal baru (CDN, font, API embed).

### `_redirects`
Menangani redirect 404 dari Google Search Console ke anchor yang benar:
```
/user/register    /#ppdb     301
/eksplore         /#galeri   301
/tentang-kami     /#tentang  301
/berita/*         /#berita   301
/program/smpit    /#jenjang  301
/event            /#event    301
```
URL bersih `/berita/` ditangani oleh `berita/.htaccess`.

### `robots.txt` & `sitemap.xml`
Digunakan untuk SEO. Perbarui `sitemap.xml` saat menambah halaman baru. Sitemap saat ini mendaftarkan halaman yang belum semuanya dibuat (lihat bagian Halaman di atas).

## Custom Claude Skills

Dua skill Claude Code tersimpan di `.claude/skills/` dan dapat dipanggil dengan slash command:

### `/desain-profesional`
```
/desain-profesional [jenis desain] [tujuan/konteks]
```
Menghasilkan brief desain lengkap dan actionable untuk kebutuhan visual sekolah (poster, banner, brosur, backdrop, sertifikat, twibbon, dll.) dengan panduan warna, tipografi, dan elemen dekoratif brand Al-Qomar.

### `/konten-sosmed`
```
/konten-sosmed [platform] [jenis konten] [topik]
```
Menghasilkan konten media sosial siap posting untuk Instagram dan TikTok — caption, carousel, script video, dan kalender konten — sesuai brand voice Al-Qomar.

## Aset Gambar

### Galeri (`images/galeri/`)
48 foto kegiatan sekolah dalam format WebP (`gal-001.webp` sampai `gal-048.webp`), dioptimasi untuk performa web. Hasil ekstraksi dari base64 inline agar HTML lebih ringan.

### Gambar Root
- `IMG_5490.jpg` — gambar diupload langsung ke root; sebaiknya dipindah ke `images/` di masa depan.

### Catatan Performa
- Jangan embed gambar sebagai base64 di dalam HTML — gunakan file eksternal di `images/`.
- Format WebP diutamakan untuk ukuran file yang lebih kecil.
- Gambar hero di-preload (`<link rel="preload">`) di `<head>` untuk optimasi LCP.
- File `_backup/` berisi snapshot lama berukuran ~22 MB karena masih menyertakan base64 inline — **jangan dijadikan referensi ukuran yang normal**.

## Dokumen Perencanaan

### `docs/superpowers/plans/2026-04-18-cms-website-upgrade.md`
Rencana integrasi CMS berbasis Supabase untuk website. Mencakup:
- Sinkronisasi data Kegiatan/Event dari Supabase ke halaman
- Panel CMS baru: Testimoni, FAQ, rich text editor Berita
- Export Excel data SPMB
- Menggunakan `window._sb` (Supabase JS v2) yang sudah ada di `index-live.html`

Rencana ini **belum sepenuhnya diimplementasi** di `index.html` saat ini.

## Alur Pengembangan

### Melakukan Perubahan
1. Edit file HTML yang relevan secara langsung
2. Buka file di browser lokal untuk pratinjau
3. Commit dan push ke branch `main` untuk deploy otomatis ke Netlify

### Tidak Ada Build Step
Tidak ada proses build, transpilasi, atau bundling. Perubahan langsung di-deploy apa adanya.

### Tidak Ada Testing Otomatis
Tidak ada framework atau file testing. Verifikasi perubahan dilakukan melalui inspeksi visual di browser di berbagai ukuran layar.

### Backup Manual
Sebelum melakukan perubahan besar pada `index.html`, simpan salinan backup di `_backup/` dengan format `index.html.YYYY-MM-DD`. Perhatikan bahwa backup lama berukuran sangat besar (~22 MB) karena mengandung base64 — backup baru seharusnya jauh lebih kecil.

## Deployment

Push ke branch `main` → Netlify otomatis build dan deploy ke `alqomar.sch.id`.

## Konvensi Penting

- **Satu file HTML per halaman** — setiap halaman adalah file HTML mandiri dengan CSS dan JS inline-nya sendiri
- **CSS custom properties** — selalu gunakan variabel `--h`, `--e`, dll. untuk konsistensi warna; jangan hardcode hex
- **Nama kelas singkat** — ikuti pola penamaan 2–4 karakter yang sudah ada
- **CSS per-section** — letakkan tag `<style>` tepat sebelum HTML bagian terkait, bukan di `<head>`
- **Bahasa Indonesia** — semua konten yang tampil ke pengguna harus dalam Bahasa Indonesia
- **Desain responsif** — semua section harus berfungsi di mobile (480px), tablet (768px), dan desktop
- **Tanpa library JS eksternal** — gunakan vanilla JavaScript saja; jangan tambahkan jQuery atau library lain
- **Gaya inline** — CSS di `<style>`, JS di `<script>` di akhir `<body>`
- **Animasi scroll reveal** — tambahkan class `rv` pada elemen baru yang ingin dianimasikan saat masuk viewport
- **Konsistensi antar halaman** — pastikan warna, font, navbar, dan footer konsisten di semua file HTML
- **Jangan embed base64** — simpan gambar sebagai file di `images/`, bukan sebagai data URI di HTML
- **Jangan commit file besar ke root** — gambar besar sebaiknya ditempatkan di `images/`, bukan di root
- **Komentar section** — gunakan `<!-- NAMA SECTION -->` sebagai penanda navigasi di `index.html`

## Breakpoint Responsif

- `max-width: 768px` — layout tablet (grid 2 kolom, penyesuaian padding)
- `max-width: 480px` — layout mobile (grid 1 kolom, font lebih kecil, hamburger menu)

## Layanan & Tautan Eksternal

- **WhatsApp**: `wa.me/6221559683440` — chat langsung untuk pendaftaran
- **Google Maps**: embed lokasi sekolah (koordinat: -6.125217, 106.723293)
- **YouTube**: channel `UCA3iOPu9iYC7ZOD4PyW9VPw` + video embed
- **Instagram**: @alqomar.school
- **Facebook**: alqomarschool
- **PPDB Online**: alqomar.sch.id/spmb-online
- **Google Fonts**: Plus Jakarta Sans, Amiri, Playfair Display
