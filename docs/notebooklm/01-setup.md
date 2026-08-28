# 01 — Setup & Instalasi

> **Waktu**: ~10-15 menit · **Sekali seumur hidup** per komputer.

## Prasyarat

Pastikan Anda punya:

| Kebutuhan | Cara cek | Kalau belum ada |
|---|---|---|
| **Python 3.10+** | Buka terminal, ketik `python3 --version` | Install dari <https://python.org/downloads> |
| **pip** | `pip --version` atau `pip3 --version` | Biasanya sudah include dengan Python |
| **Claude Code** | `claude --version` | Install dari <https://claude.com/claude-code> |
| **Akun Google** | Login sekali di <https://notebooklm.google.com> | Buat akun Google baru |
| **Koneksi internet** stabil | — | — |

## Langkah 1 — Install `notebooklm-py`

Buka terminal, lalu jalankan berurutan:

```bash
# 1. Install library utama
pip install notebooklm-py

# 2. Install dukungan browser (Playwright)
pip install "notebooklm-py[browser]"

# 3. Download browser Chromium yang dipakai
playwright install chromium
```

**Kalau muncul error `command not found: pip`**, coba pakai `pip3` sebagai gantinya:

```bash
pip3 install notebooklm-py
pip3 install "notebooklm-py[browser]"
playwright install chromium
```

**Kalau di Mac muncul error izin**, tambah `--user`:

```bash
pip install --user notebooklm-py
```

## Langkah 2 — Login ke akun Google

Jalankan:

```bash
notebooklm login
```

Perintah ini akan **membuka jendela browser Chromium**. Login ke akun Google Anda seperti biasa (email + password + verifikasi 2FA kalau ada). Setelah berhasil, tutup browser.

Sesi login akan **disimpan lokal** di komputer Anda, jadi Anda tidak perlu login lagi tiap kali pakai.

## Langkah 3 — Verifikasi setup berhasil

Coba jalankan:

```bash
notebooklm list
```

Kalau muncul daftar notebook Anda (atau pesan "no notebooks yet" kalau masih kosong), berarti **setup berhasil**.

Kalau muncul error, lihat [99-troubleshooting.md](./99-troubleshooting.md).

## Langkah 4 — Coba dengan Claude Code

Buka Claude Code di terminal:

```bash
claude
```

Lalu coba ketik prompt sederhana:

> "Daftar semua notebook saya di NotebookLM."

Claude Code akan otomatis mendeteksi `notebooklm-py` dan memanggil perintah `notebooklm list`. Kalau muncul daftar notebook Anda, **integrasi sudah aktif** 🎉.

## ⚠️ Catatan keamanan penting

- **Jangan share komputer** setelah login. Sesi Google Anda tersimpan lokal — siapa pun yang pakai komputer Anda bisa akses NotebookLM Anda.
- **Kalau laptop hilang**, segera:
  1. Buka <https://myaccount.google.com/security>
  2. Klik "Your devices" → sign out dari perangkat yang hilang
  3. Ganti password Google
- **Jangan install di komputer sekolah/publik.** Pakai laptop pribadi.
- **Jangan commit folder cache `notebooklm-py`** ke Git. Biasanya ada di `~/.notebooklm/` atau `~/.cache/notebooklm/` — sudah otomatis di-ignore, tapi cek `.gitignore` Anda.

## Langkah berikutnya

Setelah setup selesai, lanjut ke:

- [02 — Generate Slide Deck](./02-slides.md)
- [03 — Generate Mind Map](./03-mindmap.md)
- [04 — Generate Audio Overview](./04-audio.md)
- [05 — Generate Study Guide](./05-studyguide.md)

Atau kembali ke [README](./README.md).
