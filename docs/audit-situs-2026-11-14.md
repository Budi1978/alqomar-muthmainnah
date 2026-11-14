# Audit alqomar.sch.id — 14 November 2026

Cakupan: 30 halaman ter-crawl (21 statis + 9 berita), header server, robots/sitemap, 75 aset, uji render Chromium mobile (Pixel 7) dan desktop, advisor keamanan dan performa Supabase (project `gzcgyqntluhxxrvbcwin`).

Batasan uji: dari sandbox, host Supabase, jsDelivr, Google Tag Manager, dan Google Maps tidak terjangkau. Bagian dinamis (daftar berita live, kirim formulir, GA4) tidak teruji end-to-end. TTFB diukur dari server AS, bukan Jakarta. Formulir PPDB tidak dikirim.

## Verdict

Fondasi teknis kuat. Masalah utama ada di isi: jadwal yang bertabrakan, klaim regulasi yang perlu diverifikasi, dan bukti sosial yang tidak tampil.

## Yang sudah benar (jangan diubah)

- HTTPS + HSTS, CSP ketat, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Redirect non-www → www, `.html` → URL bersih, trailing slash → kanonik.
- Title dan meta description unik di semua 30 halaman; canonical benar; satu H1 per halaman.
- JSON-LD: School, Preschool, ElementarySchool, MiddleSchool, FAQPage, Event, Course, BreadcrumbList.
- Semua 75 aset 200, cache 1 tahun immutable, gambar WebP, total ±2,7 MB.
- Mobile: tidak ada overflow horizontal, CLS 0–0,008, LCP 0,5–2,9 dtk, tab bar bawah + tombol WA mengambang.
- 404 mengembalikan status 404 + noindex. `.env` dan `.git` 403.
- Supabase: RLS aktif di 24/24 tabel; `daftar_spmb` punya pembatas laju; tidak ada temuan level ERROR.
- Formulir PPDB: honeypot, pemberitahuan privasi UU PDP, persetujuan berversi, fallback WhatsApp bila gagal simpan.

## Temuan dan perbaikan

### P1 — kerjakan pekan ini

1. **Jadwal Gelombang 2 bertabrakan di `/spmb-online`.** Tabel jadwal menulis "Tes & Wawancara: Pekan ke-2 Des 2026"; paragraf di bawahnya dan `/ppdb` menulis "9 Januari 2027". Perbaiki tabel menjadi 9 Januari 2027 (atau sebaliknya, sesuai keputusan panitia).
2. **Klaim "Sekolah Penggerak" (SMPIT) di 5 halaman** (`/`, `/smpit`, `/ppdb`, `/guru`, `/sekolah-islam-jakarta-barat`), ditulis sebagai status aktif "didampingi Kemendikbud/Kemendikbudristek". Program ini setahu saya sudah dihentikan Kemendikdasmen pada 2025 dan nama kementeriannya sudah berubah. Verifikasi ke Dinas; bila benar, ubah menjadi "Sekolah Penggerak Angkatan … (tahun …)" atau hapus. Risiko: klaim menyesatkan saat visitasi atau komplain orang tua.
3. **Nama lembaga akreditasi tidak konsisten.** `/tentang` menulis SK SMPIT dari "BSANP No. 024/BSANP/K/SK/2026"; `/`, `/ppdb`, `/smpit`, `/sekolah-islam-jakarta-barat` menulis "BAN-PDM". Samakan dengan yang tertulis di SK.
4. **"Projek Penguatan Profil Pelajar Pancasila" di `/smpit`.** Cek terhadap ketentuan kurikulum terbaru (Permendikdasmen 13/2025: 8 dimensi profil lulusan, kokurikuler). Sesuaikan istilah bila sekolah sudah beralih.
5. **Cloudflare Web Analytics diblokir CSP sendiri** di semua halaman (`static.cloudflareinsights.com` tidak ada di `script-src`). Pilih: tambahkan host itu ke `script-src` dan `cloudflareinsights.com` ke `connect-src`, atau matikan Web Analytics di dashboard Cloudflare. Sekarang ia hanya menghasilkan error konsol.

### P2 — konversi PPDB (2–4 pekan)

6. **Testimoni tidak tampil.** Tabel `testimoni` berisi 4 baris, tetapi beranda, `/ppdb`, dan `/spmb-online` tidak menampilkannya. Pasang 3 testimoni orang tua di beranda dan di atas formulir.
7. **Uang pangkal tidak dipublikasikan.** `/biaya` hanya memuat formulir Rp100.000 dan SPP. Orang tua harus chat dulu untuk angka terbesar. Cantumkan kisaran per jenjang ("mulai Rp…") + skema cicilan; saring leads yang tidak cocok sejak awal.
8. *(Dicabut 14 Nov 2026: SPP SDIT memang lebih tinggi daripada TK dan SMP — kebijakan sekolah.)*
9. *(Dicabut: `/smpit` sudah memuat dua jalur — masuk baru Juz 30; lanjutan SDIT lanjut Juz 29. Target baku: SMPIT 1 juz, SDIT 2 juz.)*
10. **"Metode Ummi" vs "ODOA" membingungkan.** Beranda: "Tahfidz bersanad, Metode Ummi"; `/tahfidz`: "Metode ODOA". Satu kalimat baku di semua halaman: Ummi = metode baca/tahsin, ODOA = ritme hafalan harian.
11. **Video hanya ada di `/tentang`.** Tabel `video_youtube` berisi 4 video. Pasang 1 video profil di beranda (lazy, thumbnail dulu) dan di `/ppdb`.
12. **Pelacakan konversi.** Fungsi event GA4 kategori `ppdb` sudah ada. Pastikan event kirim-formulir dan klik-WA ditandai sebagai key event di GA4, dan isi kolom `sumber` dari `utm_source` supaya biaya iklan bisa dihitung per pendaftar.

### P3 — SEO dan teknis (bulan ini)

13. **HTML tidak di-cache di edge** (`cf-cache-status: DYNAMIC`, TTFB 1,0–1,3 dtk pada 20 halaman; halaman lain 0,4–0,5 dtk). Buat Cache Rule Cloudflare: cache HTML publik, edge TTL 10 menit, kecualikan `/spmb-online`.
14. **Daftar berita di HTML server tertinggal.** `/berita` dan beranda di HTML mentah berhenti di 15 Oktober 2026 dan hanya menaut 9 dari 39 artikel; 4 artikel November hanya muncul lewat JavaScript. Regenerasi HTML statis setiap kali berita terbit dan tambahkan paginasi bertaut (`/berita?hal=2`) agar 30 artikel lama punya tautan internal.
15. **Tiga tumpukan CSS berbeda.** 12 halaman memakai `alqomar-v3.css`; 7 halaman (`/biaya`, `/fasilitas`, `/prestasi`, `/privacy`, `/syarat`, `/tahfidz`, `/sekolah-islam-jakarta-barat`) memuat Google Fonts eksternal + font Source Serif 4; `/spmb-online`, `/guru`, `/rqaq` memakai Tailwind/DaisyUI dengan path relatif (`css/tailwind.min.css`). Migrasikan semuanya ke v3 dan font self-hosted; ubah path relatif menjadi absolut.
16. **Versi `alqomar-v3.js` tidak seragam**: `20261006a` (17 halaman), `20261019` (5), `20261101` (1). Pengunjung menjalankan kode berbeda per halaman. Samakan ke versi terbaru lewat satu variabel build.
17. **`robots.txt` membocorkan `/login-divisi` dan `/_backup/`.** `/login-divisi` kini 404. Hapus kedua baris; path sensitif dilindungi auth, bukan robots.
18. **URL huruf besar 404** (`/PPDB`). Tambahkan redirect 301 lowercase di `.htaccess`; URL ini sering diketik manual dari brosur.
19. **Alt gambar kosong pada foto konten**: foto hero jenjang di `/ppdb`, `/sdit`, `/smpit`, `/berita`, dan foto di `/galeri`. Isi alt deskriptif. Logo ber-alt kosong boleh dibiarkan.
20. **Hal kecil.** `site.webmanifest` dikirim sebagai `text/plain` (set `application/manifest+json`); halaman 404 punya canonical ke `/404.html` (hapus); belum ada `llms.txt`; target sentuh < 32 px: 16–26 elemen per halaman (tautan footer dan breadcrumb).
21. **Supabase (rendah).** 20 tabel punya dua policy SELECT permisif untuk role `authenticated` (gabungkan); indeks `idx_spmb_jenjang` dan `idx_spmb_status` belum pernah terpakai; `supabase-js` dipatok di 2.39.3 (perbarui).

## Status 14 Nov 2026

No. 1–4 dan 10 sudah dikoreksi di `_perbaikan/2026-11-14/` (belum di-upload). Keputusan isi: `memory/keputusan/2026-11-14-fakta-konten-baku.md`.

## Urutan eksekusi

| Pekan | Pekerjaan | Pemilik |
|---|---|---|
| 1 | No. 1–5 | Kepsek + admin web |
| 2–3 | No. 6–12 | Panitia PPDB + admin web |
| 4 | No. 13–21 | Admin web |

## Angka kunci

| Metrik | Nilai |
|---|---|
| Halaman ter-crawl | 30 (semua 200) |
| URL di sitemap | 21 statis + 38 berita |
| Aset rusak | 0 |
| TTFB (curl, dari AS) | 0,42–1,31 dtk; satu halaman berita 2,57 dtk |
| LCP mobile | 0,5–2,9 dtk |
| CLS | 0–0,008 |
| Temuan keamanan Supabase level ERROR | 0 |
