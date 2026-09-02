# CLAUDE.md

## Ringkasan Proyek

**Website Sekolah Al-Qomar Muthmainnah** — website statis multi-halaman untuk lembaga pendidikan Islam di bawah naungan Yayasan Pendidikan Islam Purnama Cendekia (YPIPC), berlokasi di Jakarta Barat, Indonesia. Sekolah ini beroperasi di empat jenjang pendidikan: KB (Kelompok Bermain), TKIT (Taman Kanak-Kanak Islam Terpadu), SDIT (Sekolah Dasar Islam Terpadu), dan SMPIT (Sekolah Menengah Pertama Islam Terpadu).

- **Domain**: alqomar.sch.id (dikonfigurasi melalui file `CNAME`)
- **Hosting**: Hostinger (LiteSpeed/Apache) — konfigurasi via `.htaccess`
- **Bahasa konten**: Bahasa Indonesia
- **Alamat**: Jl. Kamal Raya No.1 Tegal Alur, Kalideres, Jakarta Barat
- **Telepon**: (021) 55968344
- **Email**: info@purnamacendekia.sch.id

## Struktur Repositori

```
alqomar-muthmainnah/
├── index.html              # Halaman utama (~533 KB, 22 section)
├── berita.html             # Halaman daftar berita/artikel
├── berita-detail.html      # Template halaman detail artikel
├── event.html              # Halaman daftar event/kegiatan
├── ppdb.html               # Halaman PPDB (Pendaftaran Peserta Didik Baru)
├── login-divisi.html       # Halaman login untuk divisi internal
├── berita/                 # Subdirektori berita — URL bersih /berita/
│   ├── index.html          # Daftar berita (dapat diakses di /berita/)
│   └── .htaccess           # Konfigurasi URL rewrite Apache
├── _backup/                # Arsip: backup bertanggal + snapshot index-live lama
│   ├── index.html.2026-04-14
│   └── index.html.2026-04-15
├── docs/                   # Dokumen pendukung
├── images/                 # Aset gambar
├── IMG_5490.jpg            # Gambar aset (diupload langsung ke root)
├── .htaccess               # Konfigurasi aktif: rewrite, cache, kompresi, redirect
├── _headers                # (tidak aktif) warisan Netlify
├── _redirects              # (tidak aktif) warisan Netlify
├── CNAME                   # Domain kustom: alqomar.sch.id
├── robots.txt              # Instruksi crawler mesin pencari
├── sitemap.xml             # Sitemap XML untuk SEO
└── caption-ppdb-ig.txt     # Teks caption Instagram untuk kampanye PPDB
```

## Memori Proyek (Obsidian Memory)

Folder `memory/` adalah **vault Obsidian** yang berfungsi sebagai memori jangka panjang Claude. Tujuannya menyimpan konteks penting (keputusan, konvensi, fakta, hal yang sudah dicoba) agar **bertahan antar sesi**.

- **Otomatis dimuat**: SessionStart hook `.claude/hooks/load-memory.sh` (terdaftar di `.claude/settings.json`) menyuntikkan `memory/index.md` ke konteks tiap sesi.
- **Dikelola lewat skill**: jalankan `/obsidian-memory` untuk menyimpan, mencari, atau memperbarui catatan.
- **Struktur**: `index.md` (MOC) · `konteks-proyek.md` · `konvensi-kode.md` · `catatan/` · `keputusan/` · `templates/`
- Bisa dibuka langsung di aplikasi Obsidian (Open folder as vault → `memory/`).

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
| `index.html` | `/` | Halaman utama lengkap (22 section) |
| `berita.html` | `/berita.html` | Daftar artikel/berita sekolah |
| `berita/index.html` | `/berita/` | Mirror berita dengan URL bersih |
| `berita-detail.html` | `/berita-detail.html` | Template halaman detail artikel |
| `event.html` | `/event.html` | Daftar event dan agenda sekolah |
| `ppdb.html` | `/ppdb.html` | Informasi dan pendaftaran PPDB |
| `login-divisi.html` | `/login-divisi.html` | Login internal divisi sekolah |

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

1. **Ticker** — marquee pengumuman berjalan (PPDB, kontak, program) + tautan media sosial
2. **Navigasi** — navbar sticky dengan menu dropdown + hamburger menu untuk mobile
3. **Hero slider** — carousel 4 slide dengan rotasi otomatis (5,5 detik) + tombol panah + dot navigasi
4. **Announce bar** — banner pengumuman di bawah hero (latar kuning `--ep`)
5. **Widget row** — kartu statistik/informasi (latar hijau `--h`)
6. **Kenapa** — "Kenapa memilih kami" (grid 3 kolom)
7. **Jenjang** — tampilan jenjang pendidikan KB/TKIT/SDIT/SMPIT (4 kolom)
8. **Fasilitas** — fasilitas sekolah (grid 4 kolom)
9. **Visi & Misi** — kartu visi dan misi sekolah
10. **Prestasi** — pencapaian/statistik angka (4 kolom)
11. **Testimoni** — ulasan orang tua siswa (carousel/grid kartu testimoni)
12. **Berita** — artikel/berita terkini (grid 3 kolom)
13. **Video** — pemutar YouTube utama + sidebar
14. **Galeri** — galeri foto kegiatan sekolah
15. **Event & Agenda** — kalender kegiatan mendatang (grid 3 kolom dengan tampilan tanggal)
16. **FAQ** — pertanyaan yang sering ditanyakan (akordeon buka-tutup)
17. **PPDB Banner** — banner pendaftaran peserta didik baru dengan tautan ke formulir online
18. **Kontak & Maps** — informasi kontak + Google Maps tertanam
19. **Media Sosial** — tautan Instagram, YouTube, Facebook, Website
20. **Legalitas** — tampilan akreditasi dan mitra resmi (Kemendikbud, BAN-S/M, NPSN, Kemenag, dll.)
21. **Footer** — navigasi, kontak, jenjang, tautan PPDB + copyright
22. **Tombol WhatsApp mengambang** — tombol chat WA melayang di pojok kanan bawah

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

## Konfigurasi Server

Situs berjalan di **Hostinger (LiteSpeed/Apache)**, jadi satu-satunya konfigurasi
yang benar-benar aktif adalah `.htaccess`.

### `.htaccess` (root) — AKTIF
Mengatur seluruh perilaku server: URL bersih tanpa `.html` (`/guru`, `/sdit`,
`/ppdb`, dst.), kompresi Gzip/Brotli, cache lifetime, header keamanan, dan
redirect 301 folder arsip `_backup/`. **Semua aturan redirect/header baru harus
ditulis di sini.**

### `berita/.htaccess` — AKTIF
Rewrite agar `/berita/<slug>` dirender oleh `berita/index.html`.

### `_headers` & `_redirects` — TIDAK AKTIF
Format khusus Netlify, warisan hosting lama. Diabaikan sepenuhnya oleh
Hostinger. Jangan andalkan file ini; kalau butuh redirect atau header, edit
`.htaccess`.

### `robots.txt` & `sitemap.xml`
Digunakan untuk SEO. Perbarui `sitemap.xml` saat menambah halaman baru.

## Alur Pengembangan

### Melakukan Perubahan
1. Edit file HTML yang relevan secara langsung
2. Buka file di browser lokal untuk pratinjau
3. Commit dan push ke branch `main` (GitHub = penyimpanan kode, **bukan** pemicu deploy)
4. Deploy manual ke Hostinger — lihat bagian Deployment

### Tidak Ada Build Step
Tidak ada proses build, transpilasi, atau bundling. File di-upload apa adanya.

### Tidak Ada Testing Otomatis
Tidak ada framework atau file testing. Verifikasi perubahan dilakukan melalui inspeksi visual di browser di berbagai ukuran layar.

### Backup Manual
Sebelum melakukan perubahan besar pada `index.html`, simpan salinan backup di `_backup/` dengan format `index.html.YYYY-MM-DD`.

**Semua file backup/snapshot wajib berada di `_backup/`, jangan di root.** File HTML di root ikut ter-deploy dan bisa terindeks Google sebagai konten duplikat. Folder `_backup/` sudah diblokir lewat `robots.txt` dan diarahkan 301 ke beranda di `.htaccess`. Folder `_backup/` tidak perlu ikut di-upload ke Hostinger.

## Deployment

**Push ke GitHub tidak men-deploy apa pun.** Hostinger tidak terhubung otomatis
ke repositori ini, jadi setiap perubahan harus di-upload manual ke server.

Langkah di hPanel Hostinger → **File Manager** → `public_html`:
1. Upload file HTML yang berubah (timpa file lama)
2. Upload `.htaccess` bila aturan server ikut berubah
3. Hard refresh browser (Ctrl+Shift+R) — `.htaccess` men-cache HTML 10 menit,
   jadi perubahan bisa tertunda sebentar

Alternatif: hubungkan Hostinger ke repositori lewat hPanel → **Git**, lalu klik
*Deploy* setiap selesai push (atau pasang auto-deploy webhook) agar langkah
upload manual tidak perlu diulang tiap kali.

Yang **tidak** perlu di-upload: `_backup/`, `_headers`, `_redirects`, `memory/`,
`docs/`, `CLAUDE.md`.

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
- **Jangan commit file besar ke root** — gambar besar sebaiknya ditempatkan di `images/`, bukan di root

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
