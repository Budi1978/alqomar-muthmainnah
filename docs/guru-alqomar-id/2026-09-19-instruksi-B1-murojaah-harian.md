# Instruksi laptop — Paket B1: Muroja'ah harian + catatan + riwayat untuk pembimbing (disetujui Ahmad 19 Sep 2026)

Edit HANYA sumber `guru-embedded.html` (backup: `guru-embedded.html.bak-2026-09-19-sebelum-B1`). Jangan sentuh stage-deploy. Jangan tulis data Firebase.
Nomor baris di bawah mengacu ke build live 19 Sep (md5 99a25c7a…); di sumber bisa bergeser sedikit — cari dengan penanda teks.

## 0. Prasyarat: rules RTDB node baru (Ahmad publish via Console SEBELUM deploy)
Blok `odoaMurojaah` ditambahkan setelah blok `odoa` (isi sama persis dengan `odoa`). Tanpa ini, tulisan ke node baru ditolak `$other`.

## 1. Helper global (dekat `_posisiTerakhirZiyadah`, ~baris 1165)
```js
// Juz dari nomor surah — ODOA hanya Juz 30 (78–114) & Juz 29 (67–77).
window._juzSurah = function (nomor) {
  var n = Number(nomor);
  if (n >= 78 && n <= 114) return 30;
  if (n >= 67 && n <= 77) return 29;
  return null;
};
```

## 2. `SetoranODOA` — state & loader (~10974–11004)
- Tambah state: `const [mode, setMode] = useState('ziyadah');` dan `const [murojaah, setMurojaah] = useState({});`
- Di loader `useEffect` tambah ref `m = _db.ref('odoaMurojaah')` dengan `on('value', s => setMurojaah(s.val() || {}), () => setMurojaah({}))` (galat ditelan seperti odoaAwal, supaya halaman tetap hidup kalau rules belum ada) + `off` di cleanup.
- `isian` sekarang boleh punya `catatan` per anak (string opsional).

## 3. Simpan (~11182 `simpanSemua`)
- Validasi nilai & batas ayat tetap untuk kedua mode.
- Cek urutan `_cekUrutanZiyadah` HANYA jika `mode === 'ziyadah'` (muroja'ah bebas urutan).
- Tulis ke `mode === 'murojaah' ? 'odoaMurojaah/' : 'odoa/'` + kunci `id + '__' + tanggal + '__' + Date.now()`.
- Record ditambah `catatan: String(f.catatan || '').trim()` (untuk kedua node; field opsional, rules hasChildren tetap lolos).
- Toast: `siap.length + (mode === 'murojaah' ? ' muroja\'ah' : ' setoran') + ' tersimpan.'`
- `resetSetoranTanggal` & `entriTanggal`: pakai sumber sesuai mode (`mode === 'murojaah' ? murojaah : setoran`) supaya tombol Reset menghapus entri node yang benar (hapus dari `odoaMurojaah/` kalau mode muroja'ah).

## 4. Toolbar (~11524–11534)
Sebelum input tanggal, tambah dua tombol toggle:
```jsx
<div style={{display:'inline-flex', border:'1px solid #d1d5db', borderRadius:8, overflow:'hidden'}}>
  {[['ziyadah','📗 Ziyadah'],['murojaah','📘 Muroja\'ah']].map(([k,l]) => (
    <button key={k} type="button" onClick={() => { setMode(k); setIsian({}); }}
      style={{padding:'7px 12px', fontSize:13, border:'none', cursor:'pointer',
              background: mode===k ? (k==='ziyadah' ? '#24492F' : '#1e4d8c') : '#fff',
              color: mode===k ? '#fff' : '#374151', fontWeight: mode===k ? 700 : 400}}>{l}</button>
  ))}
</div>
```
Label tombol simpan: `mode === 'murojaah' ? 'Simpan muroja\'ah' : 'Simpan setoran'`.
Warna latar kartu tabel ikut mode (hijau ziyadah / biru muroja'ah), dan satu baris teks kecil di atas tabel:
`mode === 'murojaah' ? 'Muroja\'ah = mengulang hafalan lama. Tidak dicek urutan, surah bebas dari Juz 30 & 29.' : 'Ziyadah = hafalan baru, wajib urut sesuai target kelas.'`

## 5. Tabel input (~11645–11690)
- Header: tambah `<th style={{minWidth:160}}>Catatan</th>` setelah Nilai. Header "Terakhir disetor"/"Bulan ini" tetap; di mode muroja'ah isinya diambil dari `murojaah` (entri terakhir & jumlah entri bulan ini), bukan `setoran`. Caranya: `terakhir()`/`ringkas()` menerima sumber, atau buat `terakhirM(id)`/`ringkasM(id)` sederhana dari `murojaah`.
- Baris: tambah `<td><input style={inp} value={f.catatan || ''} placeholder="opsional" onChange={e => ubah(String(s.id), 'catatan', e.target.value)} /></td>`.
- `PilihSurah`: di mode muroja'ah kirim prop baru `semua={true}`; di komponen `PilihSurah` (~10535) kalau `semua` true, daftar = seluruh `window._SURAH_TAHFIDZ` (Juz 30 & 29) tanpa filter target.

## 6. Riwayat Hafalan Anak (~11060–11090 & ~11432–11500) — buka untuk pembimbing
- Ganti semua gating `isPriv` di blok riwayat dengan `bolehRiwayat` = `true` untuk semua yang bisa buka halaman ini, TAPI kandidat pencarian dibatasi:
  `const riwayatKandidat = (isPriv || koordinator) ? semuaSiswa : semuaSiswa.filter(s => milikSaya.some(([k,x]) => (x.anggota||{})[String(s.id)]));`
  → `riwayatHasil` mencari di `riwayatKandidat`. Teks bantuan untuk pembimbing: "Hanya anak di halaqah Bapak/Ibu."
- `riwayatEntri`: gabungkan `Object.values(setoran)` (tandai `jenis:'ziyadah'`) + `Object.values(murojaah)` (tandai `jenis:'murojaah'`), filter siswaId, urut tanggal. `lompatan` dihitung hanya antar entri ziyadah (abaikan muroja'ah saat mencari `sblm`).
- Tabel riwayat: tambah kolom `Jenis` (badge hijau "Ziyadah" / biru "Muroja'ah"), `Juz` (`window._juzSurah(r.nomor)`), `Catatan` (`r.catatan || ''`). Baris muroja'ah tidak pernah diberi latar merah "ganjil".
- Ringkasan di judul: `{nZiyadah} ziyadah · {nMurojaah} muroja'ah`.
- Kartu riwayat (~11432) `{isPriv && (` → tampil untuk semua (`{true && (` atau hapus pembungkus).

## 7. TIDAK disentuh di B1
Kartu Siswa, Rekap Setoran, Rekap Muroja'ah (bulanan), Rapor ODOA, FormBulananODOA, rekap ujian. Muroja'ah harian masuk rapor di B2.

## 8. Build, deploy, uji
inject.py → stage-deploy → `vercel --prod` → etag == md5 → cek-harian.py. Laporkan MD5 + SPV_VERSI.
Uji (setelah rules dipublish Ahmad):
- Guru Een: mode Muroja'ah → pilih An-Nas (walau target ziyadahnya sudah lewat) → nilai → catatan → simpan → toast; entri muncul di kolom "Terakhir" mode muroja'ah dan di Riwayat dengan badge biru; Reset di mode muroja'ah menghapusnya.
- Mode Ziyadah tetap menolak surah tidak urut (Een), admin tetap boleh.
- Een membuka Riwayat: hanya bisa cari anak h01; Ulfa bisa semua.
- Kartu Siswa & Rapor ODOA tidak berubah angkanya (muroja'ah harian tidak ikut terhitung).
