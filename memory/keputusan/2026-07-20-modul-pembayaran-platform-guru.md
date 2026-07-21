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

## Update 2026-07-21 (sore): data & akun LENGKAP
- **Supabase MCP kini ter-scope ke org sekolah** (project lnacvtvufgsxnqhuezox
  + website) — Claude bisa eksekusi SQL langsung, tidak lagi lewat SQL Editor
  manual. (Org Tanur tidak lagi ter-scope dari koneksi ini.)
- 561 siswa terimport (KB 6, TKIT 44, SDIT 310, SMPIT 201) di 22 kelas
  TA 2026/2027; 22 akun wali kelas (wali.<kelas>@alqomar.id, password pola
  Wali<KELAS>#2026) dibuat via SQL + diperbaiki kolom token NULL-nya
  (bug login klasik akun buatan SQL).
- Verifikator: ahmadbudisetiawan1@gmail.com (password app di-reset manual).
- NIS sementara tersisa: 2460B (Fajar Okta, 9B), 2610B (Endah Zalfa, 9A) —
  menunggu revisi TU.
- guru.alqomar.id = app HTML lama (production, jangan diganggu). App Next.js
  di platform-guru-alqomar-hc0587i27.vercel.app (Deployment Protection OFF,
  project Vercel TIDAK git-connected — aman push ke GitHub).
- TODO berikutnya: uji end-to-end Bu Ellida (5A) → bagikan 22 akun → alamat
  cantik permanen (mis. bayar.alqomar.id) → merge halaman ganti-password →
  restyle tema hijau-emas → rencana migrasi app lama.

## Update 2026-07-21 (malam): LAUNCH READY
- **Alamat resmi app pembayaran: https://alqomar-guru.vercel.app** (alias
  stabil; tiap deploy baru cukup `vercel deploy` preview + re-alias — URL
  tidak pernah berubah). guru.alqomar.id tetap app HTML lama (production).
- Uji end-to-end LULUS: Bu Ellida (5A) input SPP Juli + foto bukti →
  tampil di antrian kepsek dengan nominal terkunci Rp550.000.
- Bugfix penting: RLS siswa/kelas tak bisa dibaca kepsek → tambah policy
  kepsek_read_siswa & kepsek_read_kelas (is_kepsek()).
- Badge merah antrian verifikasi di sidebar kepsek (refresh 60 dtk) +
  halaman /dashboard/ganti-password — PR #5, sudah deploy.
- Kelas seed 2025/2026 (22 kelas kosong) sudah dihapus.
- Backlog: restyle hijau-emas, NIS 2460B/2610B, rencana migrasi app lama.

## Update 2026-07-22: infrastruktur final
- **Alamat resmi: https://spp.alqomar.id** (project Vercel baru `alqomar-spp`,
  git-connected ke repo main → AUTO-DEPLOY setiap merge; tidak ada lagi
  deploy manual dari laptop). alqomar-guru.vercel.app = cadangan/transisi.
- guru.alqomar.id tetap app HTML lama, project Vercel lama, tidak tersentuh.
- Fitur cicilan (PR #6) live: DK/DB diinput manual per cicilan, dibatasi
  sisa tagihan (trigger DB), otomatis "LUNAS" saat tercukupi. SPP tetap
  nominal baku terkunci. Tarif kegiatan SDIT: kelas 1 = 1,8jt; 2-6 = 1,7jt.
- PR #7: menu "Rekapan" kepsek — per lembaga TK/SD/SMP, per kelas 3 tabel
  (SPP ceklis bulan; DK & DB kolom angsuran + tanggal + LUNAS/Sisa),
  read-only by design (terisi otomatis dari verifikasi), tombol Cetak.
- PR #8: form wali kelas jadi TIGA SEKSI sekaligus (SPP ceklis bulan +
  DK nominal + DB nominal, satu bukti transfer) untuk transfer gabungan;
  satu baris pembayaran per komponen, bukti_path sama.
- PR #9: metode tunai (kolom pembayaran.metode; bukti opsional untuk
  tunai; kepsek verifikasi setelah uang diterima) + tanggal bayar di
  sel rekapan. PR #10-11: Rekapan format buku sekolah persis (kop
  Walas via kelas.wali_nama, kolom L|P, tanggal di sel bulan,
  ANGSURAN I-V, Jumlah = total berjalan + LUNAS otomatis).
- PR #12: Rekapan INTERAKTIF — kepsek klik sel kosong utk catat
  langsung (auto-terverifikasi, RLS insert diubah: kepsek bebas
  status), klik sel terisi utk detail/hapus. Filosofi Pak Budi:
  "sistem otomatis wajib punya jenset manual".
- PR #13: tombol Export Excel di Rekapan (satu sheet per kelas,
  format buku) — backup offline.
- PR #14: semua sel angsuran kosong bisa diklik (masuk berurutan).

## KEPUTUSAN ARSITEKTUR FINAL (Pak Budi, 2026-07-22)
**DUA APLIKASI PERMANEN, TIDAK DIGABUNG:**
- guru.alqomar.id = akademik (app HTML lama) — dikembangkan sendiri
- spp.alqomar.id = keuangan (Next.js) — dikembangkan sendiri
Alasan: fokus per domain, pengembangan independen, insiden salah satu
tidak menjatuhkan yang lain. Rencana "migrasi besar" DIBATALKAN.

- Backlog spp.alqomar.id: restyle hijau-emas, NIS 2460B/2610B
  (menunggu TU), grouping bundel transfer gabungan di antrian.

## Catatan penting
- **Supabase MCP sesi Claude hanya ter-scope ke project "command center"
  (Tanur)** — TIDAK bisa akses project Platform Guru Tokyo. Migration
  harus dijalankan manual via Supabase SQL Editor (konvensi repo memang
  begitu).
- Setelah merge: jalankan migration, set `app_roles` untuk email kepsek,
  isi `tarif` per jenjang TA 2026/2027, pastikan `kelas.wali_kelas` terisi.
- Saran jangka menengah: buka rekening atas nama yayasan/sekolah.
