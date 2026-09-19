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

## Catatan teknis
- Peran dihitung di `src/lib/tahfidz-akses.ts`; batas keras tetap di RLS.
- `wali.2b@alqomar.id` ada di auth tapi tidak jadi wali kelas mana pun (Kelas 2B dipegang `wali.2c@alqomar.id`) — residu, tanya user sebelum dibersihkan.
- Advisor Supabase: `check_guru_email_exists` & `check_admin_email_exists` bisa dipanggil anon (enumerasi email login) — pertimbangkan revoke dari `anon` kalau alur login tidak butuh; proteksi password bocor (HaveIBeenPwned) masih nonaktif.

## Tautan Terkait
- [[sinkronisasi-repo-vs-production]]
