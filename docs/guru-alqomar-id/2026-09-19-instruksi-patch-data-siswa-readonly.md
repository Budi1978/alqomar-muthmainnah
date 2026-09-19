# Instruksi laptop — Patch app: Data Siswa baca-saja untuk non-admin (menunggu OK Ahmad)

Konteks: rules RTDB `siswa` sudah admin-only (admin + kepsek) sejak 19 Sep 2026. Di app, halaman
Data Siswa masih menampilkan tombol Tambah / Upload Excel / Edit / Hapus untuk semua guru, dan
`_addSiswa` / `_deleteSiswa` tidak menangkap error → guru yang mencoba menyimpan gagal diam-diam.

Edit HANYA di SUMBER `guru-embedded.html` (bukan stage-deploy). Backup dulu:
`guru-embedded.html.bak-2026-09-19-sebelum-datasiswa-readonly`.

## 1. Helper siswa tampilkan error (sekitar baris 271–276)
Ganti:
```js
window._addSiswa = function(siswa) {
  _db.ref('siswa/' + siswa.id).set(siswa);
};
window._deleteSiswa = function(id) {
  _db.ref('siswa/' + id).remove();
};
```
menjadi:
```js
window._addSiswa = function(siswa) {
  return _db.ref('siswa/' + siswa.id).set(siswa)
    .catch(function (e) { window._toast('Gagal menyimpan siswa: ' + (e && e.message || e), 'error'); throw e; });
};
window._deleteSiswa = function(id) {
  return _db.ref('siswa/' + id).remove()
    .catch(function (e) { window._toast('Gagal menghapus siswa: ' + (e && e.message || e), 'error'); throw e; });
};
```

## 2. Di `function DataSiswa()` (sekitar baris 6216), tepat setelah `const siswa = useSiswa();` tambah:
```js
// Rules RTDB `siswa` admin-only sejak 19 Sep 2026: guru hanya boleh melihat.
const bolehTulis = !!(window._loggedUser && window._isAdminRole(window._loggedUser.role));
```

## 3. Di JSX DataSiswa
a) Bungkus tombol **+ Tambah Siswa** dan **📤 Upload Excel / CSV** dengan `{bolehTulis && (...)}`.
   Tombol **📥 Download Template** boleh tetap tampil untuk semua (tidak menulis).
   Untuk non-admin tambahkan di baris tombol:
   `{!bolehTulis && <span style={{fontSize:12,color:'#92400e'}}>🔒 Hanya Admin/Kepala Sekolah yang dapat mengubah data siswa.</span>}`
b) Header tabel: `{bolehTulis && <th>Aksi</th>}`; `colSpan` baris "Tidak ada siswa" jadi `{bolehTulis ? 6 : 5}`.
c) Sel Aksi per baris: bungkus `<td>...Edit...Hapus...</td>` dengan `{bolehTulis && (...)}`.
d) Tidak perlu sentuh modal — modal hanya terbuka dari tombol yang sudah disembunyikan.

## 4. Build & deploy (alur wajib)
inject.py → stage-deploy/index.html → `vercel --prod` dari stage-deploy → verifikasi etag == md5 →
`docs/skrip/cek-harian.py`. Laporkan MD5 baru + SPV_VERSI.

## 5. Uji
- Admin: Data Siswa → tombol Tambah/Upload/Edit/Hapus tampil.
- Guru biasa (mis. Een): Data Siswa → hanya tabel + Download Template + teks 🔒. Kolom Aksi hilang.
- Halaman lain tidak berubah (Setoran ODOA, Presensi, Nilai).
