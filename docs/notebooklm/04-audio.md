# 04 — Generate Audio Overview

> Buat audio ringkasan ala podcast dari materi ajar — cocok untuk siswa yang lebih suka mendengar.

## Untuk apa?

Audio overview adalah **file audio (~5-15 menit)** yang berisi dua "host AI" yang **membahas isi notebook** dengan gaya ngobrol santai — mirip podcast.

Sangat berguna untuk:

- **Siswa auditori** yang lebih paham lewat mendengar daripada membaca
- **Materi untuk didengarkan di perjalanan** (di mobil, jalan kaki)
- **Belajar sambil olahraga** untuk siswa/guru
- **Anak yang belum lancar membaca** (KB, TKIT)
- **Review materi cepat** sebelum ujian

## ⚠️ Batasan penting

Sebelum mulai, pahami:

1. **Kualitas Bahasa Indonesia MASIH TERBATAS.** NotebookLM saat ini paling bagus di **Bahasa Inggris**. Untuk Bahasa Indonesia, kadang pronunciation-nya aneh atau intonasi kaku.
2. **Butuh waktu generate** — bisa 3-10 menit untuk audio 10 menit.
3. **Tidak bisa custom suara** — hanya pilihan default dari Google.
4. **Sekali generate, tidak bisa edit** — kalau kurang bagus, harus generate ulang.

Jadi: **coba dulu untuk 1 topik**, kalau hasilnya OK, baru pakai rutin.

## Alur singkat

```
1. Siapkan notebook dengan sumber materi lengkap
        ↓
2. Buka Claude Code (claude)
        ↓
3. Ketik prompt audio overview
        ↓
4. Tunggu 3-10 menit
        ↓
5. Buka NotebookLM di browser → Studio → Audio Overview
        ↓
6. Play, atau download MP3
```

## Contoh prompt

**Audio overview standar (Bahasa Inggris — lebih bagus):**

> Generate an audio overview from the notebook "Fiqih Kelas 4 - Bab Wudhu" in English. Target audience: elementary school teachers.

**Audio overview Bahasa Indonesia (coba dulu):**

> Buatkan audio overview dari notebook "Sejarah Nabi Muhammad SAW" dalam Bahasa Indonesia. Target: siswa SMP. Durasi sekitar 10 menit.

**Audio pendek untuk anak kecil:**

> Buatkan audio overview singkat (5 menit) dari notebook "Kisah Nabi Nuh" dalam Bahasa Indonesia. Gaya bercerita untuk anak TK.

**Audio untuk perjalanan:**

> Buatkan audio overview dari notebook "Rangkuman UTS Bab 1-5". Format ngobrol santai antara dua host. Bahasa Indonesia. Durasi 15 menit — untuk didengarkan siswa saat perjalanan ke sekolah.

## Cara ambil hasilnya

Setelah Claude bilang audio sudah dibuat:

1. Buka **NotebookLM di browser**
2. Buka notebook yang tadi
3. Klik tab **"Studio"**
4. Cari kartu **"Audio Overview"** — biasanya butuh 3-10 menit sampai selesai proses
5. Refresh halaman kalau belum muncul
6. Setelah muncul, klik **▶ Play** untuk dengarkan
7. Klik **titik tiga (⋮) → Download** untuk simpan sebagai MP3

## Tips agar audio berguna

1. **Sumber materi lengkap** = audio kaya. Jangan cuma 1 halaman.
2. **Sebutkan durasi** yang Anda mau (5 menit / 10 menit / 15 menit).
3. **Sebutkan target audiens** — audio untuk TK sangat beda dari audio untuk SMP.
4. **Coba versi Bahasa Inggris dulu** untuk pelajaran umum (IPA, matematika) — kualitas jauh lebih bagus.
5. **Untuk materi Bahasa Indonesia yang wajib** (Bahasa Indonesia, PPKn, Sejarah Indonesia), tetap pakai Bahasa Indonesia meskipun agak kaku.
6. **Materi Islam** — hati-hati, pronunciation istilah Arab bisa salah. Preview dulu sebelum diberikan ke siswa.

## Use case konkret Al-Qomar

**Guru TKIT** — audio cerita Nabi untuk didengarkan siswa sebelum tidur (via aplikasi ortu):

> Buatkan audio 10 menit dari notebook "Kisah 25 Nabi - Nabi Ibrahim". Gaya bercerita untuk anak TK, Bahasa Indonesia sederhana.

**Guru SDIT** — audio review UTS untuk kirim ke grup WA ortu:

> Buatkan audio 15 menit dari notebook "Kisi-Kisi UTS Semester 1 - IPS Kelas 5". Format ngobrol dua host. Bahasa Indonesia santai tapi jelas.

**Guru SMPIT** — audio muhadhoroh untuk siswa dengarkan pagi hari:

> Buatkan audio 8 menit dari notebook "Adab Menuntut Ilmu - Kitab Ta'lim". Gaya nasihat lembut, Bahasa Indonesia dengan istilah Arab yang dijelaskan.

## Kalau hasilnya kurang bagus

- **Pronunciation salah**: coba tulis kata sulit secara fonetik di sumber (misal "shalat" → "sholat")
- **Terlalu panjang/pendek**: minta ulang dengan durasi spesifik
- **Terlalu formal/kaku**: minta ulang dengan "gaya santai" atau "gaya ceramah"
- **Salah tafsir**: tambah lebih banyak sumber atau konteks di notebook

## Langkah berikutnya

- [05 — Generate Study Guide](./05-studyguide.md)
- [Kembali ke README](./README.md)
