# 99 — Troubleshooting

> Solusi untuk masalah yang paling sering muncul.

## Instalasi

### ❌ `pip: command not found`

**Penyebab**: Python tidak terpasang, atau pakai versi lama tanpa pip.

**Solusi**:
- Coba `pip3` sebagai gantinya
- Install Python dari <https://python.org/downloads> (pilih versi 3.10+)
- Di Mac, pakai Homebrew: `brew install python`

---

### ❌ `error: externally-managed-environment` (Mac / Linux)

**Penyebab**: Python di sistem Anda melindungi diri dari install global.

**Solusi**: pakai virtual environment atau flag `--user`:

```bash
# Pilihan A: pakai --user
pip install --user notebooklm-py

# Pilihan B: buat virtual environment (lebih rapi)
python3 -m venv ~/notebooklm-env
source ~/notebooklm-env/bin/activate
pip install notebooklm-py
```

---

### ❌ `playwright install chromium` gagal

**Penyebab**: koneksi lambat atau tidak ada ruang disk.

**Solusi**:
- Cek ruang disk (minimal 500 MB kosong)
- Cek koneksi internet
- Ulang perintah 2-3 kali
- Kalau tetap gagal, coba download manual dari <https://playwright.dev>

---

## Login

### ❌ `notebooklm login` tidak membuka browser

**Penyebab**: Chromium belum terinstal atau ada masalah izin.

**Solusi**:
```bash
# Install ulang Chromium
playwright install chromium

# Coba login lagi
notebooklm login
```

---

### ❌ Login gagal dengan pesan "Session expired" / "Please try again"

**Penyebab**: Google mendeteksi login "aneh" dari browser otomatis.

**Solusi**:
1. Login manual dulu di <https://notebooklm.google.com> lewat browser biasa
2. Setelah sukses login manual, coba `notebooklm login` lagi
3. Kalau tetap gagal, aktifkan 2FA Google (kadang membantu)

---

### ❌ Muncul CAPTCHA saat login

**Penyebab**: Google curiga karena login dari IP baru / lokasi baru.

**Solusi**: selesaikan CAPTCHA manual di jendela browser yang muncul. Setelah lolos sekali, biasanya tidak muncul lagi.

---

## Pemakaian

### ❌ Claude Code tidak "mengenali" `notebooklm-py`

**Penyebab**: Claude Code tidak tahu kalau tool ini tersedia.

**Solusi**:
1. Pastikan `notebooklm-py` sudah terinstal: `notebooklm --version`
2. Beritahu Claude di prompt: "Tolong pakai `notebooklm-py` yang sudah terinstal untuk...". Claude akan otomatis mendeteksi setelah petunjuk pertama.
3. Restart Claude Code kalau perlu.

---

### ❌ `notebooklm list` menampilkan "Empty" padahal saya punya banyak notebook

**Penyebab**: sesi login expired atau login dengan akun Google yang salah.

**Solusi**:
```bash
notebooklm logout
notebooklm login
# Pastikan login dengan akun yang sama dengan yang Anda pakai di NotebookLM web
```

---

### ❌ Slide/Mind Map/Audio tidak muncul di NotebookLM setelah generate

**Penyebab**: proses generate biasanya butuh waktu (1-10 menit).

**Solusi**:
1. Tunggu 5-10 menit
2. **Refresh** halaman NotebookLM di browser
3. Cek tab **"Studio"** — kadang item baru masuk ke sana, bukan main panel
4. Kalau setelah 15 menit tidak muncul, coba generate ulang

---

### ❌ Rate limit / "Too many requests"

**Penyebab**: Anda pakai terlalu banyak dalam waktu singkat. Google membatasi API internal.

**Solusi**:
- Tunggu 5-10 menit
- Kurangi frekuensi (jangan generate 10 slide deck berturut-turut)
- Untuk pemakaian berat, pertimbangkan **NotebookLM Plus** (berbayar, quota lebih besar)

---

### ❌ Output Bahasa Indonesia jelek / kaku / salah pronunciation

**Penyebab**: NotebookLM masih paling bagus di Bahasa Inggris.

**Solusi**:
- Tambah instruksi jelas di prompt: **"Gunakan Bahasa Indonesia baku, hindari terjemahan literal dari Inggris."**
- Untuk audio: sebutkan **"gaya bicara natural, seperti orang Indonesia asli"**
- Untuk konten pelajaran Bahasa Arab / Islam: **preview dulu** sebelum diberikan ke siswa — istilah Arab kadang salah.
- Fallback: generate dalam Bahasa Inggris, lalu translate manual di Google Translate.

---

## Alat rusak / berubah

### ❌ Setelah beberapa waktu, `notebooklm-py` tidak jalan lagi

**Penyebab**: Google update NotebookLM, tool unofficial jadi tidak kompatibel.

**Solusi**:
1. Cek versi terbaru: `pip install --upgrade notebooklm-py`
2. Cek issue di <https://github.com/teng-lin/notebooklm-py/issues>
3. Kalau belum ada fix, sabar tunggu update dari developer
4. **Sementara itu, pakai NotebookLM manual di browser**

---

### ❌ Error muncul tapi tidak ada di daftar ini

**Solusi**:
1. Salin pesan error lengkap
2. Cari di <https://github.com/teng-lin/notebooklm-py/issues>
3. Kalau belum ada, buat issue baru dengan:
   - OS (Mac / Windows / Linux)
   - Versi Python (`python3 --version`)
   - Versi `notebooklm-py` (`pip show notebooklm-py`)
   - Perintah yang dijalankan
   - Pesan error lengkap

---

## Keamanan

### ❌ Saya login di komputer orang lain — bagaimana logout?

**Solusi cepat**:
1. Di komputer itu: `notebooklm logout`
2. Di HP/laptop pribadi Anda: buka <https://myaccount.google.com/security>
3. Klik "Your devices" → cari nama komputer itu → **Sign out**
4. Ganti password Google
5. Aktifkan 2FA kalau belum

---

### ❌ Curiga akun Google saya dipakai orang lain

**Solusi**:
1. Buka <https://myaccount.google.com/security> → **cek "Recent activity"**
2. Kalau ada login mencurigakan (kota/perangkat asing), **Sign out semua sesi**
3. Ganti password segera
4. Aktifkan 2FA
5. Cek apakah ada `notebooklm-py` terpasang di perangkat yang tidak Anda kenal — bisa jadi sumber kebocoran

---

## Butuh bantuan lebih lanjut?

- Baca dokumentasi resmi `notebooklm-py`: <https://github.com/teng-lin/notebooklm-py/blob/main/docs/python-api.md>
- Baca help NotebookLM: <https://support.google.com/notebooklm>
- Hubungi tim IT Al-Qomar
- [Kembali ke README](./README.md)
