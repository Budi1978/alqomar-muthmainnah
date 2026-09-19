# Instruksi untuk Claude di laptop — Fase 2 rules RTDB node `halaqah` (disetujui Ahmad, 19 Sep 2026)

Folder proyek: `/Users/ahmadbudi/Downloads/Al Qomar Project/Aplikasi Sekolah/Supervisi Guru Al Qomar/`
Firebase project: `alqomar-guru` (Realtime Database asia-southeast1).

## Tujuan
Batasi **tulis** ke node `halaqah` hanya untuk: admin (Firebase Auth `admin@guru.alqomar.id.internal`),
kepala sekolah (guru dengan `jabatan == 'kepalaSekolah'`), dan koordinator penuh ODOA
**Ulfa (nip `1775734980152`)** & **Rifa (nip `09 Maret 1997`)**. Baca tetap semua user login.
Ini mencerminkan persis `window._odoaKoordinatorPenuh` di app. Tidak ada perubahan kode app.

Sudah dicek di kode app: hanya 2 titik yang menulis `halaqah` — panel "Atur Pembimbing Halaqah"
(admin/koordinator penuh) dan `odBuatSemua` di LaporanKepsek (seed 14 halaqah, kepsek/admin).
Guru biasa tidak pernah menulis `halaqah`, jadi rules ini tidak merusak fitur lain.

## Langkah — JANGAN jalankan skrip yang menulis data produksi; hanya rules
1. **Backup rules live** dulu: Firebase Console → Realtime Database → Rules → salin seluruh isi ke
   `docs/keamanan/rtdb-rules-backup-2026-09-19-sebelum-fase2-halaqah.json`. (Atau `firebase database:get`
   bukan untuk rules; pakai console atau `firebase deploy`-workflow yang sudah ada kalau tersedia.)
2. Bandingkan dengan `docs/keamanan/rtdb-rules-phase1-target-auth.json`. Kalau live ≠ file, **berhenti dan laporkan** —
   jangan menimpa perubahan yang belum tercatat.
3. **Verifikasi prasyarat (read-only)** sebelum ubah rules:
   - `roles/{uid}` untuk Ulfa dan Rifa ada dan `guruId`-nya menunjuk record `guru/<id>` dengan `nip`
     persis `1775734980152` dan `09 Maret 1997` (perhatikan spasi/karakter). Kalau NIP di `guru` beda, sesuaikan nilai di rules.
   - Akun admin di Firebase Auth benar beremail `admin@guru.alqomar.id.internal`.
   - Record guru Ahmad (kepsek) punya `jabatan == 'kepalaSekolah'` (kalau kepsek login lewat jalur guru).
4. Ganti blok `halaqah` di rules menjadi (pertahankan `.validate` yang sudah ada di file phase1 kalau berbeda):

```json
"halaqah": {
  ".read": "auth != null",
  ".write": "auth != null && (auth.token.email == 'admin@guru.alqomar.id.internal' || (root.child('roles/' + auth.uid + '/guruId').exists() && (root.child('guru/' + root.child('roles/' + auth.uid + '/guruId').val() + '/jabatan').val() == 'kepalaSekolah' || root.child('guru/' + root.child('roles/' + auth.uid + '/guruId').val() + '/nip').val() == '1775734980152' || root.child('guru/' + root.child('roles/' + auth.uid + '/guruId').val() + '/nip').val() == '09 Maret 1997')))",
  "$hid": {
    ".validate": "newData.hasChildren(['nama', 'jenjang'])"
  }
}
```
   Catatan: kalau di file phase1 `.validate` ada di level `halaqah` (bukan `$hid`), ikuti struktur yang ada.
5. Uji di **Rules Playground** (Console → Rules → Playground) sebelum publish:
   - write `/halaqah/h01/pembimbing` sebagai auth email `admin@guru.alqomar.id.internal` → **allow**
   - write yang sama sebagai uid Ulfa → **allow**; uid Rifa → **allow**
   - write yang sama sebagai uid guru biasa (mis. Een) → **deny**
   - read `/halaqah` sebagai uid guru biasa → **allow**
6. Publish. Simpan hasil akhir ke `docs/keamanan/rtdb-rules-phase2-halaqah-2026-09-19.json` dan tambah catatan di
   `docs/keamanan/2026-09-16-rencana-fase2-granular-per-role.md` bahwa butir `halaqah` selesai.
7. Jalankan `docs/skrip/cek-harian.py`. Laporkan ke Ahmad: hasil playground (4 kasus), dan konfirmasi
   di app: login admin → Setoran ODOA → Simpan pembimbing (tanpa mengubah apa pun) → toast hijau.

## Cek tambahan (read-only) — pendamping non-SDIT
Rahayu Vina Purwanti (h01, jenjang SMPIT) mengajar di SD & SMP. Menu Setoran ODOA hanya muncul jika
`guru/<id>.jenjang == 'SDIT'` atau `guru/<id>.jenjangLain == 'SDIT'` (fungsi `_odoaJenjangBoleh`).
Tolong daftar **semua NIP di `halaqah/*/pembimbing` dan `daftarPembimbing/*/nip`**, cocokkan ke `guru`, dan laporkan
siapa saja yang `jenjang != 'SDIT'` DAN `jenjangLain != 'SDIT'`. Jangan ubah data — Ahmad yang akan
mengisi "Jenjang lain = SDIT" lewat menu Data Guru di app.
