# CLAUDE.md

## Ringkasan Proyek

**Website Sekolah Al-Qomar Muthmainnah** — website statis satu halaman untuk lembaga pendidikan Islam di bawah naungan Yayasan Pendidikan Islam Purnama Cendekia (YPIPC), berlokasi di Jakarta Barat, Indonesia. Sekolah ini beroperasi di empat jenjang pendidikan: KB (Kelompok Bermain), TKIT (Taman Kanak-Kanak Islam Terpadu), SDIT (Sekolah Dasar Islam Terpadu), dan SMPIT (Sekolah Menengah Pertama Islam Terpadu).

- **Domain**: alqomar.sch.id (dikonfigurasi melalui file `CNAME`)
- **Hosting**: Netlify / GitHub Pages
- **Bahasa konten**: Bahasa Indonesia
- **Alamat**: Jl. Kamal Raya No.1 Tegal Alur, Kalideres, Jakarta Barat
- **Telepon**: (021) 55968344
- **Email**: info@purnamacendekia.sch.id

## Struktur Repositori

```
alqomar-muthmainnah/
├── index.html    # Website satu halaman lengkap (HTML + CSS + JS, ~2100 baris)
└── CNAME         # Pemetaan domain kustom (alqomar.sch.id)
```

Ini adalah **situs statis satu file** tanpa build system, package manager, atau framework. Semua CSS dan JavaScript ditulis secara inline di dalam `index.html`.

## Teknologi yang Digunakan

- **HTML5** — markup semantik dengan desain responsif
- **CSS3** — gaya tertanam menggunakan CSS custom properties, flexbox, dan grid
- **Vanilla JavaScript** — tanpa framework atau library eksternal
- **Google Fonts** — Plus Jakarta Sans, Amiri, Playfair Display
- **Embed eksternal** — Google Maps, video YouTube

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

## Bagian-Bagian Halaman (berurutan)

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

Kode CSS menggunakan **nama kelas yang sangat singkat** untuk mengurangi ukuran file. Berikut pola utamanya:

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

Semua JavaScript ada di akhir `index.html` (baris 1901 dan 2059):

- **Hero slider** (`go()`, `mv()`) — rotasi otomatis setiap 5,5 detik + navigasi manual dot dan panah
- **Toggle FAQ** (`toggleFaq()`) — akordeon buka-tutup, hanya satu FAQ terbuka pada satu waktu
- **Scroll reveal** — menggunakan `IntersectionObserver` pada elemen `.rv`, menambahkan class `.up`
- **Navigasi aktif** — highlight menu berdasarkan posisi scroll
- **Mobile menu** (`toggleNav()`) — toggle hamburger menu pada layar kecil
- **Tampilan tanggal** — menampilkan hari dan tanggal saat ini dalam Bahasa Indonesia

## Alur Pengembangan

### Melakukan Perubahan

1. Edit `index.html` secara langsung — semua markup, gaya, dan skrip ada di satu file ini
2. Buka `index.html` di browser untuk pratinjau perubahan secara lokal
3. Commit dan push untuk deploy

### Tidak Perlu Build

Tidak ada proses build, transpilasi, atau bundling. Perubahan pada `index.html` langsung di-deploy apa adanya.

### Tidak Ada Testing

Tidak ada framework atau file testing. Verifikasi perubahan dilakukan melalui inspeksi visual di browser.

## Deployment

Website di-deploy secara otomatis melalui Netlify saat push ke branch `main`. File `CNAME` memetakan domain kustom `alqomar.sch.id`.

## Konvensi

- **Arsitektur satu file** — simpan semua kode di `index.html` kecuali ada alasan kuat untuk memisahkan
- **CSS custom properties** — gunakan variabel desain yang sudah ada untuk konsistensi warna
- **Nama kelas singkat** — ikuti pola penamaan yang sudah ada (2-4 karakter)
- **CSS per-section** — beberapa bagian memiliki tag `<style>` sendiri tepat sebelum HTML-nya
- **Bahasa Indonesia** — semua konten yang ditampilkan kepada pengguna dalam Bahasa Indonesia
- **Desain responsif** — semua bagian harus berfungsi di mobile, tablet, dan desktop; gunakan `@media` queries
- **Tanpa dependensi JS eksternal** — gunakan vanilla JavaScript saja
- **Gaya dan skrip inline** — CSS di tag `<style>`, JS di tag `<script>` di akhir body
- **Animasi scroll reveal** — tambahkan class `rv` pada elemen yang ingin dianimasikan saat masuk viewport

## Breakpoint Responsif

- `max-width: 768px` — layout tablet (grid 2 kolom, penyesuaian padding)
- `max-width: 480px` — layout mobile (grid 1 kolom, font lebih kecil)
- Hamburger menu muncul di `max-width: 768px`

## Layanan & Tautan Eksternal

- **WhatsApp**: wa.me/6221559683440 — chat langsung untuk pendaftaran/admisi
- **Google Maps**: embed lokasi sekolah (koordinat: -6.125217, 106.723293)
- **YouTube**: channel UCA3iOPu9iYC7ZOD4PyW9VPw + video embed
- **Instagram**: @alqomar.school
- **Facebook**: alqomarschool
- **PPDB Online**: alqomar.sch.id/spmb-online
- **Google Fonts**: Plus Jakarta Sans, Amiri, Playfair Display
