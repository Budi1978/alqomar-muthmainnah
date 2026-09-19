# Instruksi laptop — Paket B2: Rapor Tahfidz SEMESTER (disetujui Ahmad 19 Sep 2026)

## 0. BARIS PERTAMA — BACKUP DULU, tampilkan md5
```
cp guru-embedded.html guru-embedded.html.bak-2026-09-19-sebelum-B2 && md5 guru-embedded.html.bak-2026-09-19-sebelum-B2
```
Edit HANYA sumber `guru-embedded.html`. Jangan sentuh stage-deploy. Jangan tulis data Firebase.
Prasyarat: rules blok `odoaSemester` sudah dipublish Ahmad (cek read-only sebelum deploy).

## Tujuan
Satu dokumen PDF per anak per SEMESTER (Ganjil = 1 Jul–31 Des tahun awal TA; Genap = 1 Jan–30 Jun tahun akhir TA),
menggabungkan: ziyadah semester (node `odoa`), muroja'ah harian (`odoaMurojaah`, B1) + slot muroja'ah bulanan (`odoaBulanan`),
ujian ASTS & ASAS (`odoaBulanan` bulan-bulan di semester itu), kualitas bacaan, catatan pembimbing semester, tanda tangan.
Rapor BULANAN tetap ada, tidak diubah. Cetak semester hanya `bolehRekapSemua` (admin/kepsek + Ulfa & Rifa), sama seperti rapor bulanan.

## 1. Helper global (dekat `_taSekarang`, ~baris 3281)
```js
// Rentang tanggal semester: {ta:'2026/2027', semester:'Ganjil'} -> {dari:'2026-07-01', sampai:'2026-12-31'}
window._rentangSemester = function (ta, semester) {
  var a = parseInt(String(ta || '').split('/')[0], 10);
  if (!a) { var t = window._taSekarang(); a = parseInt(t.ta.split('/')[0], 10); semester = semester || t.semester; }
  return String(semester).toLowerCase().indexOf('genap') >= 0
    ? { dari: (a + 1) + '-01-01', sampai: (a + 1) + '-06-30' }
    : { dari: a + '-07-01', sampai: a + '-12-31' };
};
// Daftar YYYY-MM dalam satu semester (untuk mengambil odoaBulanan per bulan)
window._bulanSemester = function (ta, semester) {
  var r = window._rentangSemester(ta, semester), out = [];
  for (var d = new Date(r.dari + 'T00:00:00'); d <= new Date(r.sampai + 'T00:00:00'); d.setMonth(d.getMonth() + 1))
    out.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  return out;
};
window._saringRentang = function (node, siswaId, r) {           // node = objek RTDB (odoa / odoaMurojaah)
  return Object.values(node || {}).filter(function (x) {
    return x && String(x.siswaId) === String(siswaId) && String(x.tanggal || '') >= r.dari && String(x.tanggal || '') <= r.sampai;
  }).sort(function (a, b) { return String(a.tanggal).localeCompare(String(b.tanggal)); });
};
// Kunci node odoaSemester: <siswaId>__<2026-2027>__<Ganjil|Genap>
window._kunciSemester = function (siswaId, ta, semester) {
  return String(siswaId) + '__' + String(ta).replace('/', '-') + '__' + semester;
};
```

## 2. `_siapkanRaporSemesterODOA` (baru, taruh setelah `_siapkanRaporODOA` ~1646)
Input `{halaqah, murid, setoran, murojaah, bulanan, semesterData, awal, ta, semester, allGuru}`.
- Tolak bila halaqah kosong / tidak ada satu pun setoran anak halaqah di rentang semester.
- `catatan` peringatan: jumlah anak yang belum punya ASAS (ujianJenis mengandung 'Akhir') di semester itu.
- Kembalikan `paket` = { halaqah, siswa, setoran, murojaah, bulanan, semesterData, awal, ta, semester, rentang, bulanList, pembimbing, koordinator } (pembimbing/koordinator sama seperti rapor bulanan).

## 3. `_cetakRaporSemesterODOA(opsi)` (baru, setelah `_cetakRaporODOA` ~1686) — jsPDF, tata letak & warna SAMA dengan rapor bulanan
Per anak (satu halaman, `addPage` antar anak):
- Kop + bilah judul "RAPOR TAHFIDZ AL-QUR'AN" / "Program ODOA — One Day One Ayat" / "SEMESTER <X> — TAHUN AJARAN <ta>" (sudah ada di bulanan, pakai `opsi.ta`/`opsi.semester`, BUKAN `_taSekarang()`).
- Identitas: Nama, NISN, Kelas, Halaqah, Pembimbing, Target Hafalan (`_teksTargetRapor(s, Bakhir, opsi.semester, setoranSem, awal)`, Bakhir = odoaBulanan bulan terakhir yang ada di semester).
- **A. ZIYADAH — HAFALAN BARU SEMESTER INI**: satu baris per BULAN (`opsi.bulanList`): Bulan | Surah & ayat (`_ringkasOdoa(setoran, id, 'YYYY-MM').teks` atau rentang gabungan) | Jumlah ayat | Rata nilai. Baris terakhir TOTAL: jumlah ayat semester + posisi hafalan terakhir (`_posisiTerakhirZiyadah`). Bulan tanpa setoran: "—".
- **B. MUROJA'AH**: dua sub-tabel. (1) Harian (dari `odoaMurojaah`, rentang semester): Jumlah sesi | Surah yang diulang (unik, urut nomor) | Rata nilai | Catatan terakhir. Kalau 0 sesi: satu baris "Belum ada muroja'ah harian tercatat". (2) Bulanan: per bulan yang punya `murojaah1..4`: Bulan | Surah | Kelancaran (label predikat) — reuse logika baris 84 rapor bulanan.
- **C. UJIAN TAHFIDZ**: baris untuk setiap bulan di semester yang `_adaUjianOdoa(B)`: Jenis (ujianJenis) | Tanggal | Cakupan | Predikat (`_labelPredikatOdoa`) | Hasil (`_hasilUjianOdoa(predikat, kelas, jenjang)` → Tuntas/Tidak Tuntas). Tidak ada ujian sama sekali → satu baris "Belum ada ujian semester ini". Bagian ini SELALU dicetak (beda dengan bulanan).
- **D. PENILAIAN KUALITAS BACAAN**: aspek sama dengan bulanan, sumber = odoaBulanan bulan terakhir di semester yang punya isian; fallback rata nilai ziyadah semester.
- **CATATAN PEMBIMBING — SEMESTER**: `semesterData[kunci].catatanPembimbing`; kosong → garis titik.
- Tanda tangan 3 kolom sama seperti bulanan (Orang Tua / Koordinator / Kepala Sekolah) + `tanggalTtd` = `semesterData[kunci].tanggalTtd || opsi.tanggalTtd`.
Pastikan muat satu halaman: kalau tabel A/B panjang, jsPDF autoTable boleh melimpah ke halaman 2 untuk anak yang sama (jangan dipaksa rapat sampai tak terbaca).

## 4. `SetoranODOA` — state, loader, UI (~10974–11004, ~11540–11580)
- State: `const [semesterData, setSemesterData] = useState({});` `const [raporTa, setRaporTa] = useState(window._taSekarang().ta);` `const [raporSem, setRaporSem] = useState(window._taSekarang().semester);` `const [catatanSem, setCatatanSem] = useState({});` (isian per anak).
- Loader: tambah ref `_db.ref('odoaSemester')` on value → setSemesterData, galat ditelan, off di cleanup.
- Di kartu "Terbitkan Rapor" (yang ada tombol 📄 Cetak Rapor ODOA, hanya `bolehRekapSemua`), tambah blok baru di bawahnya:
  - Judul kecil "Rapor Semester" + select TA (opsi: TA sekarang & TA sebelumnya) + select Semester (Ganjil/Genap) + input tanggal ttd (pakai `tglTtd` yang ada).
  - Tabel per anak halaqah terpilih: Nama | Ayat ziyadah semester (hitung dari `_saringRentang(setoran, id, rentang)`) | Sesi muroja'ah (dari `murojaah`) | Ujian (ASTS ✓/–, ASAS ✓/–) | Catatan pembimbing semester (`<input>` terikat `catatanSem[id]`, prefill dari `semesterData[kunci]`).
  - Tombol "💾 Simpan catatan semester": tulis `odoaSemester/<kunci>` = `{ siswaId:Number(id), ta:raporTa, semester:raporSem, halaqah:pilih, catatanPembimbing, tanggalTtd: tglTtd, oleh:user.nip, diubah: Date.now() }` hanya untuk anak yang catatannya berubah/terisi (update, bukan set).
  - Tombol "📄 Cetak Rapor Semester" → `_siapkanRaporSemesterODOA` → `_cetakRaporSemesterODOA`; toast jumlah rapor.
- Guru biasa/koordinator non-penuh: blok ini TIDAK tampil (sama seperti rapor bulanan).

## 5. TIDAK disentuh
Rapor bulanan (`_siapkanRaporODOA`, `_cetakRaporODOA`, `_raporODOADOC`), FormBulananODOA, kartu, rekap setoran/muroja'ah/ujian, mode ziyadah/muroja'ah B1. Versi Word rapor semester = tahap lain (belum).

## 6. Build, deploy, laporkan
inject.py → stage-deploy → `vercel --prod` → etag == md5 → cek-harian.py. Laporkan MD5, SPV_VERSI, diff ringkas per bagian 1–4.

## 7. Uji (Ahmad / Ulfa)
- Admin: pilih h01, TA 2026/2027, Ganjil → tabel semester terisi (ayat ziyadah ≥ angka rapor bulanan Juli+Agustus+September) → isi catatan satu anak → Simpan → toast → Cetak Rapor Semester → PDF: A per bulan Jul–Des (Okt–Des "—"), B harian ada entri muroja'ah B1 tadi, C menampilkan ujian yang sudah diisi atau "Belum ada ujian", catatan tercetak.
- Een (guru): blok Rapor Semester TIDAK muncul.
- Rapor bulanan masih bisa dicetak seperti sebelumnya.
