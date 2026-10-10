# Peta Data & Aturan Berbagi — Al-Qomar & Tanur

## Di mana data orang berada

| Sistem | Data | Catatan risiko |
|---|---|---|
| **Supabase `gzcgyqntluhxxrvbcwin`** (web alqomar.sch.id) | tabel `berita` (publik), tabel lain bila ada (PPDB online, SPP) | Anon key terekspos di HTML. **Hanya `berita` yang boleh readable anon**. Tabel lain wajib RLS + auth |
| **Supabase Tokyo** (guru.alqomar.id, spp.alqomar.id) | guru, siswa, nilai, absensi, tagihan SPP per anak | Data anak + keuangan = spesifik. Role wali hanya lihat anaknya sendiri |
| **commandcenter.tanur.id** | jamaah, pembayaran, paspor, KPI tim | Akses per divisi; agen tidak boleh lihat jamaah agen lain |
| **Google Drive YPIPC** | formulir PPDB scan, KK/akta, SK, payroll | Link "anyone with link" = kebocoran. Share ke email tertentu |
| **Dapodik / EMIS / SIMPATIKA** | identitas siswa & guru (kewajiban hukum) | Operator sekolah saja; jangan ekspor massal ke Drive pribadi |
| **Siskopatuh / Nusuk / Sistem visa** | paspor, foto, tgl lahir jamaah | Kirim seperlunya; sistem resmi = dasar "kewajiban hukum" |
| **HP operasional / WA** | grup kelas, grup jamaah, chat agen | Sumber bocor paling sering. Grup ≠ saluran untuk data per orang |
| **Email info@purnamacendekia.sch.id** | lampiran PPDB, lamaran guru | Hapus lampiran pelamar tidak diterima setelah 6 bulan |
| **Laptop/HP pribadi pengurus** | file Excel rekap | Enkripsi disk, kunci layar, jangan simpan rekap bernama di HP |

## Siapa boleh terima apa (matriks default)

| Penerima | Boleh | Tidak boleh |
|---|---|---|
| **Yayasan (YPIPC)** | rekap agregat: jumlah siswa, total SPP terkumpul, tunggakan per kelas (angka), daftar guru + jabatan | tunggakan per nama anak tanpa alasan, rekening wali, NIK siswa |
| **Dinas Pendidikan / Kemendikbud** | yang diminta formulir resmi (Dapodik, BOS) | ekspor bebas ke email pribadi petugas |
| **Komite sekolah** | agenda, program, laporan keuangan komite agregat | data per siswa, data gaji guru |
| **Wali murid lain / grup kelas** | pengumuman kelas, jadwal | nilai, absensi, tagihan, kondisi kesehatan anak lain |
| **Vendor (catering, seragam, fotografer)** | nama panggilan + ukuran/kelas | NIK, alamat, HP wali |
| **Kemenag (Siskopatuh)** | sesuai format pelaporan PPIU | lebih dari format |
| **Agen Saudi / hotel / maskapai / Nusuk** | nama sesuai paspor, nomor paspor, tgl lahir, jenis kelamin, foto paspor bila wajib visa | NIK, KK, HP keluarga, rekening, data kesehatan selain yang wajib |
| **Muthawwif / tour leader** | manifest nama, kamar, kontak darurat 1 orang, catatan kesehatan yang relevan (kursi roda, obat rutin) | scan paspor massal di HP pribadi |
| **Agen/sub-agen Tanur** | status jamaah yang **mereka** daftarkan | daftar jamaah agen lain, harga nett agen lain |
| **Publik (web, Instagram)** | prestasi dengan nama panggilan/inisial & izin wali, foto kegiatan dengan izin | nama lengkap + kelas + foto wajah anak tanpa izin tertulis; daftar jamaah berangkat |

## Checklist RLS Supabase (jalankan via `list_tables` / `execute_sql` read-only)

```sql
-- tabel mana yang RLS-nya mati?
select schemaname, tablename, rowsecurity
from pg_tables where schemaname = 'public' order by 1,2;

-- policy per tabel
select tablename, policyname, roles, cmd, qual
from pg_policies where schemaname = 'public' order by 1,2;

-- kolom yang namanya mencurigakan (data orang)
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and column_name ~* '(nik|kk|nisn|paspor|passport|rekening|npwp|hp|phone|telp|email|lahir|alamat|address)'
order by 1,2;
```

Vonis minimal:
- Tabel berisi kolom di atas → `rowsecurity = true` **dan** tidak ada policy `for select to anon` tanpa filter.
- `berita` → boleh `select` anon, tapi **tanpa** kolom data orang (penulis cukup nama pena).
- Storage bucket scan KTP/paspor → **private**, akses lewat signed URL berumur pendek.

Perubahan policy: lewat skill `security-review`, minta persetujuan user, uji di branch Supabase dulu.

## Template persetujuan (consent)

### Wali murid — PPDB (masukkan ke formulir & web)

> **Pernyataan Persetujuan Pengolahan Data Pribadi**
> Saya, wali dari calon peserta didik di atas, menyatakan bahwa data yang saya isi adalah benar dan memberikan persetujuan kepada Yayasan Pendidikan Islam Purnama Cendekia (Al-Qomar Muthmainnah) untuk mengolah data pribadi saya dan anak saya untuk keperluan: (1) proses PPDB dan administrasi akademik, (2) pelaporan wajib ke Kemendikbud/Dapodik, (3) komunikasi sekolah–wali.
> ☐ Saya **setuju** foto/video kegiatan anak saya ditampilkan di media resmi sekolah (web, Instagram, YouTube) tanpa nama lengkap. *(opsional, dapat ditarik kapan saja melalui tata usaha)*
> Data disimpan selama anak terdaftar dan sesuai masa retensi arsip sekolah. Saya berhak mengakses, memperbaiki, dan meminta penghapusan data melalui petugas PDP sekolah: [nama, nomor].
> Tegal Alur, ____ / ____ / ______ — Tanda tangan: ______________

### Jamaah — perjanjian umroh/haji (pasal tambahan)

> **Pasal [x] — Data Pribadi**
> Jamaah memberikan persetujuan kepada PT Tanur Muthmainnah untuk mengolah data pribadi (identitas, paspor, kesehatan yang relevan, kontak darurat) untuk keperluan pengurusan visa, tiket, akomodasi, pelaporan ke Kementerian Agama (Siskopatuh), dan layanan selama perjalanan. Jamaah memahami bahwa sebagian data (nama sesuai paspor, nomor paspor, tanggal lahir, jenis kelamin, foto paspor) **dikirim ke penyedia layanan di Arab Saudi** sejauh diperlukan untuk penerbitan visa dan akomodasi, dan menyetujui pengiriman tersebut.
> Data disimpan paling lama 5 tahun setelah kepulangan untuk kewajiban pelaporan dan perpajakan, kemudian dihapus atau dianonimkan. Jamaah berhak mengakses dan memperbaiki datanya melalui [petugas PDP Tanur, nomor].

### Guru/karyawan — klausul kontrak

> Pihak Kedua menyetujui pengolahan data pribadinya (identitas, NPWP, rekening, data keluarga untuk BPJS) oleh Pihak Pertama untuk keperluan kepegawaian, penggajian, BPJS, pelaporan pajak, dan pelaporan ke Kemendikbud (Dapodik/SIMPATIKA). Data disimpan selama hubungan kerja dan 10 tahun sesudahnya untuk kewajiban perpajakan.

## Aturan broadcast WA (tambahan untuk `wa-broadcast-templates`)

- Broadcast = **satu isi untuk semua**. Tidak ada nama anak, nominal, nilai, status pembayaran.
- Tagihan SPP: pesan 1:1 dari nomor resmi, format "Ananda [nama panggilan] kelas [x], tagihan bulan [x]: Rp [x]". Jangan sebut tunggakan di grup kelas.
- Pengumuman keberangkatan jamaah: sebut nomor grup/kloter, bukan daftar nama + paspor.
- Jangan kirim foto KTP/paspor lewat grup. Minta lewat formulir atau 1:1 lalu hapus dari HP setelah masuk sistem.

## Petugas PDP (usulan SK)

Satu orang per lembaga, boleh rangkap: TU/operator Dapodik untuk sekolah; admin dokumen/visa untuk Tanur. Tugas: jadi kontak pengaduan, pegang daftar "siapa akses apa", jalankan scan ini sebelum data keluar, catat insiden.
