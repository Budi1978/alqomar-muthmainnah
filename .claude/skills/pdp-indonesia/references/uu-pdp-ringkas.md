# UU No. 27 Tahun 2022 — Ringkasan Operasional untuk Sekolah & Travel

Disahkan 17 Oktober 2022, masa transisi 2 tahun, **berlaku penuh 17 Oktober 2024**. Ini ringkasan kerja, bukan tafsir hukum. Verifikasi pasal ke teks UU bila dipakai untuk dokumen resmi.

## Kategori data (Pasal 4)

**Umum** (ayat 1): nama lengkap, jenis kelamin, kewarganegaraan, agama, status perkawinan, dan data yang **dikombinasikan** sehingga mengidentifikasi orang (NIK, HP, email, alamat, paspor).

**Spesifik** (ayat 2), perlindungan lebih ketat:
- data kesehatan
- data biometrik (foto wajah untuk pengenalan, sidik jari)
- data genetika
- catatan kejahatan
- **data anak** → seluruh data siswa KB–SMP
- **data keuangan pribadi** → rekening, tunggakan, gaji, mutasi bernama
- data lain sesuai ketentuan

Implikasi langsung: hampir semua data yang ditangani Al-Qomar adalah spesifik karena milik anak. Jangan perlakukan daftar siswa seperti daftar kontak biasa.

## Peran

| Peran | Siapa di konteks Ahmad |
|---|---|
| **Subjek data** | Siswa (diwakili wali), wali murid, guru/karyawan, jamaah |
| **Pengendali** | YPIPC/Al-Qomar untuk data sekolah; PT Tanur Muthmainnah untuk data jamaah |
| **Prosesor** | Supabase, Hostinger, Google Workspace, vendor aplikasi, agen Saudi (sebagian), bank |

Pengendali bertanggung jawab atas prosesor yang dipilihnya.

## Dasar pemrosesan (Pasal 20)

Pilih satu per jenis pemrosesan dan catat:
1. **Persetujuan** eksplisit (tertulis/terekam) — untuk foto publikasi, broadcast promosi, testimoni.
2. **Pelaksanaan perjanjian** — formulir PPDB, kontrak kerja guru, perjanjian jamaah.
3. **Kewajiban hukum** — Dapodik, Siskopatuh, laporan pajak, BOS.
4. Kepentingan vital, tugas publik, kepentingan sah lainnya (jarang dipakai di sini).

Persetujuan untuk anak diberikan **wali/orang tua** (Pasal 25). Persetujuan harus bisa ditarik, dan penarikan harus semudah pemberiannya.

## Hak subjek data (Pasal 5–13) yang paling sering muncul

- Tahu siapa pengendali, dasar, tujuan (→ ada **kebijakan privasi** singkat di formulir PPDB & perjanjian jamaah).
- Akses & salinan data miliknya.
- Perbaikan data yang salah (NISN, nama di paspor).
- Hapus / akhiri pemrosesan setelah tujuan selesai (alumni, jamaah pulang).
- Menarik persetujuan (foto anak di Instagram).
- Mengadu & menuntut ganti rugi.

Target respons permintaan subjek: **3×24 jam** untuk konfirmasi penerimaan, penyelesaian maksimal 72 jam untuk akses sederhana (praktik baik; UU memberi batas 3×24 jam untuk sebagian hak).

## Kewajiban pengendali (Pasal 20–50) — checklist

- [ ] Dasar pemrosesan tercatat per jenis data.
- [ ] Informasi/pemberitahuan ke subjek saat data dikumpulkan (formulir PPDB, formulir jamaah, kontrak guru).
- [ ] **Minimalisasi**: kumpulkan hanya yang perlu. PPDB tidak perlu NPWP ortu; manifest hotel tidak perlu NIK.
- [ ] Akurasi & pembaruan.
- [ ] **Keamanan teknis & organisasi**: akses berbasis peran, RLS Supabase, enkripsi file arsip, HP operasional terkunci.
- [ ] Pencatatan aktivitas pemrosesan (siapa akses apa, kapan) untuk tabel sensitif.
- [ ] Perjanjian dengan prosesor (vendor aplikasi, agen) memuat klausul PDP.
- [ ] **Pemberitahuan kebocoran 3×24 jam** (Pasal 46): tertulis ke subjek data dan lembaga pengawas PDP; isi: data apa yang bocor, kapan & bagaimana, langkah penanganan & pemulihan.
- [ ] Penghapusan/pemusnahan setelah masa retensi (Pasal 43–44).
- [ ] Transfer ke luar negeri (Pasal 56): negara tujuan punya perlindungan setara, **atau** ada perlindungan memadai & mengikat, **atau** persetujuan subjek. Untuk Saudi: andalkan **persetujuan tertulis jamaah** di perjanjian + kirim data seperlunya.
- [ ] Pejabat/petugas PDP (Pasal 53) wajib bila pemrosesan berskala besar data spesifik. Sekolah dengan ratusan siswa & travel dengan ribuan jamaah → **tunjuk satu orang** sebagai petugas PDP (boleh rangkap), tuliskan dalam SK.

## Sanksi (Pasal 57, 65–70)

- Administratif: teguran, penghentian sementara pemrosesan, penghapusan data, **denda sampai 2% pendapatan tahunan**.
- Pidana: memperoleh/mengungkap/menggunakan data pribadi yang bukan miliknya secara melawan hukum — pidana penjara 4–6 tahun dan/atau denda 4–6 miliar; korporasi denda sampai 10× dan sanksi tambahan.

Risiko nyata di sini bukan denda miliaran, tapi **pengaduan satu wali murid** yang viral karena data anaknya tersebar di grup WA. Kerusakan reputasi PPDB lebih mahal dari sanksinya.

## Prosedur insiden (siap pakai)

**Jam 0–2**: hentikan sumber (cabut link share, tarik file dari grup, kunci akun). Catat waktu, apa, berapa orang.
**Jam 2–24**: nilai dampak (data apa, kategori spesifik?, berapa subjek). Siapkan daftar subjek terdampak.
**≤ 72 jam**: kirim pemberitahuan tertulis ke subjek (WA 1:1 atau surat) dan ke lembaga pengawas. Template:

> Kepada Yth. Bapak/Ibu [nama wali/jamaah],
> Pada [tanggal], kami mengetahui bahwa [jenis data: nama, NISN, nomor HP] Ananda/Bapak/Ibu [sempat dapat diakses pihak yang tidak berwenang / terkirim ke penerima yang keliru] karena [sebab singkat]. Kami telah [tindakan: menarik file, menutup akses, mengganti tautan] pada [waktu].
> Risiko yang mungkin timbul: [mis. hubungan dari pihak tak dikenal mengatasnamakan sekolah]. Mohon waspadai pesan yang meminta pembayaran atau data tambahan; sekolah/Tanur tidak pernah meminta OTP atau transfer ke rekening pribadi.
> Pertanyaan dapat disampaikan ke [petugas PDP, nomor]. Kami mohon maaf atas kejadian ini.
> [Nama, jabatan, lembaga]

**Setelahnya**: catat di `memory/keputusan/` apa yang diubah supaya tidak terulang.

## Retensi (usulan default, sesuaikan SK Yayasan)

| Data | Simpan | Lalu |
|---|---|---|
| Calon siswa PPDB tidak diterima/mundur | 1 tahun ajaran | hapus |
| Siswa aktif & alumni (rapor, ijazah) | permanen untuk arsip akademik (kewajiban sekolah) | akses dibatasi, kontak ortu alumni diperbarui dengan persetujuan |
| Keuangan sekolah (SPP, BOS) | 10 tahun (ketentuan pajak & BOS) | arsip terkunci |
| Pelamar guru tidak diterima | 6 bulan | hapus |
| Jamaah (manifest, paspor scan) | 5 tahun (pajak, Siskopatuh, komplain) | hapus scan dokumen, sisakan ringkasan |
| Foto kegiatan dengan wajah anak | selama ada persetujuan | turunkan bila wali menarik persetujuan |
| Log akses sistem | 1 tahun | rotasi |
