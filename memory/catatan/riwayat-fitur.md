---
judul: Riwayat Fitur Baru
tipe: catatan
tags: [proyek, fitur]
diperbarui: 2026-10-12
---

# Riwayat Fitur Baru

Bagian dari [[index]]. Bug dicatat di [[riwayat-perbaikan]].

> [!info] Aturan
> Setelah menambah fitur/halaman, tambah entri di paling atas: tanggal, apa, file yang disentuh, status deploy, dan hal yang perlu diingat (dependensi, kunci, URL). Cek juga `sitemap.xml` kalau ada halaman baru.

| Tanggal | Fitur | File / lokasi | Catatan |
|---|---|---|---|
| 2026-10-12 | Naskah dokumen pencegahan perundungan SDIT (D01-D18 + lampiran kelas WK) berbentuk DOCX F4 | `docs/bullying-sdit/` | Draf belum disahkan; acuan Permendikdasmen 6/2026 + Kepmendikdasmen 17/2026 (Permendikbudristek 46/2023 sudah dicabut, jangan sebut TPPK/Satgas); data sekolah/kontak lokal = [DIISI SEKOLAH]; hanya kontak SAPA 129 yang terverifikasi. Bukan untuk di-upload ke Hostinger (folder `docs/`). Progres 12 Okt (SEMUA D01-D18 + WK selesai; file gabungan `Dokumen_Pencegahan_Perundungan_SDIT_AlQomar_Gabungan_v01.docx` (~167 hlm) dibuat dari skrip merge (docxcompose), file per paket tetap disimpan; skrip pembuat di scratchpad, helper tabel memakai lebar kolom tetap): penyusun paralel masih mengerjakan paket sisa; kode formulir FRM-01..12 diusulkan D07, perlu disepakati paket lain. Deck terkait: artifact Slides "Penanganan Bullying di Sekolah" |
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
