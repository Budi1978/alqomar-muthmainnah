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

- [[catatan/review-skill-connector-agent|Review Skill, Connector & Agent Claude]] — penilaian tooling Claude untuk proyek (2026-06-29). TODO: cek manual connector `mcp_cool` (Composio); pertimbangkan matikan connector yang tidak relevan.
