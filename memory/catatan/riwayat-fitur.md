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
| 2026-11-11 | Dashboard SPKKS: seed Dimensi I (bab 1) dari Archive.zip: KI-01..KI-21 dipetakan ke bukti I.1–I.15, 14 siap, hanya I.2 (KI-07 Jurnal Harian KS) belum ada | `docs/spkks-dashboard.html` (DEF().bf) | Satu dokumen bisa menjawab beberapa butir (KI-02 = 2&6, KI-05 = 5&8, KI-10 = 9,10,11). Temuan: KI-04 jumlah lulusan kosong; KI-10/11 formulir wawancara kosong & KI-11 mirip KI-10; KI-15 contoh surat bernomor kosong. Arsip juga berisi M-xx, S-xx, K-xx (Dimensi II–IV) belum dipetakan. PDF tidak dimasukkan ke repo |
| 2026-11-11 | Dashboard SPKKS: penyusun dokumen per bukti fisik (87 bukti): editor blok (bab/subbab/paragraf/daftar/tabel/foto/lampiran), template per jenis bukti, cetak PDF bergaya KI-01 (sampul+logo, pengesahan, kata pengantar, daftar isi/tabel/gambar, nomor halaman), cetak semua dokumen, kolom No. SK & penanggung jawab, unduh CSV | `docs/spkks-dashboard.html` | Foto lampiran di IndexedDB (tidak ikut ekspor JSON; teks dokumen ikut). Penanda `[isi: …]` = placeholder wajib diganti. Daftar isi tanpa nomor halaman. Logo dari `images/logo.png` (inline base64) |
| 2026-11-11 | Dashboard SPKKS SD (HTML mandiri): 99 indikator + 87 bukti fisik, skor 1–4, kategori/predikat otomatis, cetak PDF (cover, ringkasan, instrumen, daftar bukti) | `docs/spkks-dashboard.html` | Non-website, tanpa deploy (jangan taruh di root). Data dari `Instrumen.xlsx`; simpan di localStorage + IndexedDB (berkas lampiran hanya di peramban). Seed: bukti I.1 = KI-01 (draf masih ada isian kuning: Tabel 5 no.5, Subbab 4.3, Gambar 4, catatan September). Penamaan dokumen per indikator: `KI-nn`. Jangan diulang: sheet "Ringkasan" tidak ada di xlsx, dibuat sendiri di dashboard |
| 2026-10-21 | Tracker MD Heny diunggah ke Google Drive sebagai Google Sheet (dummy) | Drive pemilik: ahmadbudisetiawan1@gmail.com, id `10oxXCdIK_6_VRgCSFP9_NNt6Q6Uq28fTltmJNPF3kXg` | Upload xlsx base64 gagal ("Invalid conversion requested", salinan base64 manual rusak); dibuat ulang lewat Sheets API (7 sheet, rumus, dropdown, warna status). Jangan diulang: kirim base64 panjang lewat chat |
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
