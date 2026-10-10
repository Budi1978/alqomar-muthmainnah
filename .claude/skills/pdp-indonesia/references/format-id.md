# Format Identitas Indonesia — Cara Mengenali & Membedakan

Semua contoh di bawah fiktif.

## Deretan 16 digit — paling sering tertukar

| Jenis | Struktur | Cara bedakan |
|---|---|---|
| **NIK** | `PP KK CC DDMMYY SSSS` — provinsi, kabupaten/kota, kecamatan, tgl lahir, nomor urut | Digit 7–8: 01–31 laki-laki, **41–71 perempuan** (tanggal + 40). Digit 9–10 bulan 01–12 |
| **No. KK** | Sama 6 digit wilayah, lalu **tanggal penerbitan** KK, lalu urut | Bentuk identik dengan NIK. Hanya bisa dibedakan dari label kolom/kata kunci |
| **NUPTK** | 16 digit, tidak berstruktur wilayah | Hanya dari kata kunci "NUPTK" |
| **NPWP 16 digit** | = NIK pemilik (orang pribadi, Coretax 2024) atau `0` + NPWP 15 digit lama (badan) | Kata kunci "NPWP"; untuk badan diawali `0` |
| **Kartu kredit/debit** | 16 digit lolos **Luhn**, awalan 4 (Visa), 51–55/22xx (Mastercard), 35 (JCB) | Luhn; NIK hampir tidak pernah lolos Luhn secara kebetulan |

Kode provinsi 2 digit yang sah: 11–19, 21 (Sumatra), 31–36 (Jawa+Banten), 51–53, 61–65, 71–76, 81–82, 91–97. Jakarta Barat = `3173`, Kalideres = `317301`.

## Deretan 10 digit

| Jenis | Ciri |
|---|---|
| **NISN** | 10 digit, sering diawali `0`; digit 2–3 ≈ dua digit tahun lahir (`0115…` ≈ lahir 2015). Milik anak → **spesifik** |
| **Nomor porsi haji** | 10 digit, 2 digit awal = kode provinsi (`31xx…` DKI) |
| **Rekening BCA / BNI / BSI** | 10 digit. BSI eks-BSM 7 digit juga ada |
| **No. HP tanpa 0** | `8xxxxxxxxx` — biasanya ada `+62` di depan |

## Lainnya

| Jenis | Format | Catatan |
|---|---|---|
| **NIS** (nomor induk sekolah) | 4–9 digit, internal sekolah | Umum tapi milik anak → spesifik |
| **NIP** (ASN) | 18 digit: `YYYYMMDD YYYYMM J NNN` | Mengandung tgl lahir & TMT |
| **NPWP lama** | `XX.XXX.XXX.X-XXX.XXX` (15 digit) | Masih muncul di faktur/bukti potong lama |
| **Paspor RI** | 1 huruf + 7 digit (`C1234567`), e-paspor baru bisa 2 huruf + 7 digit | Huruf kapital, kadang ada spasi |
| **Rekening Mandiri** | 13 digit | |
| **Rekening BRI** | 15 digit | |
| **Rekening BTN** | 16 digit (bisa tertukar NIK!) | Pakai kata kunci |
| **Rekening CIMB/Permata/Danamon** | 10–13 digit | |
| **Virtual account** | 16–18 digit, prefix bank + kode institusi | Bukan identitas pribadi, tapi bisa dipetakan ke siswa |
| **HP** | `08xx` 10–13 digit, `+62 8xx`, `62 8xx` | Pemisah `-`, spasi, titik umum |
| **Tanggal lahir** | `DD/MM/YYYY`, `DD-MM-YYYY`, `25 April 2016` | Dengan kata kunci "lahir/TTL" |
| **NPSN** | 8 digit, identitas **sekolah** | Bukan data pribadi, boleh publik |
| **NSM / NPYP** | Identitas lembaga | Bukan data pribadi |

## Apa yang tidak bisa dideteksi mesin

- **Nama** orang (apalagi nama Arab/Indonesia tanpa pola).
- **Alamat** rumah selain pola "Jl." yang terlalu umum.
- **Foto** wajah, scan KTP/KK/paspor sebagai gambar.
- **Kesehatan / kebutuhan khusus / riwayat disiplin** dalam kalimat bebas.
- **Status ekonomi** (penerima PIP, keringanan SPP) yang tertulis sebagai kategori.

Untuk ini: cek kolom dan isi secara manual sebelum file keluar.

## Validasi yang disediakan script

- `nik_struktur_ok`: provinsi sah, DD 01–31/41–71, MM 01–12, urut bukan 0000. **Hanya struktur**, bukan kebenaran data di Dukcapil.
- `luhn_ok`: kartu pembayaran.
- `hp_normal`: `+62`/`62` → `08`, panjang 10–13.
- NPWP: 15 atau 16 digit; 16 digit diverifikasi sebagai NIK.
