# CLAUDE.md

## Ringkasan Proyek

**Website Sekolah Al-Qomar Muthmainnah** — website multi-halaman untuk lembaga pendidikan Islam di bawah naungan Yayasan Pendidikan Islam Purnama Cendekia (YPIPC), berlokasi di Jakarta Barat, Indonesia. Sekolah ini beroperasi di empat jenjang pendidikan: KB (Kelompok Bermain), TKIT (Taman Kanak-Kanak Islam Terpadu), SDIT (Sekolah Dasar Islam Terpadu), dan SMPIT (Sekolah Menengah Pertama Islam Terpadu).

- **Domain**: alqomar.sch.id (dikonfigurasi melalui file `CNAME`)
- **Hosting**: Netlify
- **Backend CMS**: Supabase (konten dinamis — berita, kegiatan, pengumuman, ekskul)
- **Bahasa konten**: Bahasa Indonesia
- **Alamat**: Jl. Kamal Raya No.1 Tegal Alur, Kalideres, Jakarta Barat
- **Telepon**: (021) 55968344
- **Email**: info@purnamacendekia.sch.id

## Struktur Repositori

```
alqomar-muthmainnah/
├── index.html              # Halaman utama (2.686 baris, 522 KB, 22 section)
├── berita.html             # Halaman daftar berita/artikel (329 baris)
├── berita-detail.html      # Template halaman detail artikel (652 baris)
├── event.html              # Halaman daftar event/kegiatan (577 baris)
├── ppdb.html               # Halaman PPDB — Pendaftaran Peserta Didik Baru (767 baris)
├── login-divisi.html       # Portal login divisi internal Dar Tanur (218 baris)
├── itinerary-umroh-tanur-muthmainnah.html
│                           # ⚠️ File tidak terkait — itinerary umrah Dar Tanur (524 baris)
├── itinerary-umroh-tanur-muthmainnah.docx
│                           # ⚠️ File tidak terkait — versi Word dari itinerary di atas
├── index-live.html         # Snapshot live sebelumnya (~193 KB, 3.333 baris)
├── index-live-latest.html  # Snapshot live terbaru (22 MB, berisi data inline — jangan edit)
├── berita/                 # Subdirektori berita — mendukung URL bersih /berita/slug
│   ├── index.html          # Identik dengan berita-detail.html, parsing slug dari path URL
│   └── .htaccess           # Konfigurasi URL rewrite Apache untuk /berita/slug
├── _backup/                # Backup bertanggal
│   ├── index.html.2026-04-14   (22 MB snapshot)
│   └── index.html.2026-04-15   (22 MB snapshot)
├── docs/
│   └── superpowers/plans/
│       └── 2026-04-18-cms-website-upgrade.md   # Rencana pengembangan CMS
├── images/
│   └── galeri/             # 48 file WebP galeri sekolah (gal-001.webp … gal-048.webp, ~3,8 MB)
├── IMG_5490.jpg            # ⚠️ Gambar besar (2,7 MB) di root — sebaiknya dipindah ke images/
├── _headers                # Header HTTP Netlify (CSP, caching, keamanan)
├── _redirects              # Aturan redirect/rewrite Netlify (7 aturan)
├── CNAME                   # Domain kustom: alqomar.sch.id
├── robots.txt              # Instruksi crawler mesin pencari
├── sitemap.xml             # Sitemap XML untuk SEO (8 URL, termasuk 4 halaman belum ada)
└── caption-ppdb-ig.txt     # Teks caption Instagram untuk kampanye PPDB
```

## Teknologi yang Digunakan

- **HTML5** — markup semantik dengan desain responsif
- **CSS3** — gaya tertanam menggunakan CSS custom properties, flexbox, dan grid
- **Vanilla JavaScript** — tanpa framework atau library eksternal
- **Supabase** — backend CMS untuk konten dinamis (berita, kegiatan, pengumuman, ekskul)
  - CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
  - Client diinisialisasi sebagai `window._sb`
- **Google Fonts** — Plus Jakarta Sans, Amiri, Playfair Display
- **Embed eksternal** — Google Maps, video YouTube

**Tidak ada build system atau package manager.** Semua CSS dan JavaScript ditulis secara inline di setiap file HTML.

## Halaman-Halaman Website

| File | URL | Deskripsi | Supabase |
|------|-----|-----------|----------|
| `index.html` | `/` | Halaman utama (22 section) | `berita`, `pengumuman`, `ekskul` |
| `berita.html` | `/berita.html` | Daftar artikel dengan filter & search | `berita` |
| `berita-detail.html` | `/berita-detail.html?slug=x` | Detail artikel (URL klasik) | `berita` |
| `berita/index.html` | `/berita/nama-slug` | Detail artikel (URL bersih) | `berita` |
| `event.html` | `/event.html` | Kalender & agenda kegiatan | `kegiatan` |
| `ppdb.html` | `/ppdb.html` | Informasi dan pendaftaran PPDB | — |
| `login-divisi.html` | `/login-divisi.html` | Portal divisi internal | — (hardcoded) |

### Halaman Direferensikan di Sitemap tapi Belum Ada

File-file berikut ada di `sitemap.xml` tapi belum ada di repositori:
- `spmb-online.html` — formulir pendaftaran online
- `guru.html` — halaman profil guru
- `tahfidz.html` — program hafalan Al-Quran
- `rqaq.html` — tujuan tidak diketahui

## Integrasi Supabase CMS

### Tabel-Tabel yang Digunakan

| Tabel | Kolom Utama | Digunakan Di |
|-------|-------------|--------------|
| `berita` | `judul`, `slug`, `foto_url`, `tanggal`, `ringkasan`, `konten`, `kategori`, `aktif` | index.html, berita.html, berita-detail.html, berita/index.html |
| `pengumuman` | *(tidak terdokumentasi)* | index.html (ticker/announce bar) |
| `ekskul` | *(tidak terdokumentasi)* | index.html |
| `kegiatan` | `id`, `judul`, `tanggal`, `tag`, `deskripsi`, `aktif` | event.html |

### Pola Query Umum

```js
// Mengambil daftar berita (berita.html)
const { data } = await window._sb
  .from('berita')
  .select('*')
  .eq('aktif', true)
  .order('tanggal', { ascending: false });

// Mengambil artikel tunggal berdasarkan slug (berita-detail.html)
const { data } = await window._sb
  .from('berita')
  .select('*')
  .eq('slug', slug)
  .single();
```

### Fallback Data

`event.html` menyertakan data hardcoded sebagai fallback jika query Supabase gagal.

### Rendering Konten Artikel

Field `konten` di tabel `berita` mendukung HTML atau teks biasa. Teks biasa dibungkus otomatis dalam tag `<p>` saat ditampilkan.

## Variabel CSS (Sistem Desain)

### Palet Utama (index.html, event.html)

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

### Palet Alternatif (berita.html, ppdb.html)

| Variabel | Nilai |
|----------|-------|
| `--h` | `#1B6B3A` |
| `--h2` | `#1F7F46` |
| `--h3` | `#2A9E5C` |
| `--e` | `#C9A84C` |
| `--e2` | `#D4AF37` |

### Palet Khusus (berita-detail.html, berita/index.html)

Menggunakan nama variabel semantik yang berbeda: `--hijau-tua`, `--hijau`, `--hijau-muda`, `--hijau-terang`, `--krem`, `--teks`, `--abu`, `--border`.

Selalu gunakan variabel CSS yang ada saat menambah elemen baru — jangan hardcode nilai warna.

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
12. **Berita** — artikel/berita terkini dimuat dari Supabase (grid 3 kolom)
13. **Video** — pemutar YouTube utama + sidebar
14. **Galeri** — galeri foto kegiatan sekolah (lightbox)
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

## Fitur JavaScript per Halaman

### index.html

- `go(n)`, `mv(d)`, `startHTimer()` — hero slider (rotasi otomatis 5,5 detik + navigasi manual)
- `toggleFaq(el)` — akordeon FAQ, hanya satu item terbuka sekaligus
- `toggleNav()` — hamburger menu mobile
- `toggleSearch()`, `doSearch(q)` — toggle dan eksekusi pencarian
- `submitContact(e)`, `submitPPDB(e)` — pengiriman formulir kontak dan PPDB
- `switchTab(id, btn)` — tab switcher
- `getImgs()`, `setSrc(i)` — lightbox galeri foto
- `updateVisible()` — logika visibilitas berbasis scroll
- `IntersectionObserver` pada `.rv` — animasi scroll reveal (menambahkan class `.up`)
- `IntersectionObserver` pada section — highlight menu aktif berdasarkan posisi scroll

### berita.html

- `loadBerita()` — load berita dari Supabase
- `renderGrid()` — render kartu berita hasil filter
- `applyFilter()`, `setFilter(f, el)` — filter berdasarkan kategori
- `doSearch(v)` — filter berdasarkan teks pencarian
- `loadMore()` — pagination / infinite scroll
- `cardHTML(b, i)`, `escHtml(s)`, `formatTgl(t)` — utilitas render

### berita-detail.html & berita/index.html

- `getSlug()` — ekstrak slug dari URL (query param vs. path bersih)
- `loadBerita()` — load artikel tunggal + artikel terkait dari Supabase
- `renderBerita(berita)` — isi konten artikel ke halaman
- `renderBeritaLain(list)` — render grid 3 artikel terkait
- `copyLink(btn)` — salin URL ke clipboard dengan feedback visual
- `formatTanggal(tgl)` — format tanggal dalam Bahasa Indonesia

### event.html

- `loadEvents()` — load kegiatan dari Supabase (dengan fallback hardcoded)
- `renderEvents()` — render event dikelompokkan per bulan
- `filterEvents(cat, btn)` — filter berdasarkan kategori/tag
- `getStatus(dateStr)` — tentukan status event (past/today/soon/coming)
- `getStatusLabel(s)` — render badge status HTML
- `fromSupabase(r)`, `formatMon(tgl)` — utilitas transformasi data

### ppdb.html

- `toggleFaq(el)` — akordeon FAQ per jenjang pendidikan

### login-divisi.html

- `show(id)` — ganti tampilan (select divisi → input PIN → sukses)
- `selectDiv(d)`, `backToSelect()` — navigasi antar step
- `checkPin()` — validasi PIN (hardcoded client-side — bukan untuk autentikasi produksi)
- `togglePin()` — toggle visibilitas PIN
- `logout()` — reset dan kembali ke pemilihan divisi

## Strategi URL Berita

| URL | File | Mekanisme |
|-----|------|-----------|
| `/berita.html` | `berita.html` | Listing langsung |
| `/berita-detail.html?slug=x` | `berita-detail.html` | Query parameter |
| `/berita/nama-slug` | `berita/index.html` | `.htaccess` rewrite ke `index.html`, parsing path |

`berita/index.html` identik dengan `berita-detail.html` kecuali fungsi `getSlug()` yang mem-parsing format `/berita/nama-slug`.

## Konfigurasi Netlify

### `_headers`
Header HTTP untuk semua halaman:
- `X-Frame-Options: SAMEORIGIN` — mencegah clickjacking
- `X-Content-Type-Options: nosniff` — mencegah MIME sniffing
- Cache-Control: gambar dan aset statis di-cache 1 tahun immutable; `index.html` dan `event.html` no-cache

Edit file ini untuk mengizinkan sumber eksternal baru (font, embed, API).

### `_redirects`
7 aturan redirect permanen (301) dari path lama ke anchor section di homepage:
- `/user/register` → `/#ppdb`
- `/eksplore` → `/#galeri`
- `/tentang-kami` → `/#tentang`
- `/berita/*` → `/#berita`
- `/program/smpit` → `/#jenjang`
- `/event` → `/#event`

### `robots.txt` & `sitemap.xml`
Digunakan untuk SEO. Perbarui `sitemap.xml` saat menambah halaman baru. Sitemap saat ini mereferensikan 4 halaman yang belum ada (`spmb-online.html`, `guru.html`, `tahfidz.html`, `rqaq.html`).

## Alur Pengembangan

### Melakukan Perubahan
1. Edit file HTML yang relevan secara langsung
2. Buka file di browser lokal untuk pratinjau
3. Commit dan push ke branch `main` untuk deploy otomatis ke Netlify

### Tidak Ada Build Step
Tidak ada proses build, transpilasi, atau bundling. Perubahan langsung di-deploy apa adanya.

### Tidak Ada Testing Otomatis
Tidak ada framework atau file testing. Verifikasi dilakukan melalui inspeksi visual di browser di berbagai ukuran layar.

### Backup Manual
Sebelum melakukan perubahan besar pada `index.html`, simpan salinan di `_backup/` dengan format `index.html.YYYY-MM-DD`.

## Deployment

Push ke branch `main` → Netlify otomatis build dan deploy ke `alqomar.sch.id`.

## Konvensi Penting

- **Satu file HTML per halaman** — setiap halaman adalah file HTML mandiri dengan CSS dan JS inline-nya sendiri
- **CSS custom properties** — gunakan variabel `--h`, `--e`, dll. untuk konsistensi warna; jangan hardcode hex
- **Nama kelas singkat** — ikuti pola penamaan 2–4 karakter yang sudah ada
- **CSS per-section** — letakkan tag `<style>` tepat sebelum HTML bagian terkait, bukan di `<head>`
- **Bahasa Indonesia** — semua konten yang tampil ke pengguna harus dalam Bahasa Indonesia
- **Desain responsif** — semua section harus berfungsi di mobile (480px), tablet (768px), dan desktop
- **Tanpa library JS eksternal** — gunakan vanilla JavaScript saja; pengecualian: Supabase JS (sudah ada)
- **Gaya inline** — CSS di `<style>`, JS di `<script>` di akhir `<body>`
- **Animasi scroll reveal** — tambahkan class `rv` pada elemen baru yang ingin dianimasikan saat masuk viewport
- **Konsistensi antar halaman** — pastikan warna, font, navbar, dan footer konsisten di semua file HTML
- **Jangan commit file besar ke root** — gambar besar sebaiknya ditempatkan di `images/`, bukan di root
- **Sanitasi output HTML** — gunakan `escHtml()` saat merender data dari Supabase ke DOM

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
- **Supabase CDN**: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`

## Catatan untuk Pengembangan

### File Tidak Terkait
`itinerary-umroh-tanur-muthmainnah.html` dan `.docx` adalah dokumen untuk Dar Tanur (perusahaan umrah) yang tidak terkait dengan website sekolah. File ini sebaiknya tidak dimodifikasi dan dapat dihapus di masa mendatang.

### Keamanan login-divisi.html
Validasi PIN di `login-divisi.html` dilakukan sepenuhnya di sisi klien dengan data hardcoded dalam array JavaScript. Ini bukan autentikasi yang aman — hanya untuk keperluan internal dengan keamanan rendah.

### Aset Besar
File `index-live-latest.html` dan file di `_backup/` berukuran 22 MB masing-masing karena menyertakan data gambar inline. Jangan edit file-file ini.
