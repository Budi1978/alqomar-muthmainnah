---
judul: Memory Index
tipe: moc
tags: [moc, index]
diperbarui: 2026-09-19
---

# 🧠 Memory — Al-Qomar Muthmainnah

Ini adalah **vault memori Obsidian** untuk proyek website Al-Qomar Muthmainnah. Claude membaca dan menulis catatan di sini agar konteks penting **tersimpan antar sesi** — keputusan, konvensi, hal yang sudah dicoba, dan info proyek yang sering dibutuhkan.

> [!info] Cara kerja
> Setiap sesi baru, isi [[index]] dan catatan yang relevan dimuat sebagai konteks (lewat SessionStart hook). Saat ada keputusan atau fakta penting, Claude menambah/memperbarui catatan di sini. Gunakan `/obsidian-memory` untuk mengelolanya.

## 🗺️ Peta Konten (MOC)

### Konteks Inti
- [[konteks-proyek]] — ringkasan proyek, stack, dan domain
- [[konvensi-kode]] — aturan CSS/JS/HTML yang wajib diikuti

### Catatan Berjalan
- Folder `catatan/` — fakta, temuan, dan info yang berguna untuk diingat
- Folder `keputusan/` — log keputusan teknis & desain (ADR ringan)

### Template
- [[templates/catatan|Template Catatan]]
- [[templates/keputusan|Template Keputusan]]

## 🏷️ Tag Utama
`#proyek` `#desain` `#seo` `#konten` `#keputusan` `#konvensi` `#todo`

## 📌 Catatan Aktif / TODO
*(Tambahkan hal yang sedang berjalan atau perlu ditindaklanjuti di sini)*

- [[catatan/panggilan-user]] — **User memanggil Claude dengan nama "Aira"** (berlaku di semua sesi)
- [[catatan/guru-alqomar-id-arsitektur]] — ⚠️ **guru.alqomar.id = app guru ASLI**: kode tidak di GitHub, data di Firebase, file di Supabase Storage Tokyo. Baca sebelum kerjakan apa pun soal Platform Guru.
- [[catatan/platform-guru-tahfidz-odoa]] — ⚠️ **guru.alqomar.id ≠ repo platform-guru-alqomar** (aplikasi guru yang asli kodenya tidak di GitHub). Pekerjaan tahfidz 19 Sep masuk ke app Next.js/Supabase Tokyo, bukan ke app guru. **Selalu tanya user sebelum eksekusi.**
- [[catatan/sinkronisasi-repo-vs-production]] — ⚠️ **PENTING**: repo Git bisa basi dari server (Hostinger diedit langsung). Jangan asumsikan repo = kondisi live untuk `.htaccess`/`*.php`. Selalu catat progres tiap selesai pekerjaan, jangan tunggu akhir sesi.
