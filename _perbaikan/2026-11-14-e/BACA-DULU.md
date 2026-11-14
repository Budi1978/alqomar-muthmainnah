# Hero tablet + menu HP — 14 November 2026 (paket e)

Lanjutan paket d. Dibuat dari salinan live 14 Nov 2026 (paket d sudah terpasang).

## Upload ke `public_html`

| File di folder ini | Tujuan di server |
|---|---|
| `css/alqomar-v3-chrome.css`, `css/alqomar-v3.css` | `public_html/css/` (timpa) |
| 22 file `.html` | `public_html/` (timpa) |

Cara tercepat: upload zip ke `public_html`, lalu Extract. Setelah selesai: Cloudflare → **Purge Everything**. `.htaccess` tidak berubah.

## Isi perubahan

| # | Masalah | Perbaikan |
|---|---|---|
| 1 | Lebar 861–1200px: judul dan paragraf hero beranda melebar sampai menimpa foto | Kolom teks dibatasi 50% lebar, gradasi putih digeser (`alqomar-v3.css` + CSS inline beranda) |
| 2 | Lebar 600–860px (tablet tegak): foto hero setinggi 480px, tombol daftar turun ke bawah layar | Foto dipendekkan (rasio 2:1), paragraf dilebarkan |
| 3 | Menu HP di semua halaman: teks menempel ke tepi kiri, submenu tidak menjorok | `.site-header ul{padding:0}` menimpa padding `.main-nav`/`.submenu`; dipulihkan di `alqomar-v3-chrome.css` |

Versi CSS naik ke `?v=20261114b` (beranda: kedua file; 21 halaman lain: `chrome` saja).

Halaman detail berita (`berita-detail.php`) masih merujuk `chrome.css` versi lama, jadi menu HP di sana baru ikut benar setelah file PHP itu diperbarui.
