---
judul: Modul Pembayaran dibangun di Platform Guru
tipe: keputusan
tags: [keputusan, keuangan, platform-guru]
tanggal: 2026-07-20
---

# Keputusan: Modul Pembayaran SPP/Buku/Kegiatan → Platform Guru

## Konteks
Selama ini orang tua transfer SPP/buku/dana kegiatan ke rekening pribadi
Pak Budi, lalu beliau menyalin mutasi bank secara manual ke buku keuangan
(SPP Juli 2026–Juni 2027, buku, dana kegiatan). Kewalahan.

## Keputusan
Alur baru: orang tua tetap transfer → kirim bukti ke wali kelas → **wali
kelas input di Platform Guru** (repo `Budi1978/platform-guru-alqomar`,
Next.js + Supabase Tokyo `lnacvtvufgsxnqhuezox`) → **kepsek tinggal
verifikasi** → rekap otomatis.

Dikerjakan 2026-07-20 di branch `claude/modul-pembayaran`:
- `supabase/migration_pembayaran.sql` — tabel `app_roles`, `tarif`,
  `pembayaran` + bucket privat `bukti-transfer`, RLS ketat (wali kelas
  hanya kelasnya; verifikasi hanya kepsek/bendahara)
- `/dashboard/pembayaran` — form input wali kelas (mobile-first)
- `/dashboard/verifikasi` — antrian verifikasi + matriks SPP siswa×12
  bulan + rekap per jenis/bulan/kelas
- `docs/modul-pembayaran.md` — panduan aktivasi

## Status akhir (2026-07-21): ✅ LIVE
- Aplikasi live: **https://guru.alqomar.id** — hosting **Vercel**
  (DNS cname.vercel-dns.com), deploy dari repo GitHub
  `Budi1978/platform-guru-alqomar` branch main (sinkron dengan laptop).
- Migration + trigger nominal baku + tarif TA 2026/2027 (10 baris)
  sudah dijalankan Pak Budi di Supabase SQL Editor.
- Menu Verifikasi di-gate role kepsek/bendahara (commit 1b003e2,
  dikerjakan sesi Claude laptop).
- Nominal = angka baku dari tarif; hanya kepsek yang bisa ubah tarif
  (tab Tarif di halaman Verifikasi).

## Catatan penting
- **Supabase MCP sesi Claude hanya ter-scope ke project "command center"
  (Tanur)** — TIDAK bisa akses project Platform Guru Tokyo. Migration
  harus dijalankan manual via Supabase SQL Editor (konvensi repo memang
  begitu).
- Setelah merge: jalankan migration, set `app_roles` untuk email kepsek,
  isi `tarif` per jenjang TA 2026/2027, pastikan `kelas.wali_kelas` terisi.
- Saran jangka menengah: buka rekening atas nama yayasan/sekolah.
