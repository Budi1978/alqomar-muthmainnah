# Font self-hosted — 14 November 2026

Menghapus ketergantungan Google Fonts di 7 halaman. Upload ke `public_html` dengan struktur folder yang sama:

| File di folder ini | Tujuan di server |
|---|---|
| `fonts/noto-nastaliq-urdu-arabic-400-normal.woff2` | `public_html/fonts/` (file baru) |
| `css/pages.css` | `public_html/css/` (timpa) |
| `biaya.html`, `fasilitas.html`, `prestasi.html`, `privacy.html`, `syarat.html`, `tahfidz.html`, `sekolah-islam-jakarta-barat.html` | `public_html/` (timpa) |

Urutan: font dulu, lalu `pages.css`, baru file HTML. Kalau HTML naik sebelum font, teks Arab di `/tahfidz` sementara tampil dengan font cadangan.

Dibuat dari salinan live 14 Nov 2026 (sudah termasuk koreksi isi dan penghapusan nominal SPP).
