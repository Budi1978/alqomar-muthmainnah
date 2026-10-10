---
judul: Audit Ekosistem Skill & Skill PDP Indonesia
tipe: catatan
tags: [proyek, keputusan, pdp, skill, todo]
diperbarui: 2026-10-10
---

# Audit Ekosistem Skill & Skill PDP Indonesia

Bagian dari [[index]].

## Ringkasan

10 Oktober 2026: dibandingkan katalog awesomeclaude.ai (204 skill, mayoritas developer) dengan 52 skill user yang tersinkron. Hasil: katalog tidak menambah nilai untuk sekolah/umroh/finance. Celah terbesar adalah **perlindungan data pribadi**. Dibuat skill `pdp-indonesia` di repo ini (`.claude/skills/pdp-indonesia/`).

## Hasil audit skill user (dari isi file, bukan nama saja)

**Duplikat yang bisa dirapikan**
- `deep-researcher` (1 KB, template agen generik) ⊂ `deep-research` (13 KB, koordinator subagen). → **hapus `deep-researcher`**.
- `ui-21st` vs plugin `21st:21st-ui`: `ui-21st` adalah pembungkus konteks proyek (branding, routing ke skill proyek), plugin adalah mekaniknya. **Bukan duplikat**, saling melengkapi. Biarkan.
- `excell` (1 KB aturan format Rupiah/PSAK) vs `xlsx` (mekanik file) vs `adobe-anyexcel`: `excell` cuma aturan gaya; layak **dilebur** ke `cashflow-dashboard`/`tanur-finance-engine` lalu dihapus, atau dibiarkan sebagai lapisan tipis. Tidak mendesak.
- `presentation-master` (13 KB, workflow + branding) vs `pptx`/`adobe-anypptx` (mekanik). **Bukan duplikat**. Biarkan.
- `super-power` sudah mengatur prioritas: skill user → plugin bila ada gap metodologi → skill publik untuk mekanik file.

**Celah yang dugaan awal ternyata sudah tertutup**
- Pajak Indonesia: `tanur-finance-engine` punya `references/pajak-travel.md` (PPN umroh non-JKP, PPh 21 TER, PPh 23, e-Faktur/Coretax, SPT Masa). Untuk sekolah: PPh 21 guru belum ada referensi khusus → **celah kecil**, masuk ke `hr-sdm-sekolah` bila dibutuhkan.
- Siskopatuh/PPIU/Kemenag: ada di `edu-travel-knowledge-base`, `jamaah-crm`, `commandcenter-tanur`.
- Perangkat ajar Kurikulum Merdeka (CP/TP/ATP/modul ajar): ada di `edu-travel-knowledge-base`, `soal-generator`, `supervisi-pembinaan-guru`.
- Notulen rapat: template ada di `ahmad-budi-master` references/templates-comms.md; analisis transkrip Zoom belum ada skill khusus → bisa cukup pakai konektor Zoom + template.

**Celah yang benar-benar kosong → sudah dibuat**
- PDP/UU 27/2022: sebelumnya hanya disebut sepintas di `security-review`. Tidak ada deteksi/redaksi format Indonesia. → `pdp-indonesia`.

## Skill `pdp-indonesia`

- `SKILL.md`: kapan menyela skill lain, alur scan→minimalisasi→redaksi→cek manual, aturan keras (data anak & keuangan = spesifik, broadcast WA, transfer ke Saudi, insiden 3×24 jam, retensi).
- `scripts/pii_scan.py`: stdlib + openpyxl. `scan` (CSV/XLSX pakai header kolom sebagai konteks), `redact --mode tag|mask|hash`, `check` validasi struktur NIK/NPWP/HP. Mengenali NIK (validasi provinsi, DD+40 perempuan), KK, NISN, NIS, NIP, NUPTK, NPWP 15/16, paspor, porsi haji, rekening, kartu (Luhn), HP, email, tgl lahir. Tidak mendeteksi nama/alamat/foto.
- `references/`: format-id.md, uu-pdp-ringkas.md (pasal, sanksi, prosedur insiden, retensi), konteks-alqomar-tanur.md (peta data, matriks siapa-boleh-terima-apa, query RLS, template consent wali/jamaah/guru, aturan broadcast).

## Tindak lanjut (TODO)

- [ ] User tambah baris routing di `super-power` bagian LINTAS DOMAIN: `**Data pribadi / UU PDP / redaksi NIK-paspor-rekening** → pdp-indonesia (jalankan sebelum data orang keluar)`.
- [ ] Hapus `deep-researcher` dari skill tersinkron.
- [ ] Jalankan query RLS dari konteks-alqomar-tanur.md ke Supabase web & Tokyo, catat hasilnya di sini.
- [ ] Tunjuk petugas PDP per lembaga (SK), pasang klausul consent di formulir PPDB & perjanjian jamaah.

## Tautan Terkait
- [[konteks-proyek]]
- [[catatan/sinkronisasi-repo-vs-production]]
