# CLAUDE.md

## Ringkasan Proyek

**Website Sekolah Al-Qomar Muthmainnah** — website statis satu halaman untuk lembaga pendidikan Islam di bawah naungan Yayasan Pendidikan Islam Purnama Cendekia (YPIPC), berlokasi di Jakarta Barat, Indonesia. Sekolah ini beroperasi di empat jenjang pendidikan: KB (Kelompok Bermain), TKIT (Taman Kanak-Kanak Islam Terpadu), SDIT (Sekolah Dasar Islam Terpadu), dan SMPIT (Sekolah Menengah Pertama Islam Terpadu).

- **Domain**: alqomar.sch.id (dikonfigurasi melalui file `CNAME`)
- **Hosting**: Netlify / GitHub Pages
- **Bahasa konten**: Bahasa Indonesia

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
| `--h`, `--h2`, `--h3` | `#1a5c38`, `#1e6e42`, `#2a8a54` | Warna hijau utama |
| `--e`, `--e2` | `#c8922a`, `#e0a832` | Warna emas aksen |
| `--kr` | `#faf7f2` | Latar belakang krem |

## Bagian-Bagian Halaman (berurutan)

1. **Top bar** — ticker pengumuman + tautan media sosial
2. **Navigasi** — navbar sticky dengan menu dropdown + hamburger menu untuk mobile
3. **Hero slider** — carousel 4 slide dengan rotasi otomatis (5,5 detik)
4. **Widget row** — kartu statistik/informasi
5. **Kenapa** — "Kenapa memilih kami" (grid 3 kolom)
6. **Jenjang** — tampilan jenjang pendidikan (4 kolom)
7. **Fasilitas** — fasilitas sekolah (grid 4 kolom)
8. **Visi & Misi** — kartu visi dan misi
9. **Prestasi** — pencapaian/statistik (4 kolom)
10. **Berita** — artikel/berita (grid 3 kolom)
11. **Video** — pemutar utama + sidebar
12. **Galeri** — galeri foto
13. **PPDB** — banner pendaftaran peserta didik baru
14. **Kontak** — informasi kontak + Google Maps tertanam
15. **Legalitas** — tampilan akreditasi
16. **Footer** — navigasi, kontak, tautan sosial media
17. **Tombol WhatsApp mengambang**

## Fitur JavaScript

- Rotasi otomatis hero slider dan navigasi dot manual
- Toggle akordeon FAQ
- Animasi scroll-reveal saat masuk ke bagian tertentu
- Pelacakan status aktif navigasi saat scroll
- Toggle hamburger menu untuk tampilan mobile
- Tampilan tanggal secara real-time

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
- **Bahasa Indonesia** — semua konten yang ditampilkan kepada pengguna dalam Bahasa Indonesia
- **Desain responsif** — semua bagian harus berfungsi dengan baik di mobile, tablet, dan desktop
- **Tanpa dependensi JS eksternal** — gunakan vanilla JavaScript saja
- **Gaya dan skrip inline** — CSS di tag `<style>`, JS di tag `<script>` di akhir body

## Layanan Eksternal

- **WhatsApp**: Tautan chat langsung untuk pendaftaran/admisi
- **Google Maps**: Peta lokasi sekolah yang ditanamkan
- **YouTube**: Konten video yang ditanamkan
- **Media sosial**: Tautan ke Instagram, YouTube, Facebook
