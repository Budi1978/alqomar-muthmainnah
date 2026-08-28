# 02 — Generate Slide Deck

> Buat slide materi ajar dalam hitungan menit dari sumber PDF/dokumen.

## Untuk siapa?

- **Guru mata pelajaran** yang perlu slide RPP mingguan
- **Guru tahfidz** yang mau bikin slide review hafalan
- **Wali kelas** yang mau presentasi rapot ortu
- **Kepala sekolah** yang mau slide rapat internal

## Alur singkat

```
1. Kumpulkan sumber materi (PDF, Word, catatan)
        ↓
2. Upload ke NotebookLM (via web browser sekali)
        ↓
3. Buka Claude Code di terminal (claude)
        ↓
4. Ketik prompt Bahasa Indonesia
        ↓
5. Slide deck otomatis muncul di NotebookLM
        ↓
6. Buka NotebookLM di browser → download / export
```

## Langkah demi langkah

### Langkah 1 — Upload sumber materi ke NotebookLM

Buka <https://notebooklm.google.com>, klik **"New notebook"**, lalu upload:

- PDF buku pelajaran
- File Word RPP lama
- Link YouTube video pembelajaran
- Catatan teks
- Website (paste URL)

Bisa upload sampai **50 sumber per notebook**. Beri nama notebook yang jelas, misal:

- `Fiqih Kelas 4 - Bab Wudhu`
- `Bahasa Arab TKIT - Tema Keluarga`
- `IPA SDIT - Sistem Pencernaan`

### Langkah 2 — Buka Claude Code

Di terminal, jalankan:

```bash
claude
```

### Langkah 3 — Ketik prompt

Contoh prompt siap tempel:

**Slide RPP standar:**

> Buatkan slide deck presentasi dari notebook "Fiqih Kelas 4 - Bab Wudhu" untuk mengajar 1 jam pelajaran. Struktur slide: pembuka (1 slide), materi utama (5-7 slide), contoh praktik (2 slide), latihan (1 slide), penutup (1 slide). Gunakan Bahasa Indonesia baku dan sesuaikan untuk siswa kelas 4 SD.

**Slide untuk rapat ortu:**

> Buatkan slide 10 halaman dari notebook "Laporan Semester 1" untuk presentasi ke orang tua siswa. Fokus pada capaian akademik, karakter, dan hafalan.

**Slide singkat 5 menit:**

> Buatkan slide 5 halaman dari notebook "Ceramah Jumat - Adab Menuntut Ilmu" untuk kultum 5 menit. Bahasa yang mudah dipahami anak SMP.

### Langkah 4 — Ambil hasilnya

Claude akan konfirmasi bahwa slide sudah dibuat. Buka **NotebookLM di browser**, buka notebook yang tadi, klik tab **"Studio"** → cari **"Slide Deck"** yang baru dibuat.

Klik untuk melihat preview, lalu klik **titik tiga (⋮) → Download** untuk simpan sebagai:

- PPTX (bisa dibuka di PowerPoint / Google Slides)
- PDF

## Tips agar hasilnya bagus

1. **Sumber yang jelas = slide yang jelas.** Kalau materi Anda campur-campur (PDF + video + catatan berantakan), hasil slide juga akan berantakan. Rapikan dulu sumbernya.
2. **Sebutkan target audiens** di prompt: "untuk siswa kelas 4", "untuk orang tua", "untuk rapat guru".
3. **Sebutkan jumlah slide** yang Anda mau. Kalau tidak, NotebookLM biasanya bikin 8-12 slide default.
4. **Sebutkan gaya bahasa**: baku, santai, formal, ceramah, dll.
5. **Sebutkan kalau perlu ada latihan/kuis** di dalam slide.
6. **Untuk konten Islam**, sebutkan: "gunakan bahasa yang sopan dan sesuai adab Islam" agar hasil sesuai dengan visi sekolah.

## Contoh prompt lanjutan

**Slide dwibahasa (Indonesia + Arab):**

> Buatkan slide 8 halaman dari notebook "Aqidah Kelas 6 - Rukun Iman" dalam Bahasa Indonesia. Untuk setiap poin utama, tambahkan istilah Arab-nya dengan harakat.

**Slide dengan quote hadits:**

> Buatkan slide dari notebook "Akhlak Terpuji". Setiap slide harus menyertakan minimal 1 quote hadits atau ayat Al-Qur'an yang relevan dengan sumbernya.

## Batasan yang perlu diketahui

- Maksimal **50 sumber per notebook**
- Slide biasanya **8-15 halaman**, sulit minta > 20 slide dalam satu deck
- **Tidak bisa upload gambar custom** ke slide — NotebookLM pilih ilustrasi otomatis
- **Bahasa Indonesia** cukup baik, tapi Bahasa Arab masih terbatas (istilah teknis kadang salah)
- **Tidak bisa edit slide** dari Claude Code — edit manual di PowerPoint setelah download

## Langkah berikutnya

- [03 — Generate Mind Map](./03-mindmap.md)
- [Kembali ke README](./README.md)
