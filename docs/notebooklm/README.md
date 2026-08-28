# Integrasi Claude Code + NotebookLM

> Panduan lengkap untuk guru & staf **Al-Qomar Muthmainnah** menggunakan Claude Code bersama Google NotebookLM (kini "Gemini Notebook") untuk mempercepat pembuatan materi ajar.

## Apa ini?

Dokumen ini menjelaskan cara menghubungkan **Claude Code** (asisten AI di terminal) dengan **NotebookLM** (asisten riset & belajar dari Google) menggunakan alat open-source bernama [`notebooklm-py`](https://github.com/teng-lin/notebooklm-py).

Setelah terhubung, Anda bisa **menyuruh Claude Code** untuk:

- 📊 Membuat **slide deck** dari sumber materi (PDF, catatan, artikel)
- 🧠 Membuat **mind map** peta konsep pembelajaran
- 🎧 Membuat **audio overview** ala podcast untuk siswa auditori
- 📖 Membuat **study guide** lengkap dengan ringkasan dan Q&A

Semua dilakukan dari terminal, dengan perintah Bahasa Indonesia biasa. Contoh:

> "Claude, buat mind map dari notebook Fiqih Kelas 4 tentang bab Wudhu."

## Kenapa berguna untuk guru Al-Qomar?

| Pekerjaan lama | Dengan Claude + NotebookLM |
|---|---|
| Bikin slide RPP tiap minggu (~2 jam) | ~5 menit dari sumber materi |
| Ringkas buku pelajaran untuk siswa | Otomatis dengan ringkasan struktur |
| Bikin peta konsep di papan tulis | Mind map otomatis, tinggal cetak |
| Siapkan latihan soal | Q&A dan kisi-kisi otomatis |
| Materi audio untuk anak yang suka mendengar | Audio ringkasan dalam bahasa alami |

## ⚠️ Peringatan penting sebelum mulai

1. **Alat ini tidak resmi (unofficial).** Google belum merilis API resmi untuk NotebookLM. `notebooklm-py` bekerja dengan **mensimulasikan browser** yang membuka NotebookLM. Kalau Google mengubah tampilan, alat ini bisa **berhenti berfungsi sewaktu-waktu**.
2. **Akun Google Anda dititipkan.** Waktu login, sesi browser tersimpan lokal. **Jangan pakai di komputer bersama** — pakai laptop pribadi Anda saja.
3. **Bukan untuk fitur produksi.** Jangan bangun fitur di website sekolah yang tergantung pada alat ini — kalau rusak, fitur mati mendadak. Gunakan untuk **kerja pribadi** (bikin materi ajar, RPP, dll).
4. **Hormati Terms of Service Google.** Jangan pakai untuk spam, scraping massal, atau otomatisasi yang mencurigakan. Pakailah wajar seperti manusia biasa.

## Daftar isi

Ikuti urutan berikut:

1. [**Setup & Instalasi**](./01-setup.md) — pasang alatnya (sekali saja)
2. [**Generate Slide Deck**](./02-slides.md) — bikin slide materi ajar
3. [**Generate Mind Map**](./03-mindmap.md) — bikin peta konsep
4. [**Generate Audio Overview**](./04-audio.md) — bikin podcast belajar
5. [**Generate Study Guide**](./05-studyguide.md) — bikin ringkasan + Q&A
6. [**Troubleshooting**](./99-troubleshooting.md) — kalau ada masalah

## Prasyarat singkat

- Laptop/PC dengan Python 3.10+ terpasang
- Akun Google (yang sama yang Anda pakai di NotebookLM)
- Claude Code sudah aktif dan terpasang
- Koneksi internet stabil
- Waktu setup: ~10-15 menit (sekali seumur hidup)

## Referensi resmi

- Repo `notebooklm-py`: <https://github.com/teng-lin/notebooklm-py>
- Paket PyPI: <https://pypi.org/project/notebooklm-py/>
- NotebookLM (Gemini Notebook): <https://notebooklm.google.com>
- Claude Code: <https://claude.com/claude-code>

---

**Ada pertanyaan?** Buka issue di repo `alqomar-muthmainnah` atau hubungi tim IT sekolah.
