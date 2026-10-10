---
name: pdp-indonesia
description: "Perlindungan data pribadi format Indonesia (UU 27/2022 PDP) untuk Al-Qomar Muthmainnah & Tanur Muthmainnah/MEJ. WAJIB dipakai sebelum data siswa, wali murid, guru, atau jamaah keluar dari lingkungan kerja: dipaste ke chat/artifact, dikirim ke Gamma/Canva/Notion/Slack, dibroadcast WA, dibagikan ke pihak luar (Dinas, Kemenag, agen Saudi, vendor), atau dipublikasikan di web. Juga saat user minta: cek data pribadi, redaksi/anonimkan/samarkan NIK-NISN-paspor-rekening-HP, audit UU PDP, template persetujuan (consent) wali murid/jamaah, respons kebocoran data, cek RLS Supabase untuk tabel berisi data orang. Mengenali NIK, KK, NISN/NIS, NIP, NUPTK, NPWP (15 & 16 digit), paspor RI, nomor porsi haji, rekening bank Indonesia, kartu, HP +62/08, email, tanggal lahir."
---

# PDP Indonesia — Jaga Data Siswa, Guru & Jamaah

Skill ini **menahan** data pribadi supaya tidak bocor lewat jalur kerja sehari-hari. Bukan skill hukum penuh. Dasar: **UU No. 27/2022 tentang Pelindungan Data Pribadi**, berlaku penuh sejak 17 Oktober 2024.

Posisi Ahmad Budi di mata UU: **Pengendali Data Pribadi** untuk sekolah (YPIPC) dan travel (PT Tanur Muthmainnah). Artinya kewajiban melekat ke lembaga dan ke dia, bukan ke vendor.

## Kapan Skill Ini Menyela Skill Lain

Jalankan **sebelum langkah terakhir** skill-skill ini, tanpa diminta:

| Skill / aksi | Risiko khas | Yang dilakukan |
|---|---|---|
| `ppdb-pipeline`, `rapor-generator`, `soal-generator` (rekap nilai) | NISN, NIK, tgl lahir, nama ortu anak | Scan file sebelum export/kirim; redaksi kolom yang penerima tidak butuh |
| `jamaah-crm`, `manasik-sop-travel` (manifest) | Paspor, NIK, KK, porsi haji, HP | Manifest ke hotel/agen Saudi: hanya nama + paspor, tanpa NIK/KK/HP |
| `tanur-finance-engine`, `cashflow-dashboard`, `excell` (mutasi bank) | Rekening & nama penyetor (data keuangan = **spesifik**) | Laporan ke Yayasan: ringkas per kategori, bukan baris mutasi bernama |
| `hr-sdm-sekolah` (payroll, kontrak) | NIK, NPWP, rekening gaji guru | Slip gaji per orang; rekap ke Yayasan tanpa rekening |
| `wa-broadcast-templates` | Broadcast massal | **Dilarang** NIK/NISN/tagihan nominal per anak di broadcast; pakai pesan 1:1 |
| `konten-web-sekolah`, `presentation-master`, Gamma/Canva | Foto & nama lengkap anak di publik | Nama panggilan atau inisial + izin tertulis wali |
| Supabase (`execute_sql`, `list_tables`) | Tabel publik via anon key | Cek RLS sebelum menyentuh tabel berisi data orang |
| `google-workspace`, Drive share | Link "siapa pun yang punya tautan" | Share ke orang/domain tertentu saja |

## Alur Kerja

1. **Kenali data.** Tanya diri sendiri: ada orang (siswa/wali/guru/jamaah) di data ini? Kalau ya, lanjut.
2. **Scan.**
   ```
   python3 .claude/skills/pdp-indonesia/scripts/pii_scan.py scan <file.csv|.xlsx|.txt|.md|.json>
   ```
   Exit code 1 = ada temuan. Kolom header CSV/XLSX dipakai sebagai konteks (kolom `no_kk` → KK, bukan NIK).
3. **Putuskan minimal data.** Untuk setiap kolom bertanda, jawab: penerima **butuh** ini untuk tugasnya? Tidak → hapus kolom. Ya tapi tidak perlu identitas penuh → `redact --mode mask`. Perlu join antar tabel tanpa identitas → `redact --mode hash --salt <rahasia>`.
   ```
   python3 .claude/skills/pdp-indonesia/scripts/pii_scan.py redact <file> --mode mask --out <file-aman>
   ```
4. **Cek manual yang mesin tidak tangkap:** nama lengkap, alamat rumah, foto wajah anak, catatan kesehatan/kebutuhan khusus, agama (umum tapi sensitif), status ekonomi (penerima keringanan SPP/PIP).
5. **Serahkan versi aman** + satu kalimat ke user: apa yang diredaksi dan kenapa.
6. **Catat** ke `memory/` kalau ada keputusan baru soal data (siapa boleh terima apa).

## Aturan Keras (tidak ada pengecualian tanpa persetujuan user)

- **Jangan paste** NIK, KK, paspor, rekening, atau tabel berisi nama+HP ke chat, artifact publik, Gamma, Canva, Notion, Slack, Zoom canvas. Pakai versi redaksi.
- **Data anak = data pribadi spesifik** (Ps. 4 ayat 2 huruf e). Semua data siswa KB–SMP masuk kategori ini. Perlindungan ekstra, persetujuan dari **wali**.
- **Data keuangan pribadi = spesifik** (huruf f). Rekening wali, tunggakan SPP per nama, mutasi bank bernama.
- **Supabase anon key** boleh terekspos **hanya** kalau RLS tabel tersebut read-only publik dan tabel itu memang konten publik (`berita`). Tabel siswa/jamaah/SPP wajib RLS ketat dan tidak boleh diakses anon.
- **Broadcast WA**: satu pesan untuk banyak orang tidak boleh memuat data orang per orang. Tagihan SPP, nilai, absensi → pesan 1:1 atau portal login.
- **Transfer ke luar negeri** (agen Saudi, hotel, Nusuk): kirim **seperlunya** (nama sesuai paspor, nomor paspor, tgl lahir, jenis kelamin). Jangan sertakan NIK, KK, HP keluarga, rekening. Simpan bukti apa yang dikirim ke siapa, kapan.
- **Kebocoran**: kalau ada indikasi data bocor (file publik, link terbuka, HP hilang berisi manifest), **tulis pemberitahuan dalam 3×24 jam** ke subjek data dan lembaga pengawas (Ps. 46). Lihat `references/uu-pdp-ringkas.md` bagian insiden.
- **Retensi**: data calon siswa PPDB yang tidak diterima dan data jamaah yang sudah pulang tidak disimpan selamanya. Default usul: PPDB tidak diterima 1 tahun, jamaah 5 tahun (kewajiban Siskopatuh/pajak), lalu hapus atau anonimkan.

## Perintah Cepat

```
# scan & lihat konteks 40 karakter
pii_scan.py scan data.xlsx --context 40

# laporan JSON (untuk dilampirkan ke audit)
pii_scan.py scan data.csv --json > audit.json

# redaksi aman untuk kirim ke Yayasan / Dinas
pii_scan.py redact data.csv --mode mask --out data-aman.csv

# pseudonim konsisten untuk analisis lintas tabel (salt JANGAN dicommit)
pii_scan.py redact siswa.csv --mode hash --salt "$PDP_SALT" --out siswa-anon.csv

# validasi struktur satu nilai (tanpa kirim ke mana pun)
pii_scan.py check 3173012505150001 081234567890 01.234.567.8-012.000
```

Script hanya stdlib + openpyxl (sudah ada). Tidak memanggil jaringan. Semua pemrosesan lokal.

## Referensi

| File | Isi |
|---|---|
| `references/format-id.md` | Struktur NIK, KK, NISN, NIP, NUPTK, NPWP, paspor, porsi haji, rekening per bank, HP. Cara membedakan deretan 16 digit |
| `references/uu-pdp-ringkas.md` | Pasal yang relevan, kategori data, hak subjek, kewajiban pengendali, sanksi, prosedur insiden 3×24 jam, retensi |
| `references/konteks-alqomar-tanur.md` | Peta data di kedua lembaga (Supabase, Drive, WA, Siskopatuh, Dapodik), siapa boleh terima apa, template consent wali & jamaah, checklist RLS |

## Batas Skill

- Bukan nasihat hukum final. Untuk sengketa atau pengaduan resmi, rujuk ke konsultan hukum.
- Deteksi berbasis pola. Nama orang, alamat, dan foto **tidak** terdeteksi otomatis. Selalu cek manual langkah 4.
- Tidak mengubah database. Untuk RLS Supabase, skill ini memberi checklist dan query pemeriksaan; perubahan policy dilakukan lewat skill `security-review` + persetujuan user.
