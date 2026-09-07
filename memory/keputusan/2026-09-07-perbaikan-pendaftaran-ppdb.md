---
judul: Perbaikan jalur pendaftaran PPDB (P0)
tipe: keputusan
tags: [keputusan, ppdb, supabase, keamanan]
tanggal: 2026-09-07
---

# Perbaikan jalur pendaftaran PPDB

## Masalah
Formulir `/spmb-online` memanggil `insert(...).select('no_pendaftaran')`.
RLS `spmb_pendaftar` hanya mengizinkan SELECT untuk role `authenticated`,
sehingga PostgREST menolak klausa RETURNING dan me-rollback seluruh insert
(`ERROR 42501`). Blok `catch` hanya menampilkan pesan lalu **tetap lanjut**
menampilkan panel "Pendaftaran Berhasil".

Akibat: tabel `spmb_pendaftar` **0 baris** sejak awal, sementara setiap
orang tua melihat layar sukses. Pendaftaran hanya selamat lewat draft WhatsApp.

## Keputusan
1. Jalur tulis publik dipindah ke RPC `daftar_spmb` (SECURITY DEFINER).
   Validasi, normalisasi nomor WA ke format `62…`, idempotensi 24 jam,
   dan rate limit 5/nomor/hari dikerjakan di server.
2. Policy `anon_insert_spmb_validated` dihapus — publik tidak lagi bisa
   menulis langsung ke tabel. Anon tetap **tidak bisa membaca** data pendaftar.
3. Penomoran dipindah dari `COUNT(*)+1` (rawan duplikat) ke tabel
   `spmb_counter` dengan UPSERT atomik + unique index pada `no_pendaftaran`.
4. Frontend: panel sukses **hanya** tampil bila server mengembalikan nomor
   pendaftaran. Bila gagal → panel kuning "Belum Tersimpan", isian dipertahankan,
   tombol coba lagi + kirim manual WhatsApp.
5. `window.open` otomatis dihapus (rawan diblokir popup blocker + isu privasi).
   WhatsApp kini dibuka lewat klik eksplisit orang tua.

## Aturan yang harus dipegang ke depan
- Jangan pernah memakai `.select()` di belakang `.insert()` pada tabel yang
  tidak punya policy SELECT untuk role pemanggil.
- Sukses UI **tidak boleh** ditampilkan di luar cabang keberhasilan backend.
- Setiap penambahan tabel publik: cek `get_advisors` sebelum rilis.
