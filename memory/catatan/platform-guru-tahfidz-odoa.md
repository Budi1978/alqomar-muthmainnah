---
judul: Platform Guru — Modul Tahfidz ODOA (setoran, laporan, akses)
tipe: catatan
tags: [proyek, platform-guru, tahfidz, odoa, keputusan]
diperbarui: 2026-09-19
---

# Platform Guru — Modul Tahfidz ODOA

Bagian dari [[index]]. Platform: **guru.alqomar.id** · repo `Budi1978/platform-guru-alqomar` (Next.js 16 + Supabase Tokyo `lnacvtvufgsxnqhuezox`).

## Kondisi saat dicek (19 Sep 2026)
- Modul ODOA sudah live di kode (commit 15 Sep: unduh Word rapor), tabel sudah ada, tapi **0 halaqah, 0 setoran** — belum pernah dipakai di produksi.
- Blocker praktis: dropdown "Pembimbing (akun login)" hanya berisi 2 nama karena cuma 2 dari 35 baris `guru` yang punya `user_id`. 22 akun wali kelas (`wali.*@alqomar.id`) tidak tertaut ke tabel `guru`.
- Halaman Laporan tidak punya rekap tahfidz sama sekali.
- Sandbox Claude **tidak bisa** akses guru.alqomar.id (egress diblokir) — verifikasi lewat DB Supabase + kode repo.

## Keputusan kepsek (19 Sep 2026) — aturan FINAL
- Data halaqah/setoran lama **hilang karena insiden over storage** Supabase; sebelum itu modul sudah rapi. Halaqah harus dibuat ulang.
- **Koordinator (5): Rifa, Ulfa, Een, Ellida, Imam** — mengisi & memeriksa SEMUA halaqah, tanpa batas tanggal, boleh buat halaqah/atur santri.
- **Guru pembimbing** — hanya halaqahnya sendiri, saat setoran dibuka & dalam batas hari mundur.
- **Cetak rapor: hanya Ulfa & Rifa** (+ kepsek/admin).
- **Kepsek/admin** — semuanya (pengaturan buka/tutup, daftar koordinator).
- Akun: Rifa `rifatul.hasanah@alqomar.id`, Imam `iman.paojan@alqomar.id` (keduanya dibuat Aira 19 Sep, password awal diserahkan ke user), Ulfa `wali.1b@`, Een `wali.1a@`, Ellida `wali.5a@alqomar.id`. Semua baris `guru` sudah tertaut.

## Yang sudah dikerjakan (branch `claude/tahfidz-akses-laporan` di repo platform)
- Migrasi `supabase/migration_tahfidz_akses.sql` — **sudah diterapkan ke Supabase**: tabel `tahfidz_pengaturan` (buka/tutup + batas hari mundur, WIB), `tahfidz_koordinator` (+ `boleh_cetak_rapor`), RLS setoran menegakkan pengaturan, koordinator bisa baca semua, index unik anti setoran ganda.
- Koordinator ber-hak cetak (sudah aktif di DB): **Ulfa = `wali.1b@alqomar.id`** (Saadiyah Ulfa, S.Pd) dan **Rifa = `rifatul.hasanah@alqomar.id`** (akun dibuat Aira 19 Sep 2026 lewat SQL, password awal diserahkan ke user, minta ganti di /dashboard/ganti-password). Baris `guru` keduanya sudah tertaut `user_id`.
- UI: kartu "Pengaturan input setoran" (tombol buka/tutup) + kartu "Koordinator tahfidz" di tab Kelola Halaqah; dropdown pembimbing kini gabungan guru tertaut + wali kelas; halaman rapor menolak akun tanpa hak cetak; tab **Tahfidz ODOA** baru di Laporan (rekap per halaqah, export Excel/PDF).
- Status: **sudah di-merge ke `main`** (2 commit: akses + revisi koordinator input penuh), Vercel deploy otomatis.

## Halaqah dibuat ulang sesuai SK (19 Sep 2026)
- Sumber: **SK Pembagian Kelompok ODOA TA 2026/2027 (13 Juli 2026)** + dokumen "Daftar Surah Juz 29 dan Juz 30" (user upload). Koordinator program ODOA menurut SK: **Iman Paojan, S.Pd.I**.
- ODOA **hanya SDIT**, 310 siswa. SK: 11 kelompok = 11 rombel, tiap rombel 2 pembimbing, dan **daftar siswa dibagi dua kurung**: wali kelas pegang baris awal, pendamping baris akhir (Kelas VI tiga kurung: Rifa 1–6, Fatmarianti 7–23, Iman 24–37).
- **Di DB dipecah jadi 23 sub-halaqah** "Kelompok N — Kelas X · <Nama guru>" (mis. "Kelompok 1 — Kelas IA · Een Muflihat" = 15 santri, "… · Rahayu Vina Purwanti" = 15). Tiap sub-halaqah `pembimbing_id` = guru itu; guru hanya melihat sub-halaqahnya. Batas kurung dibaca dari posisi label di PDF SK (heuristik), kalau ada yang meleset koordinator geser santri di Kelola Halaqah.
- Pendamping tanpa akun (Widiya IIB, Aranda IVB, Annisa VA): sub-halaqahnya `pembimbing_id` null, `pendamping_id` = wali kelas sebagai cover sampai akun dibuat.
- Pencocokan nama PDF↔DB: kunci 12 huruf pertama (tanpa spasi/tanda), sisanya berdasarkan urutan abjad; 310/310 cocok unik.
- Bug yang ditemukan user 19 Sep ("kok nga ada kelasnya"): policy `siswa`/`kelas` lama hanya untuk wali kelas → pendamping & koordinator lihat 0 santri. Diperbaiki: policy `siswa_select_tahfidz` & `kelas_select_tahfidz` (fungsi security definer, hindari rekursi).
- Target per kelas (keputusan user 19 Sep): **kelas 1–2 = 2 juz (30 & 29)**, munaqosyah Juz 30 di kelas 4 lalu Juz 29 s.d. kelas 6 + munaqosyah; **kelas 3–6 = 1 juz (Juz 30)**. Rincian TA ini: kelas 1 An-Nas–Al-Fil, kelas 2 Al-Humazah–Al-Fajr, kelas 3 tuntas Al-Ghasyiyah–An-Naba' + pra-munaqosyah, kelas 4 munaqosyah Juz 30, kelas 5–6 pemantapan/muroja'ah.
- `src/lib/data/surah.ts` sudah punya Juz 29 lengkap.

## Verifikasi 19 Sep 2026 (simulasi RLS di DB, semua lulus)
- Pembimbing (wali 2A): lihat 11 halaqah, pegang hanya kelompoknya; insert setoran hari ini & kemarin OK, 2+ hari lalu DITOLAK, insert ke kelompok lain DITOLAK.
- Pendamping (wali 9B = pendamping Kel 1): dikenali sebagai pembimbing Kel 1.
- Koordinator tanpa cetak (Ellida): insert ke kelompok lain tanggal 10 hari lalu OK, baca 310 anggota, cetak = false.
- Rifa, Ulfa, kepsek: cetak = true.
- Setelah pemecahan: Een (wali 1A) pegang hanya sub-halaqahnya (15 santri), Rahayu Vina lihat 30 santri Kel 1 lalu 15 setelah split.
- **Push ke `main` diblokir classifier sesi** → kode pendamping+Juz 29 ada di PR dari branch `claude/odoa-sk-pendamping`; user harus merge sendiri.

## Catatan teknis
- Peran dihitung di `src/lib/tahfidz-akses.ts`; batas keras tetap di RLS.
- `wali.2b@alqomar.id` ada di auth tapi tidak jadi wali kelas mana pun (Kelas 2B dipegang `wali.2c@alqomar.id`) — residu, tanya user sebelum dibersihkan.
- Advisor Supabase: `check_guru_email_exists` & `check_admin_email_exists` bisa dipanggil anon (enumerasi email login) — pertimbangkan revoke dari `anon` kalau alur login tidak butuh; proteksi password bocor (HaveIBeenPwned) masih nonaktif.

## Tautan Terkait
- [[sinkronisasi-repo-vs-production]]
