---
judul: Format Jawaban PKKS
tipe: catatan
tags: [konvensi, pkks]
diperbarui: 2026-11-13
---

# Format Jawaban PKKS

Bagian dari [[index]].

## Ringkasan
Aturan cara menjawab soal PKKS (Kepala Sekolah) untuk Pak Ahmad Budi Setiawan. Berlaku untuk semua soal berikutnya kecuali beliau mengubahnya.

## Detail

**Cara kerja:** Pak Budi mengirim soal satu per satu. Setiap soal dijawab dengan format yang sama.

**Format per soal:**
1. **Pertanyaan X.Y:** kutip indikator penilaian (aspek dan indikator), lalu tanya "Bukti fisiknya apa?"
2. **Tabel per soal** dengan kolom: Bukti dokumen inti | Bukti dokumen pendukung | Bukti dokumen tambahan. Ini format Excel contoh dari Pak Budi (soal 1.1 dan seterusnya).
3. **Setiap dokumen inti punya pendukungnya sendiri** (satu baris per dokumen inti). Contoh: Visi-misi → SK, notulen, daftar hadir, foto, EDS, SWOT, profil, rapor pendidikan. KSP → SK penetapan, notulen, daftar hadir, rapor pendidikan.
4. **Tambahan** diisi hanya jika ada bukti penguat di luar inti dan pendukung. Boleh kosong.
5. Pisahkan antar soal dengan garis `---`.

**Prinsip kualitas (instruksi Pak Budi, 2026-11-13):** tujuan bukan sekadar jawaban yang benar, tetapi jawaban yang **sempurna dengan cara terbaik**. Terapkan ke semua soal PKKS:
1. Pecah indikator menjadi unsur-unsurnya (contoh 1.1: dipahami, berpusat pada murid, selaras pembelajaran mendalam; ditambah "budaya sekolah" jika ada di nama aspek). Setiap unsur wajib punya bukti.
2. Definisi kolom: **inti** = bukti langsung yang membuktikan unsur indikator. **Pendukung** = legalitas dan proses (SK, notulen, daftar hadir, foto, data sumber). **Tambahan** = dampak, tindak lanjut, keberlanjutan, testimoni. Kolom tambahan jangan dibiarkan kosong bila ada bukti dampak.
3. Semua "bukti fisik" dari pengawas wajib masuk. Item dari analisis sendiri ditandai **(+)** agar mudah dihapus.
4. Jangan ada dokumen yang sama muncul di inti dan pendukung pada baris yang sama.
5. Kutip teks indikator persis seperti di rubrik (jangan diringkas). Garis bergelombang di gambar rubrik adalah koreksi ejaan Word, bukan coretan.
6. Tahap siklus (misal SPMI: pemetaan, rencana, pelaksanaan, monev, tindak lanjut) masing-masing menjadi baris inti sendiri.
7. Soal keuangan dan BOS: beri peringatan regulasi bila relevan (ARKAS, SPJ, transparansi).
Versi terbaru: `Bukti-Dokumen-PKKS-Aspek-1-4-v2` (docx dan md), 74 baris.

**Paket dokumen bukti per komponen (diminta 2026-11-13):** untuk tiap komponen (mulai 1.1) buat satu file Word FORMAL, bukan sekadar kumpulan lampiran. Pak Budi menolak versi kumpulan lampiran ("beda banget dengan dokumen SD yang rapi") dan juga tidak mau Claude minta contoh dokumen SD: rancang sendiri strukturnya. Struktur final (versi 2): cover (logo placeholder), lembar pengesahan, kata pengantar, daftar isi, daftar tabel, daftar gambar (halaman romawi), Bab I Pendahuluan (latar belakang, dasar hukum, tujuan, ruang lingkup, sistematika), Bab II Profil dan Landasan Konseptual (+Gambar), Bab III Uraian per unsur indikator, Bab IV Bukti inti/pendukung/tambahan (tabel), Bab V Penutup (kesimpulan, tindak lanjut), daftar pustaka, lalu Lampiran (dokumen bukti nyata berkode 1.0, 1.1, ... dengan checklist). Nomor halaman daftar isi dihitung dua kali jalan (render PDF lalu isi nomor), jadi harus dibangun ulang bila isi berubah. Skrip: `build-11.js`, `middle.js`, `assemble.py`, `extract.py`, `figs.py` di scratchpad sesi (tidak ikut repo). Aturan:
- Isi yang diketahui (identitas sekolah, visi, misi, nama kepala sekolah) diambil dari sumber nyata. Visi dan misi diambil dari website alqomar.sch.id.
- Data hasil (wawancara, capaian, daftar hadir, foto, nomor SK, tanggal) jangan dikarang: beri placeholder sorotan kuning.
- Bagian usulan diberi label "usulan, sesuaikan". Dasar hukum SK diverifikasi sebelum ditandatangani.
- A4 portrait, kop surat YPIPC dan Al-Qomar untuk SK dan notulen. Skrip pembangun: `build-11.js` di scratchpad (tidak ikut repo).
- Hasil 1.1: `Dokumen-Komponen-1.1-Formal.docx` (48 halaman, 29 lampiran).

**Gaya:** Bahasa Indonesia, tegas, padat, tanpa kalimat pembuka atau penutup yang tidak perlu. Jangan tambahkan catatan panjang kecuali diminta.

**Pertanyaan yang menjadi acuan:** rubrik 1.1 sampai 1.5 (Visi-misi; Perencanaan Berbasis Data; Kurikulum dan Pembelajaran; Pengelolaan Peserta Didik; Pendidik dan Tenaga Kependidikan).

**Koreksi yang pernah diberikan Pak Budi (jangan diulang):**
- Jangan memasukkan foto visi-misi sebagai dokumen inti. Foto masuk pendukung.
- Dokumen inti 1.1 adalah visi-misi, KSP, dan hasil wawancara warga sekolah.
- Pada 1.1, rapat kepala sekolah, SK, daftar hadir, dan foto pembentukan visi-misi masuk pendukung visi-misi.
- Jawaban dari pengawas boleh digabung dengan jawaban Claude, tetapi formatnya harus sama dengan format di atas.

## Tautan Terkait
- [[konteks-proyek]]
- [[catatan/panggilan-user]]
