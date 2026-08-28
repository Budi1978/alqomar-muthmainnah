# 03 — Generate Mind Map

> Buat peta konsep pembelajaran otomatis dari sumber materi.

## Untuk apa?

Mind map (peta konsep) bagus untuk:

- **Membantu siswa memvisualisasikan** hubungan antar konsep
- **Ringkasan bab** yang ditempel di dinding kelas
- **Kisi-kisi ujian** dalam bentuk visual
- **Persiapan mengajar** — melihat topik dari "helicopter view"
- **Kartu belajar** untuk siswa visual learner

## Alur singkat

```
1. Buka notebook yang sudah ada sumbernya
        ↓
2. Buka Claude Code (claude)
        ↓
3. Ketik prompt mind map
        ↓
4. Buka NotebookLM di browser → Studio → Mind Map
        ↓
5. Screenshot atau simpan gambar
```

## Contoh prompt

**Mind map dasar:**

> Buatkan mind map dari notebook "IPA SDIT - Sistem Pencernaan" untuk siswa kelas 5. Fokus pada organ-organ pencernaan dan fungsinya.

**Mind map dengan level detail:**

> Buatkan mind map 3 tingkat dari notebook "Sejarah Islam - Khulafaur Rasyidin". Tingkat 1: nama khalifah. Tingkat 2: masa jabatan & kontribusi utama. Tingkat 3: peristiwa penting.

**Mind map perbandingan:**

> Buatkan mind map yang membandingkan sifat wajib dan sifat mustahil bagi Allah dari notebook "Aqidah Kelas 5".

## Cara ambil hasilnya

Setelah Claude selesai, buka **NotebookLM di browser**:

1. Buka notebook yang tadi
2. Klik tab **"Studio"**
3. Cari kartu **"Mind Map"** yang baru dibuat
4. Klik untuk buka
5. Anda bisa:
   - **Klik cabang** untuk expand/collapse
   - **Klik cabang** untuk chat/tanya lebih dalam
   - **Screenshot** untuk simpan sebagai gambar (klik kanan → Save image, atau pakai tool screenshot OS)
   - **Fullscreen** untuk presentasi di kelas

## Tips agar mind map bermanfaat

1. **Sebutkan target siswa** — anak KB butuh mind map super sederhana (3-5 cabang), anak SMP bisa lebih detail (10+ cabang).
2. **Sebutkan tujuan** — untuk memahami, untuk hafalan, untuk ujian?
3. **Batasi topik** dalam 1 notebook — jangan bikin notebook dengan 20 topik campur, mind map akan chaos.
4. **Untuk pelajaran Islam**, mind map bagus untuk memvisualisasikan:
   - Rukun Iman (6 cabang)
   - Rukun Islam (5 cabang)
   - Sifat Allah (20 cabang atau 13 wajib)
   - Silsilah nabi
   - Fiqih tata cara ibadah (wudhu → shalat → puasa → zakat → haji)

## Contoh use case guru Al-Qomar

**Guru TKIT** — mind map "Anggota Keluarga" untuk pengenalan Bahasa Arab:
- Pusat: العائلة (Al-'ailah / Keluarga)
- Cabang: أب (Abun), أم (Ummun), أخ (Akhun), أخت (Ukhtun), جد (Jaddun), جدة (Jaddatun)

**Guru SDIT** — mind map "Rukun Wudhu":
- Pusat: Wudhu
- Cabang wajib: Niat, membasuh muka, tangan, mengusap kepala, membasuh kaki, tertib
- Cabang sunnah: Menggosok gigi, berkumur, dst.

**Guru SMPIT** — mind map "Pembagian Ilmu":
- Pusat: Ilmu
- Cabang: Ilmu syar'i, ilmu dunia, ilmu wajib, ilmu sunnah, dst.

## Batasan

- **Tidak bisa export ke format mind map standar** (misal XMind, FreeMind) — hanya bisa screenshot
- **Layout otomatis** — Anda tidak bisa atur posisi cabang manual
- **Bahasa Indonesia bagus**, Bahasa Arab masih terbatas

## Langkah berikutnya

- [04 — Generate Audio Overview](./04-audio.md)
- [Kembali ke README](./README.md)
