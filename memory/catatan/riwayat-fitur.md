---
judul: Riwayat Fitur Baru
tipe: catatan
tags: [proyek, fitur]
diperbarui: 2026-10-11
---

# Riwayat Fitur Baru

Bagian dari [[index]]. Bug dicatat di [[riwayat-perbaikan]].

> [!info] Aturan
> Setelah menambah fitur/halaman, tambah entri di paling atas: tanggal, apa, file yang disentuh, status deploy, dan hal yang perlu diingat (dependensi, kunci, URL). Cek juga `sitemap.xml` kalau ada halaman baru.

| Tanggal | Fitur | File / lokasi | Catatan |
|---|---|---|---|
| 2026-10-21 | Tracker XLSX: tambah sheet Harian + Mingguan (rekap SUMIFS per rentang tanggal) | `docs/Tracker-Marketing-MD-Heny-Fitriani.xlsx` | Data dummy; non-website, tanpa deploy. Versi Google Sheets belum dibuat (tunggu konfirmasi upload ke Drive) |
| 2026-10-21 | Tracker XLSX per anggota MD Heny (data DUMMY) | `docs/Tracker-Marketing-MD-Heny-Fitriani.xlsx` | 5 sheet (Petunjuk, Anggota, Referral, Bulanan, Rekap) dengan rumus & dropdown; non-website, tanpa deploy. Ganti data dummy sebelum dipakai |
| 2026-10-21 | Template laporan MD Heny Fitriani (Tanur Muthmainnah, landscape DOCX) | `docs/Laporan-MD-Heny-Fitriani-Tanur-Muthmainnah.docx` | Non-website, tidak perlu upload ke Hostinger; angka masih kosong, tunggu data tim. Jangan diulang: pakai kop Tanur/MEJ, bukan Al-Qomar |
| 2026-10-11 | Hook Stop pengingat riwayat | `.claude/hooks/ingatkan-riwayat.sh`, `.claude/settings.json` | Blok sekali jika ada file berubah tapi riwayat belum diperbarui; abaikan `memory/`, `.claude/`, `CLAUDE.md`; aman dari loop via `stop_hook_active` |
| 2026-09-14 | Dokumentasi integrasi berita PHP+Supabase | `CLAUDE.md`, `berita-detail.php`, `sitemap-berita.php` | Aktif di production; PHP + curl wajib di hosting |
| 2026-09-02 | Skrip deploy FTPS ke Hostinger | skrip deploy (lihat `git show cb48333`) | Mode koneksi & kredensial divalidasi (`f40b186`, `d5685ef`, `a913cc9`); jangan commit kredensial |
| 2026-08-28 | Panduan integrasi Claude Code + NotebookLM | `docs/` | `8f0aef8` |
| 2026-08-28 | Memori: panggilan user untuk Claude = "Aira" | `memory/catatan/panggilan-user.md` | `5adc68e` |
| 2026-07-16 | Halaman Event + canonical URL bersih; bersihkan link `.html` lama di beranda | `event.html`, `index.html` | `93db0ec`, `7dc6eba`, `e381395` |
| 2026-06-25 | Sistem Obsidian Memory | `memory/`, `.claude/hooks/load-memory.sh` | `9524b8b` |
| 2026-06-19 | Landing page SEO "sekolah islam Jakarta Barat" + schema FAQ/Breadcrumb | lihat `git show 80ad70d` | Perlu masuk `sitemap.xml` |
| 2026-05-09 | Halaman login divisi (dar.tanur.id) | `login-divisi.html` | `799007d`; noindex |
| 2026-05-16 | Skill Claude Code (desain-profesional, konten-sosmed) | `.claude/skills/` | `c8dcf73`, `51ecd73` |

<!-- Entri baru ditambah di baris pertama tabel -->
