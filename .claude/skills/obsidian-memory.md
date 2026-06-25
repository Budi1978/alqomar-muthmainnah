---
description: Kelola memori jangka panjang Claude untuk proyek ini sebagai vault Obsidian (catatan markdown saling tertaut di folder memory/). Pakai saat perlu menyimpan, mengingat, mencari, atau memperbarui konteks penting antar sesi — keputusan, konvensi, fakta proyek, atau hal yang sudah dicoba.
---

# Skill: Obsidian Memory

Sistem **memori persisten** untuk proyek Al-Qomar Muthmainnah. Memori disimpan sebagai vault Obsidian di folder `memory/` — catatan markdown ber-frontmatter YAML yang saling tertaut lewat `[[wikilink]]` dan dikelompokkan dengan `#tag`. Tujuannya agar konteks penting **bertahan antar sesi**, bukan hilang saat sesi berakhir.

## Cara Pakai
```
/obsidian-memory [aksi] [detail]
```

Contoh:
- `/obsidian-memory ingat: kita pakai font Amiri khusus untuk teks Arab`
- `/obsidian-memory simpan keputusan: hero slider dikunci 5 slide`
- `/obsidian-memory apa yang kamu ingat soal SEO?`
- `/obsidian-memory cari testimoni`
- `/obsidian-memory perbarui konteks proyek`
- `/obsidian-memory rapikan index`

## Struktur Vault (`memory/`)
| Path | Isi |
|------|-----|
| `index.md` | MOC / pintu masuk. Selalu baca ini dulu. |
| `konteks-proyek.md` | Ringkasan proyek, stack, domain |
| `konvensi-kode.md` | Aturan CSS/JS/HTML wajib |
| `catatan/` | Fakta & temuan lepas yang berguna diingat |
| `keputusan/` | Log keputusan teknis/desain (ADR ringan) |
| `templates/` | Template `catatan.md` & `keputusan.md` |
| `.obsidian/` | Konfigurasi vault Obsidian |

## Instruksi untuk Claude

### Saat MEMBACA memori (mengingat / mencari / menjawab)
1. Baca `memory/index.md` lebih dulu untuk peta isi.
2. Ikuti `[[wikilink]]` yang relevan, atau `Grep` di folder `memory/` untuk kata kunci.
3. Jawab dari isi catatan. Jika tidak ada catatannya, katakan jujur "belum ada di memori".

### Saat MENULIS memori (mengingat sesuatu yang baru)
1. Tentukan jenisnya:
   - Fakta/temuan umum → `catatan/<slug>.md` (pakai `templates/catatan.md`)
   - Keputusan teknis/desain → `keputusan/YYYY-MM-DD-<slug>.md` (pakai `templates/keputusan.md`)
   - Info inti yang berubah → perbarui `konteks-proyek.md` / `konvensi-kode.md`
2. Isi frontmatter: `judul`, `tipe`, `tags`, dan `diperbarui`/`tanggal` (pakai tanggal hari ini).
3. Tulis ringkas tapi cukup self-contained agar berguna di sesi mendatang.
4. Tambahkan `[[wikilink]]` ke catatan terkait dan, kalau penting, daftarkan di MOC `index.md`.
5. Jika ada TODO/hal berjalan, catat di bagian "Catatan Aktif / TODO" pada `index.md`.

### Aturan
- **Hanya simpan yang bernilai diingat**: keputusan, konvensi, preferensi user, fakta yang sulit dicari ulang, jalan buntu yang sudah dicoba. Jangan menyalin seluruh isi file kode.
- Tulis dalam **Bahasa Indonesia**, konsisten dengan proyek.
- Nama file: huruf kecil, pakai tanda hubung (`-`), tanpa spasi.
- Selalu perbarui field `diperbarui` saat mengubah catatan.
- Jaga `index.md` tetap rapi sebagai peta — bukan tempat menumpuk semua detail.
- Jangan menghapus catatan tanpa alasan jelas; tandai usang dengan `status: usang` di frontmatter bila perlu.

### Format Tautan & Tag
- Tautan internal: `[[nama-file-tanpa-ekstensi]]` atau `[[file|teks tampil]]`
- Tag inline: `#proyek #desain #seo #konten #keputusan #konvensi #todo`

> Memori ini dimuat otomatis tiap sesi lewat SessionStart hook di `.claude/settings.json` (menyuntikkan `memory/index.md`). Setelah update besar pada memori, ingatkan user untuk commit folder `memory/`.
