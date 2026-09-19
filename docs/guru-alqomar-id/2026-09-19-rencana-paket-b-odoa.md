# Rencana Paket B ODOA — guru.alqomar.id (usulan 19 Sep 2026, menunggu OK per tahap)

## Yang SUDAH ada di app (jangan dibangun ulang)
- Ziyadah harian: `odoa/<siswaId>__<tgl>__<ts>` {siswaId, tanggal, nomor, surah, dari, sampai, nilai, halaqah, oleh}.
- Muroja'ah: 4 slot per bulan di `odoaBulanan/<siswaId>__<YYYY-MM>` (murojaah1..4, kelancaran1..4, catatan0..3) lewat tombol "Isi Muroja'ah".
- Ujian tahfidz: jenis `_JENIS_UJIAN_ODOA` = Asesmen Sumatif Tengah Semester / Akhir Semester (= UTS/UAS), field ujianJenis/ujianTanggal/ujianPenguji/ujianPredikat/ujianCatatan di odoaBulanan; batch "Rekap Ujian" per halaqah; ketuntasan beda per tingkat (kelas 1–2 Jayyid 70, kelas 3–6 Jayyid Jiddan 80; keputusan 9 Sep).
- Target hafalan `_TARGET_TAHFIDZ` per tingkat × program (`siswa.programTahfidz` baru = 2 juz [1–3 Juz 30, 4 ganjil muroja'ah+ujian Juz 30, 4 genap–6 Juz 29, ujian Juz 29 kelas 6]; lama = 1 juz Juz 30, ujian kelas 6). Sesuai target user.
- Semester/TA otomatis `_taSekarang()` (Jul–Des Ganjil, Jan–Jun Genap).
- Cetak: Kartu Siswa, Rekap Setoran, Rekap Muroja'ah, Rekap Ujian, Rapor ODOA (bulanan). Riwayat Hafalan Anak (cek gating).
- Akses: admin / koordinator (5) / koordinator penuh (Ulfa, Rifa) / pembimbing halaqah sendiri — hardcoded di kode.

## Gap vs bagan user
1. Muroja'ah HARIAN (tanggal, surah, ayat, juz, nilai, catatan) — sekarang hanya 4 slot/bulan.
2. Catatan per setoran ziyadah — belum ada. Juz — bisa dihitung dari nomor surah (78–114 = Juz 30, 67–77 = Juz 29), tidak perlu field.
3. Rapor per SEMESTER — sekarang per bulan; ujian ASTS/ASAS sudah ada tapi tersebar per bulan.
4. Riwayat untuk pembimbing (halaqah sendiri).
5. Menu standar (MASTER DATA / TAHFIZH / UJIAN / RAPORT / REKAP / PENGATURAN) — sekarang satu halaman bertumpuk kartu.
6. Pengaturan koordinator & semester dari UI (sekarang di kode → tiap ganti orang harus deploy).

## Tahap (masing-masing satu deploy, minta OK sebelum kode)
- **B1 — Muroja'ah harian + catatan + riwayat pembimbing.** Di tabel setoran tambah pilihan Jenis (Ziyadah default / Muroja'ah) dan kolom Catatan; simpan ke `odoa` dengan `jenis` + `catatan` (record lama tanpa `jenis` = ziyadah). Kartu, rekap, riwayat memisahkan ziyadah vs muroja'ah; juz dihitung. Tombol Riwayat Hafalan Anak dibuka untuk pembimbing (anak halaqah sendiri). Slot muroja'ah bulanan tetap ada untuk rapor. Rules `odoa` tetap (validate hasChildren siswaId,tanggal,surah).
- **B2 — Rapor Tahfizh Semester.** Dokumen per anak per semester (Ganjil/Genap): ringkasan ziyadah semester (dari odoa), muroja'ah harian (B1), hasil ASTS + ASAS (dari odoaBulanan), predikat & ketuntasan vs target, catatan pembimbing. Cetak hanya admin/Ulfa/Rifa. Rapor bulanan tidak dihapus.
- **B3 — Navigasi & Pengaturan.** Halaman ODOA dipecah jadi tab: Tahfizh (ziyadah/muroja'ah/riwayat) · Ujian · Rapor · Rekap & Laporan · Pengaturan. Pengaturan: daftar koordinator & koordinator penuh dipindah ke RTDB `odoaPengaturan` (admin-only write) supaya ganti orang tanpa deploy; override semester/TA manual. MASTER DATA memakai halaman Data Siswa/Data Guru/Atur Pembimbing yang sudah ada.
