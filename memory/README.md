# memory/ — Vault Memori Obsidian

Folder ini adalah **vault Obsidian** yang berfungsi sebagai memori jangka panjang Claude untuk proyek ini. Isinya catatan markdown saling tertaut (`[[wikilink]]`) yang menyimpan konteks penting agar **bertahan antar sesi**: keputusan, konvensi, fakta proyek, dan hal yang sudah dicoba.

## Buka di Obsidian
1. Buka aplikasi Obsidian → **Open folder as vault** → pilih folder `memory/`.
2. Mulai dari `index.md` (Map of Content). Gunakan Graph view untuk melihat keterkaitan.

## Cara kerja dengan Claude
- **Otomatis dimuat**: tiap sesi, SessionStart hook (`.claude/hooks/load-memory.sh`) menyuntikkan `index.md` ke konteks Claude.
- **Dikelola lewat skill**: jalankan `/obsidian-memory` untuk menyimpan, mencari, atau memperbarui catatan.

## Struktur
- `index.md` — pintu masuk / MOC
- `konteks-proyek.md`, `konvensi-kode.md` — konteks inti
- `catatan/` — fakta & temuan lepas
- `keputusan/` — log keputusan (ADR ringan)
- `templates/` — template catatan & keputusan
- `.obsidian/` — konfigurasi vault

> Commit folder ini agar memori ikut tersimpan di repo dan tersedia di sesi/kolaborator berikutnya.
