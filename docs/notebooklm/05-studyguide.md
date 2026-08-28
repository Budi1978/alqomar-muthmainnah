# 05 — Generate Study Guide + Q&A

> Buat ringkasan, kisi-kisi, dan latihan soal otomatis dari materi.

## Untuk apa?

Study guide adalah **panduan belajar terstruktur** yang biasanya berisi:

- **Ringkasan poin-poin penting** dari materi
- **Definisi istilah kunci** (glosarium)
- **Q&A (pertanyaan & jawaban)** untuk latihan
- **Kisi-kisi ujian**
- **Kartu belajar (flashcards)**

Sangat berguna untuk:

- Guru menyiapkan **latihan soal**
- Guru bikin **kisi-kisi UTS/UAS**
- Siswa **review** sebelum ujian
- **Handout** yang dibagikan ke siswa
- **Kartu belajar** untuk hafalan

## Alur singkat

```
1. Pastikan notebook punya materi lengkap
        ↓
2. Buka Claude Code (claude)
        ↓
3. Ketik prompt study guide
        ↓
4. Buka NotebookLM → Studio → Study Guide
        ↓
5. Copy-paste ke Word, atau export PDF
```

## Contoh prompt

### 1. Ringkasan singkat

> Buatkan study guide singkat (1 halaman) dari notebook "IPA SDIT - Sistem Pencernaan". Berisi: definisi, organ-organ utama, dan fungsi. Bahasa Indonesia untuk siswa kelas 5.

### 2. Kisi-kisi ujian

> Buatkan kisi-kisi UAS dari notebook "Fiqih SMPIT - Semester Ganjil". Format: 10 pertanyaan pilihan ganda, 5 pertanyaan essay singkat, dan 3 studi kasus. Sertakan kunci jawabannya.

### 3. Q&A untuk drilling

> Buatkan 20 pertanyaan dan jawaban dari notebook "Sejarah Islam - Perang Badar". Level SMP. Format flashcard: satu pertanyaan, satu jawaban singkat maksimal 2 kalimat.

### 4. Glosarium

> Buatkan glosarium (daftar istilah + definisi) dari notebook "Aqidah Kelas 6 - Sifat Allah". Bahasa Indonesia, disertai istilah Arab dan harakatnya. Minimal 20 istilah.

### 5. Ringkasan lengkap bab

> Buatkan ringkasan lengkap 3 halaman dari notebook "Bahasa Arab Kelas 4 - Bab Keluarga". Berisi: kosakata baru, contoh kalimat, tata bahasa, dan latihan.

### 6. Rangkuman untuk siswa yang kesulitan

> Buatkan rangkuman super sederhana (setengah halaman) dari notebook "Matematika SD - Perkalian Dasar". Bahasa yang sangat mudah, banyak contoh nyata, cocok untuk siswa yang butuh remedial.

## Cara ambil hasilnya

Setelah Claude selesai:

1. Buka **NotebookLM di browser**
2. Buka notebook yang tadi
3. Klik tab **"Studio"**
4. Cari kartu **"Study Guide"** yang baru dibuat
5. Klik untuk buka
6. Untuk export:
   - **Copy manual** — klik-drag teks, copy, paste ke Word
   - **Screenshot** untuk simpan sebagai gambar
   - Beberapa notebook punya opsi **Download** langsung sebagai dokumen

## Tips penting

1. **Spesifik tentang format** — kalau tidak, NotebookLM bikin format default yang mungkin bukan yang Anda mau.
2. **Sebutkan level kesulitan** — "level SD kelas 2" vs "level SMP kelas 8" vs "level guru".
3. **Sebutkan jumlah pertanyaan** kalau bikin Q&A — kalau tidak, biasanya cuma 5-8 pertanyaan.
4. **Sebutkan format jawaban** — pilihan ganda, essay singkat, essay panjang, benar-salah, isian.
5. **Untuk pelajaran Islam**, minta pertanyaan yang **membangun karakter**, bukan hanya menghafal.

## Contoh workflow lengkap guru Al-Qomar

**Skenario**: Guru IPS SDIT mau bikin paket ujian mid-semester.

**Prompt 1** (kisi-kisi):
> Buatkan kisi-kisi UTS dari notebook "IPS Kelas 5 - Pahlawan Nasional". Format: 15 pilihan ganda + 5 essay singkat. Level kelas 5 SD.

**Prompt 2** (soal ujian):
> Buatkan soal UTS lengkap dari kisi-kisi tadi. Sertakan kunci jawaban di halaman terpisah.

**Prompt 3** (handout belajar untuk siswa):
> Buatkan handout belajar 2 halaman untuk siswa sebagai persiapan UTS ini. Berisi ringkasan materi, tips menghafal, dan 5 contoh soal.

**Prompt 4** (remedial):
> Buatkan versi soal remedial yang lebih mudah, untuk siswa yang belum tuntas. Format: 10 pilihan ganda saja.

Dalam **1 sesi Claude Code**, Anda sudah punya paket ujian lengkap.

## Tips membuat pertanyaan yang bagus

Minta secara eksplisit:

- **Level kognitif Bloom** — "buatkan 3 soal hafalan, 3 soal pemahaman, 3 soal aplikasi, 1 soal analisis"
- **Konteks lokal** — "gunakan contoh dari lingkungan Indonesia / Jakarta / kehidupan siswa muslim"
- **Nilai Islami** — "sertakan referensi ayat/hadits yang relevan"
- **Variasi format** — "campuran pilihan ganda, isian singkat, dan menjodohkan"

## Langkah berikutnya

- [99 — Troubleshooting kalau ada masalah](./99-troubleshooting.md)
- [Kembali ke README](./README.md)
