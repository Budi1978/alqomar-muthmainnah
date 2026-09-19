# Instruksi laptop — Paket B3: Tab menu ODOA + panel Pengaturan (disetujui Ahmad 19 Sep 2026)

## 0. BARIS PERTAMA — BACKUP DULU, tampilkan md5
```
cp guru-embedded.html guru-embedded.html.bak-2026-09-19-sebelum-B3 && md5 guru-embedded.html.bak-2026-09-19-sebelum-B3
```
Edit HANYA sumber `guru-embedded.html`. Jangan sentuh stage-deploy. Jangan tulis data Firebase. TIDAK ada perubahan rules.
Ini murni penataan tampilan: TIDAK mengubah logika akses, penyimpanan, atau perhitungan apa pun. Semua kartu yang ada dipindah ke dalam tab, tidak ada yang dihapus.

## 1. State tab di `SetoranODOA`
`const [tab, setTab] = useState('tahfizh');`
Ingat tab terakhir per perangkat: baca `localStorage.getItem('odoa_tab')` saat init (fallback 'tahfizh'), tulis saat ganti tab (bungkus try/catch).

## 2. Bilah tab (tepat di bawah judul "Setoran ODOA — One Day One Ayat" + teks pengantar)
Tab yang tampil bergantung peran (pakai variabel yang SUDAH ada: `isPriv`, `koordinator`, `bolehRekapSemua`):
| Kunci | Label | Tampil untuk | Isi (kartu yang sudah ada) |
|---|---|---|---|
| `tahfizh` | 📖 Tahfizh | semua | toolbar Ziyadah/Muroja'ah + tabel setoran, `FormBulananODOA` (kartu-murojaah-setoran), kartu Riwayat Hafalan Anak |
| `ujian` | 📝 Ujian | `bolehRekapSemua` | kartu Rekap Ujian ODOA (`kartu-rekap-ujian`) |
| `rapor` | 📄 Rapor | `bolehRekapSemua` | kartu Terbitkan Rapor (bulanan + blok Rapor Semester B2) |
| `rekap` | 📊 Rekap & Laporan | `bolehRekapSemua` | kartu "Lihat Rekap Semua Kelas" + tombol Cetak Kartu Siswa / Cetak Rekap Setoran / Cetak Rekap Muroja'ah (tombol-tombol ini boleh tetap juga di toolbar tab Tahfizh — jangan hapus dari tempat asal, cukup tampilkan lagi di sini kalau mudah; kalau rumit, biarkan di toolbar dan tab Rekap hanya berisi kartu Rekap Semua Kelas) |
| `pengaturan` | ⚙️ Pengaturan | `isPriv || window._odoaKoordinatorPenuh(user)` | panel "Atur Pembimbing Halaqah" (Paket A) + panel info baru (bagian 3) |
Tab yang tidak boleh dilihat peran itu tidak dirender sama sekali. Kalau `tab` tersimpan menunjuk tab yang tidak boleh, jatuhkan ke 'tahfizh'.
Gaya: deretan tombol pil, aktif = latar `#24492F` teks putih, lainnya putih berborder `#d1d5db`; `flexWrap:'wrap'`, `gap:6`, `marginBottom:14`. Di HP tetap terbaca (font 13).

## 3. Panel info di tab Pengaturan (baca-saja, tidak menulis apa pun)
Kartu "ℹ️ Pengaturan ODOA" berisi:
- Tahun ajaran & semester aktif: `window._taSekarang()` → "2026/2027 · Ganjil (otomatis dari tanggal)".
- Koordinator ODOA (lihat semua halaqah): daftar nama dari `window._ODOA_KOORDINATOR`.
- Koordinator penuh (cetak rapor & rekap): daftar nama dari `window._ODOA_KOORDINATOR_PENUH`.
- Menu setoran guru: `window._ODOA_UNTUK_GURU ? 'Terbuka' : 'Ditutup'`.
- Catatan kecil: "Perubahan daftar koordinator masih lewat pembaruan aplikasi (hubungi admin)."
Halaqah & pembimbing: tautan/teks "atur di panel di bawah" (panel Atur Pembimbing ada di tab yang sama).

## 4. Yang TIDAK boleh berubah
- Semua `useEffect` loader, state, fungsi simpan/cetak, kondisi `bolehRekapSemua`/`isPriv`/`koordinator` di dalam kartu: biarkan apa adanya. Membungkus kartu dengan `{tab === 'x' && (...)}` TIDAK boleh memindahkan hook ke dalam kondisi (hook tetap di level atas komponen).
- Id elemen `kartu-rekap-ujian`, `kartu-murojaah-setoran` tetap ada (dipakai scroll/anchor).
- Halaman lain tidak disentuh.

## 5. Build, deploy, laporkan
inject.py → stage-deploy → `vercel --prod` → etag == md5 → cek-harian.py. Laporkan MD5, SPV_VERSI, diff ringkas.

## 6. Uji
- Admin: 5 tab tampil; pindah tab tidak mereset isian setoran yang sedang diketik (state tetap); tab Rapor memuat rapor bulanan + semester; tab Pengaturan memuat Atur Pembimbing + panel info; refresh halaman → tab terakhir tetap.
- Ulfa: 5 tab. Een (guru): hanya tab Tahfizh (bilah tab boleh disembunyikan kalau cuma 1 tab).
- Simpan setoran ziyadah & muroja'ah masih jalan seperti B1.
