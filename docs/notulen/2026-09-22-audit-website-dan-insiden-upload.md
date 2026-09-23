# Notulen — Audit Website & Insiden Upload Menimpa Desain Live (alqomar.sch.id)
Tanggal: 2026-09-22 s/d 2026-09-23
Pelaksana: Claude ("Aira") · Branch: `claude/happy-allen-du1nmp`

## Permintaan
Cek alqomar.sch.id menyeluruh + rekomendasi perbaikan. Lanjut eksekusi poin 2, 3, lalu 5–7.

## Hasil kerja
| Poin | Isi | Status |
|---|---|---|
| Audit | 10 temuan (PIN portal divisi terbuka di source, PPDB basi, Tailwind CDN diblokir CSP, guru.html 670 KB, gambar CMS PNG 1,7–2,8 MB, GA cuma 5 halaman, dll.) | Selesai (basis: repo, akses live diblokir sandbox) |
| 2 | PPDB 2026/2027 → 2027/2028, jadwal gelombang digeser (tentatif), event.html TP 2026/2027 | Selesai di repo, **ter-upload di atas file basi** |
| 3 | guru.html & rqaq.html: Tailwind CDN → `css/tw-halaman.min.css` | Selesai di repo, ter-upload |
| 5 | Gambar CMS dikecilkan via Supabase Render API; favicon rusak diperbaiki | Selesai di repo (batch 2 ZIP) |
| 6 | GA4 ke 15 halaman + event `klik_whatsapp`, `klik_daftar`, `generate_lead` | Selesai di repo (batch 2 ZIP) |
| 7 | Akreditasi A — dikonfirmasi user: A selama 10 tahun terakhir | Tidak perlu diubah |
| — | Hapus 309 gambar "tidak terpakai" | **DIBATALKAN** — daftar dihitung dari repo basi, tidak valid |

Temuan data: tabel Supabase `kegiatan` kosong → halaman event live menampilkan "Tidak ada kegiatan mendatang".

## KESALAHAN CLAUDE (Aira)
1. **Membuat file upload dari branch `main` tanpa memverifikasi versi live.** Memori proyek (`sinkronisasi-repo-vs-production.md`) sudah memperingatkan repo bisa basi dari server — peringatan itu diabaikan.
2. **Tidak mengecek branch lain.** Desain & perbaikan terbaru yang sudah live tidak pernah di-merge ke `main`, tersebar di 7 branch. Akibatnya **12 dari 15 file yang di-upload menimpa versi lebih baru**:
   - `index.html` ← redesain 17 Sep (`jolly-volta-k5cxy9`)
   - `event.html` ← desain baru 19 Sep (`design-system-extraction-5zuukp`)
   - berita, tahfidz, kb-tkit, sdit, smpit, sekolah-islam-jakarta-barat ← perbaikan SEO 9 Sep (`beautiful-franklin-x9uxqk`)
   - ppdb, spmb-online, privacy ← perbaikan audit keamanan 7 Sep (`alqomar-security-audit-hdisvr`)
   - 404 ← 2 Sep (`cek-sistem-c2wnam`)
3. **Dampak kritis: formulir pendaftaran online gagal simpan.** spmb-online.html versi lama memakai insert langsung ke `spmb_pendaftar`, padahal sejak 7 Sep hanya RPC `daftar_spmb` yang diizinkan. Log Supabase 22–23 Sep: 0 percobaan pendaftaran → belum ada calon pendaftar yang hilang per 23 Sep.
4. **Tidak menunjukkan perbandingan sebelum/sesudah** kepada user sebelum upload.
5. Menyebut hal di awal sebagai "sudah dicek" padahal yang dicek hanya tampilan lokal, bukan kesesuaian dengan versi live.

Dampak ke user: desain website mundur, user harus melakukan restore backup Hostinger sendiri — pekerjaan tambahan akibat kesalahan Claude.

## Pemulihan
- Restore backup Hostinger (Files → Backups → File backups → 21 Sep 2026 → `public_html` → Restore). Panduan: `docs/panduan-restore-hostinger.html`.
- PENDING: user melakukan restore. Setelah itu perbaikan (PPDB 2027/2028, GA, gambar) hanya dipasang di atas file live yang dikirim user.

## Aturan baru (sudah dicatat di memory)
- `main` BUKAN sumber kebenaran file HTML. Basis perubahan WAJIB file live dari server.
- Jangan kirim file utuh untuk menimpa server tanpa verifikasi basis = live + tunjukkan diff ke user dulu.
- Daftar aset "tidak terpakai" dari repo tidak berlaku untuk server — jangan hapus apa pun di server berdasarkan itu.
