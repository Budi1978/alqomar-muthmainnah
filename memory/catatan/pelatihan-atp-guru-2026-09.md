---
judul: Pelatihan Guru — pemeriksaan tugas ATP & panduan CP→ATP semua jenjang (Sep 2026)
tipe: catatan
tags: [proyek, kurikulum, pelatihan-guru, atp, penting]
diperbarui: 2026-09-19
---

# Pemeriksaan tugas ATP 24 guru + panduan CP→ATP (19 Sep 2026)

Bagian dari [[index]]. Detail teknis app guru ada di [[guru-alqomar-id-arsitektur]] (bagian "Pelatihan Guru: tugas ATP").

## Status akhir sesi 19 Sep 2026 — SELESAI, semua sudah dikirim ke user
- **Arsip lengkap di repo:** `docs/pelatihan-guru-atp-2026-09/` (README di dalamnya menjelaskan isi). Scratchpad sesi hilang; pakai folder ini kalau butuh sumber.
- **Deliverable yang sudah diterima user:** rekap master (md + docx), 24 koreksi per guru (zip Word), panduan SD 9 mapel (zip), panduan SMP 11 mapel (zip), panduan TK 3 elemen (zip).
- **Cara regenerasi Word:** `python3 docs/pelatihan-guru-atp-2026-09/skrip/panduan-md2docx.py <dir-md> <dir-out>` (butuh python-docx). Nama file keluaran otomatis berakhiran `-SMP.docx`; untuk TK/SD ganti manual.

## Fakta penting yang sudah ditetapkan user
- Tugas hanya semester ganjil. Wali kelas paralel boleh mengumpulkan ATP yang sama. Informatika ≠ Koding & KA (CP terpisah). Seni = Seni Rupa saja.
- Statistik tahap (34 dokumen unik): Tahap 4 (TP) dan 5 (ATP) paling banyak salah; Tahap 1: 12 CP salah sungguhan (7 versi 2022). Penerbit hampir semua Erlangga (buku berbasis CP 2022) → CP wajib disalin dari PDF 046/2025.
- Indikasi AI: tidak ada yang "tinggi"; rekomendasi user: minta penjelasan lisan 2 menit Tahap 3.

## Keputusan yang MASIH MENUNGGU user (tanyakan bila topik ini muncul lagi)
1. Versi CP PAI (Kepka BKPDM 020/2026 vs 046/2025).
2. Rujukan pengganti CP: B. Arab, Tahfidz, Informatika SD.
3. ATP kelas 6 Fatmarianti; penugasan Dimiyati (TK + SMP); Andi Ilham, Ninik, Sjarniwati belum mengumpulkan.
4. SMP: kalender SMPIT = SDIT?; minggu efektif resmi (14 vs 15); tafsir TP keterampilan proses IPA/IPS; PAI SMP 2 atau 3 JP; perlu Prakarya?
5. TK: pemegang subelemen sains/teknologi/seni & fisik motorik; overlap wudu (elemen 1 vs 2); kebijakan calistung TK B; daftar doa per kelompok; kelas & gelar Mita.

## Pelajaran proses
- Penulisan panduan paralel 3–4 agen per jenjang dengan `TEMPLATE-ATURAN*.md` + contoh PAI berjalan baik; semua agen melaporkan panjang melebihi 3.400 kata karena tabel wajib — user tidak keberatan.
- Teks Karakteristik CP terpotong ±9.000 karakter untuk BING/PJOK/IPS/Informatika (arti elemen dirangkum). Rangkuman CP Fase C (docx dari user) urutan katanya teracak — tidak otoritatif.
- Sandbox tidak bisa render docx secara visual (LibreOffice gagal); verifikasi hanya struktural. Egress ke supabase.co diblokir; file tugas harus dikirim user sebagai zip.
