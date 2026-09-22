---
judul: Memory Index
tipe: moc
tags: [moc, index]
diperbarui: 2026-06-25
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
- [[catatan/sinkronisasi-repo-vs-production]] — ⚠️ **PENTING**: repo Git bisa basi dari server (Hostinger diedit langsung). Jangan asumsikan repo = kondisi live untuk `.htaccess`/`*.php`. Selalu catat progres tiap selesai pekerjaan, jangan tunggu akhir sesi.
- [[catatan/audit-website-2026-09-22]] — hasil audit 22 Sep 2026 — poin 2,3 live; 5,6 selesai di repo; 7 tunggu data akreditasi; hapus 309 gambar tak terpakai tunggu izin
