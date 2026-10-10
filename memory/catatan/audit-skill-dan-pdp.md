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
- [x] Jalankan query RLS ke 3 project Supabase (10 Okt 2026) — hasil di bawah.
- [ ] Tunjuk petugas PDP per lembaga (SK), pasang klausul consent di formulir PPDB & perjanjian jamaah.

## Hasil Cek RLS Supabase — 10 Oktober 2026

Tiga project di org `tmpxkkwuqdtmjlwintsi`: `website` (gzcgyqntluhxxrvbcwin, Sydney), `platform-guru-alqomar` (lnacvtvufgsxnqhuezox, Tokyo), `gaji-guru` (cuqwjgxipzwwecolbuav, Mumbai). **Semua tabel public di ketiganya sudah RLS = true.** Tidak ada tabel data orang yang bisa dibaca anon tanpa filter.

**website** — AMAN untuk tabel. `spmb_pendaftar` (nama anak/ortu, telp, email, TTL, alamat; sudah ada kolom `setuju_at`/`setuju_versi` = consent tercatat) hanya `is_admin()`. `kontak` anon INSERT saja. `guru` publik hanya `aktif=true`, kolomnya profil publik (nama, jabatan, foto). `berita`/`faq`/dll publik = memang konten publik. Catatan kecil: `admin_users` & `spmb_counter` RLS tanpa policy (terkunci, OK). `daftar_spmb` SECURITY DEFINER callable anon — memang jalur form PPDB, ada validasi; pastikan rate limit di sisi web. Bucket `cms-alqomar` publik berisi foto guru & upload CMS (329 file) — wajar.

**platform-guru-alqomar** — tabel AMAN (siswa 561 baris, pembayaran 2.509 baris, nilai, absensi semua per-role: kepsek/wali kelas/pembimbing). Bucket `bukti-transfer` private + policy per wali kelas — bagus. **TEMUAN:**
1. 🔴 Bucket `dokumen_` **PUBLIC** (6.023 PDF: RPP, PROTA, jurnal harian guru) dengan policy `dokumen_insert [anon]` dan `dokumen_select [anon]` → **siapa pun tanpa login bisa upload & list file**. Nama folder = ID guru berupa **tanggal lahir** (`020790`, `11-05-2003`, `09 Maret 1997`) → bocor TTL guru lewat listing. Isi file perangkat ajar, bukan KTP, jadi dampak sedang; vektor penyalahgunaan (upload PDF sembarangan, biaya storage) tinggi.
2. 🟠 Bucket `pelatihan-tugas` PUBLIC, policy insert/select untuk PUBLIC (326 PDF tugas pelatihan guru, folder level-2 juga TTL).
3. 🟠 `check_guru_email_exists(email)` & `check_admin_email_exists(email)` SECURITY DEFINER callable anon → enumerasi email guru/kepsek tanpa login.
4. 🟡 `pembayaran_backup_20260724` (89 baris data pembayaran) RLS tanpa policy — terkunci, tapi residu; hapus.
5. 🟡 `halaqah_anggota`, `halaqah`, `tarif`, `tahfidz_*` SELECT `true` untuk semua authenticated (44 akun guru) — semua guru bisa lihat pemetaan siswa→halaqah. Dapat diterima untuk internal sekolah.
6. 🟡 Leaked password protection (HaveIBeenPwned) nonaktif. `update_updated_at` search_path mutable.

**gaji-guru** — satu policy "authenticated full access" di semua tabel (`nilai_gaji` 2.611 baris, `guru` nip+wa). Hanya **2 akun** auth (admin, login terakhir 9 Okt) → dapat diterima selama guru tidak diberi login. ⚠️ `pengaturan.fonnte_token` (token API WA) tersimpan plaintext di tabel; pindahkan ke Edge Function secret bila nanti ada user tambahan. Leaked password protection nonaktif.

**Tindak lanjut yang diusulkan (belum dieksekusi — butuh persetujuan user, DDL):**
```sql
-- platform-guru: tutup upload/list anon di dokumen_ & pelatihan-tugas
drop policy if exists dokumen_insert on storage.objects;
drop policy if exists dokumen_select on storage.objects;
drop policy if exists pelatihan_tugas_insert on storage.objects;
drop policy if exists pelatihan_tugas_select on storage.objects;
create policy dokumen_insert_auth on storage.objects for insert to authenticated with check (bucket_id in ('dokumen_','pelatihan-tugas'));
-- auth_pg_storage_select [authenticated] sudah ada untuk kedua bucket
update storage.buckets set public = false where id in ('dokumen_','pelatihan-tugas');  -- app harus pakai signed URL / createSignedUrl
revoke execute on function public.check_guru_email_exists(text) from anon;
revoke execute on function public.check_admin_email_exists(text) from anon;
drop table if exists public.pembayaran_backup_20260724;
```
Risiko: kalau app guru.alqomar.id masih memakai URL publik `/storage/v1/object/public/dokumen_/...` untuk buka PDF, set `public=false` akan memutus tautan → ganti ke signed URL dulu di kode, baru flip bucket. Hapus policy anon insert/select **aman dilakukan sekarang** karena guru selalu login.

## Eksekusi Perbaikan platform-guru — 10 Okt 2026 (disetujui user: "eksekusi")

**Temuan baru saat eksekusi:** semua 6.023 objek `dokumen_` dan 326 objek `pelatihan-tugas` punya `owner = null` → aplikasi guru.alqomar.id **mengunggah memakai anon key tanpa sesi login** (upload terakhir 10 Okt). Menghapus policy anon insert akan memutus upload guru. Rencana diubah: policy dipersempit, bukan dihapus.

**Yang sudah diterapkan & diverifikasi:**
- `storage.buckets.pelatihan-tugas` → `allowed_mime_types = {application/pdf}` (sebelumnya tanpa batasan; limit 25 MB tetap). `dokumen_` sudah PDF-only + 10 MB sejak sebelumnya.
- `ALTER POLICY dokumen_insert` (anon) → `with check (bucket_id='dokumen_' AND ekstensi = pdf)`.
- `ALTER POLICY pelatihan_tugas_insert` → role `anon, authenticated` (sebelumnya PUBLIC), `with check` bucket + ekstensi pdf.
- `REVOKE EXECUTE` `check_guru_email_exists(text)` & `check_admin_email_exists(text)` dari `anon`/`public`; tetap untuk `authenticated` & `service_role`. Edge logs 24 jam: 0 panggilan ke kedua RPC, jadi login flow tidak memakainya.
- `pembayaran_backup_20260724` → **tidak bisa DROP lewat MCP** (statement destruktif menunggu konfirmasi → timeout 60 detik, 3× dicoba). Sebagai gantinya: `REVOKE ALL` dari anon/authenticated + rename ke `zz_hapus_pembayaran_backup_20260724`. **TODO user: drop manual** dari Dashboard → Table Editor.

**Belum diubah (butuh perubahan kode app dulu):**
- `dokumen_select`/`pelatihan_tugas_select` untuk anon masih ada → listing publik, nama folder = tanggal lahir guru. Fix di app: pakai `user_id` sebagai nama folder, dan upload lewat client yang membawa sesi (`supabase.auth.getSession()` sebelum `storage.from().upload()`), lalu policy anon bisa dihapus dan bucket di-set private + signed URL.
- Status `public=true` kedua bucket tetap, supaya tautan PDF di app tidak putus.

Catatan teknis MCP Supabase: `DROP POLICY`/`DROP TABLE` hang 60 detik (konfirmasi destruktif tidak sampai ke UI). Gunakan `ALTER POLICY`, `REVOKE`, `RENAME` sebagai jalur non-destruktif.

## Tautan Terkait
- [[konteks-proyek]]
- [[catatan/sinkronisasi-repo-vs-production]]
