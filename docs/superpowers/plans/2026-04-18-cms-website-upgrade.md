# CMS Website Upgrade — Al-Qomar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync CMS (Supabase) dengan website langsung, tambah export Excel SPMB, panel Testimoni & FAQ, dan rich text editor untuk Berita.

**Architecture:** Website (`index-live.html`) sudah pakai `window._sb` (Supabase client) untuk Berita, Pengumuman, dan Ekskul. Kita tambah dynamic loader untuk Kegiatan, Testimoni, dan FAQ. CMS (`admin-alqomar.html`) di-upgrade dengan panel baru + Quill.js + SheetJS.

**Tech Stack:** Vanilla JS, Supabase JS v2 (`window._sb`), Quill.js CDN, SheetJS (xlsx) CDN, CSS inline.

---

## File yang Dimodifikasi

| File | Tugas |
|------|-------|
| `~/alqomar-muthmainnah/index-live.html` | Task 1, 3b, 4b — tambah dynamic loader |
| `~/Downloads/05-Claude Project/05-ALQ WEB SEKOLAH/admin-alqomar.html` | Task 2, 3a, 4a — tambah fitur CMS |
| Supabase SQL Editor | Task 3a — CREATE TABLE testimoni & faq |

---

## Task 1: Dynamic Kegiatan (Event) di Website

**Problem:** Kegiatan di website masih hardcoded. Kalau hapus dari CMS, website tidak update.

**File:** `~/alqomar-muthmainnah/index-live.html`

- [ ] **Step 1: Tambah id ke container Kegiatan**

Cari (sekitar baris 2212):
```html
    <div class="evg rv">
```
Ganti dengan:
```html
    <div class="evg rv" id="kegiatan-grid">
```

- [ ] **Step 2: Tambah script dynamic Kegiatan setelah script Berita**

Cari blok (sekitar baris 2924):
```html
</script>
<!-- SUPABASE EKSKUL & GALERI DINAMIS -->
```

Sisipkan script baru di antara keduanya:
```html
</script>

<!-- SUPABASE KEGIATAN DINAMIS -->
<script>
(async function() {
  var MON = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  function renderKegiatan(list) {
    var grid = document.getElementById('kegiatan-grid');
    if (!grid) return;
    if (!list || list.length === 0) return;
    var today = new Date(); today.setHours(0,0,0,0);
    grid.innerHTML = list.map(function(k) {
      var d = k.tanggal ? new Date(k.tanggal) : null;
      var day = d ? d.getDate() : '—';
      var mon = d ? (MON[d.getMonth()] + ' ' + d.getFullYear()) : '';
      var past = d && d < today;
      var selesai = past
        ? '<span style="display:inline-block;margin-top:6px;font-size:10px;font-weight:700;color:#888;background:#f0f0f0;padding:2px 8px;border-radius:20px">✓ Selesai</span>'
        : '';
      return '<div class="evc">'
        + '<div class="evd" style="' + (past ? 'background:#aaa' : '') + '">'
        + '<div class="evday">' + day + '</div>'
        + '<div class="evmon">' + mon + '</div>'
        + '</div>'
        + '<div class="evb">'
        + '<span class="evtag">' + (k.tag || 'Kegiatan') + '</span>'
        + '<h4>' + k.judul + '</h4>'
        + '<p>' + (k.deskripsi || '') + '</p>'
        + selesai
        + '</div></div>';
    }).join('');
  }

  try {
    var sb = window._sb;
    var res = await sb.from('kegiatan')
      .select('judul,tanggal,waktu,lokasi,deskripsi,tag')
      .eq('aktif', true)
      .order('tanggal', { ascending: true })
      .limit(5);
    if (res.error) throw res.error;
    if (res.data && res.data.length > 0) renderKegiatan(res.data);
  } catch(e) {
    console.warn('Kegiatan load error:', e.message);
  }
})();
</script>

<!-- SUPABASE EKSKUL & GALERI DINAMIS -->
```

- [ ] **Step 3: Hapus semua hardcoded `<div class="evc">` dari section event**

Cari dan hapus semua blok dari:
```html
      <div class="evc">
        <div class="evd"><div class="evday">17</div>
```
Sampai penutup `</div>` terakhir sebelum `</div>` penutup `evg`. Pastikan `<div class="evg rv" id="kegiatan-grid">` menjadi kosong (isinya akan diisi oleh JS):
```html
    <div class="evg rv" id="kegiatan-grid">
    </div>
```

- [ ] **Step 4: Upload index-live.html ke Hostinger dan verifikasi**

```bash
# Verifikasi local dulu — buka di browser
open ~/alqomar-muthmainnah/index-live.html
# Scroll ke section Agenda & Event — harus load dari Supabase
```
Lalu upload ke Hostinger → `public_html/index-live.html`

---

## Task 2: Export SPMB ke Excel

**File:** `~/Downloads/05-Claude Project/05-ALQ WEB SEKOLAH/admin-alqomar.html`

- [ ] **Step 1: Tambah SheetJS CDN setelah Supabase CDN**

Cari:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```
Tambahkan setelahnya:
```html
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
```

- [ ] **Step 2: Tambah tombol Export di panel SPMB**

Cari:
```html
      <!-- SPMB -->
      <div id="panel-spmb" class="panel">
        <div class="panel-header">
          <div class="panel-title">Pendaftaran SPMB <span>Data calon peserta didik baru</span></div>
        </div>
```
Ganti dengan:
```html
      <!-- SPMB -->
      <div id="panel-spmb" class="panel">
        <div class="panel-header">
          <div class="panel-title">Pendaftaran SPMB <span>Data calon peserta didik baru</span></div>
          <button class="btn btn-emas" onclick="exportSpmb()">⬇️ Export Excel</button>
        </div>
```

- [ ] **Step 3: Tambah fungsi `exportSpmb()` di dalam blok `<script>`**

Cari (di akhir blok script utama, sebelum `checkSession();`):
```javascript
// ── INIT ─────────────────────────────────────────────────────────────────────
checkSession();
```

Sisipkan fungsi sebelum baris itu:
```javascript
// ── EXPORT EXCEL ─────────────────────────────────────────────────────────────
async function exportSpmb() {
  const { data, error } = await sb.from('spmb_pendaftar')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { toast('Gagal export: ' + error.message, 'error'); return; }
  if (!data || !data.length) { toast('Tidak ada data pendaftar', 'error'); return; }

  const rows = data.map(r => ({
    'Nama Wali': r.nama_wali || '',
    'Email': r.email || '',
    'No. Telp': r.telp || '',
    'Nama Siswa': r.nama_siswa || '',
    'Jenjang': (r.jenjang || '').toUpperCase(),
    'Status': r.status || 'pending',
    'Catatan': r.catatan || '',
    'Tanggal Daftar': r.created_at ? r.created_at.slice(0,10) : '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pendaftar SPMB');

  const today = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, 'SPMB-AlQomar-' + today + '.xlsx');
  toast('✅ File Excel berhasil didownload', 'success');
}
```

- [ ] **Step 4: Test export**

Buka admin-alqomar.html → login → panel SPMB → klik "Export Excel" → file `.xlsx` harus terdownload.

---

## Task 3a: Buat Tabel Supabase untuk Testimoni & FAQ

**Lokasi:** Supabase Dashboard → SQL Editor

- [ ] **Step 1: Jalankan SQL untuk tabel `testimoni`**

Buka Supabase Dashboard → project `gzcgyqntluhxxrvbcwin` → SQL Editor → jalankan:

```sql
CREATE TABLE IF NOT EXISTS testimoni (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama text NOT NULL,
  jabatan text,
  inisial char(2) DEFAULT 'A',
  isi text NOT NULL,
  bintang smallint DEFAULT 5 CHECK (bintang BETWEEN 1 AND 5),
  urutan smallint DEFAULT 1,
  aktif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimoni ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimoni" ON testimoni FOR SELECT USING (true);
CREATE POLICY "auth write testimoni" ON testimoni FOR ALL USING (auth.role() = 'authenticated');
```

- [ ] **Step 2: Jalankan SQL untuk tabel `faq`**

```sql
CREATE TABLE IF NOT EXISTS faq (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pertanyaan text NOT NULL,
  jawaban text NOT NULL,
  kategori text DEFAULT 'Umum',
  urutan smallint DEFAULT 1,
  aktif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read faq" ON faq FOR SELECT USING (true);
CREATE POLICY "auth write faq" ON faq FOR ALL USING (auth.role() = 'authenticated');
```

- [ ] **Step 3: Verifikasi tabel**

Di Supabase → Table Editor → pastikan `testimoni` dan `faq` muncul dengan kolom yang benar.

---

## Task 3b: Panel Testimoni & FAQ di CMS

**File:** `~/Downloads/05-Claude Project/05-ALQ WEB SEKOLAH/admin-alqomar.html`

- [ ] **Step 1: Tambah nav item Testimoni & FAQ di sidebar**

Cari:
```html
      <div class="nav-section">
        <div class="nav-label">PPDB</div>
        <button class="nav-item" onclick="showPanel('spmb',this)">
          <span class="icon">📋</span> Pendaftaran SPMB
        </button>
      </div>
```
Tambahkan section baru SEBELUM section PPDB:
```html
      <div class="nav-section">
        <div class="nav-label">Sosial</div>
        <button class="nav-item" onclick="showPanel('testimoni',this)">
          <span class="icon">💬</span> Testimoni
        </button>
        <button class="nav-item" onclick="showPanel('faq',this)">
          <span class="icon">❓</span> FAQ
        </button>
      </div>
```

- [ ] **Step 2: Tambah panel HTML untuk Testimoni & FAQ**

Cari:
```html
      <!-- SPMB -->
      <div id="panel-spmb" class="panel">
```
Sisipkan DUA panel baru SEBELUM panel SPMB:
```html
      <!-- TESTIMONI -->
      <div id="panel-testimoni" class="panel">
        <div class="panel-header">
          <div class="panel-title">Testimoni <span>Ulasan orang tua & alumni</span></div>
          <button class="btn btn-primary" onclick="openModal('testimoni')">+ Tambah Testimoni</button>
        </div>
        <div class="table-wrap">
          <div id="tbl-testimoni"><div class="loading"><div class="spinner"></div></div></div>
        </div>
      </div>

      <!-- FAQ -->
      <div id="panel-faq" class="panel">
        <div class="panel-header">
          <div class="panel-title">FAQ <span>Pertanyaan yang sering ditanyakan</span></div>
          <button class="btn btn-primary" onclick="openModal('faq')">+ Tambah FAQ</button>
        </div>
        <div class="table-wrap">
          <div id="tbl-faq"><div class="loading"><div class="spinner"></div></div></div>
        </div>
      </div>

      <!-- SPMB -->
      <div id="panel-spmb" class="panel">
```

- [ ] **Step 3: Daftarkan tabel baru di `tableMap`**

Cari:
```javascript
const tableMap = {
  hero: 'hero_slides', berita:'berita', pengumuman:'pengumuman',
  fasilitas:'fasilitas', program:'program_pendidikan',
  galeri:'galeri_eksplore', prestasi:'prestasi',
  kegiatan:'kegiatan', spmb:'spmb_pendaftar'
};
```
Ganti dengan:
```javascript
const tableMap = {
  hero: 'hero_slides', berita:'berita', pengumuman:'pengumuman',
  fasilitas:'fasilitas', program:'program_pendidikan',
  galeri:'galeri_eksplore', prestasi:'prestasi',
  kegiatan:'kegiatan', spmb:'spmb_pendaftar',
  testimoni:'testimoni', faq:'faq'
};
```

- [ ] **Step 4: Tambah judul panel di `titles` dalam `showPanel()`**

Cari:
```javascript
  const titles = { dashboard:'Dashboard', hero:'Hero Slides', berita:'Berita', pengumuman:'Pengumuman', fasilitas:'Fasilitas', program:'Program Pendidikan', galeri:'Galeri Eksplore', prestasi:'Prestasi Siswa', kegiatan:'Kegiatan Kalender', spmb:'Pendaftaran SPMB' };
```
Ganti dengan:
```javascript
  const titles = { dashboard:'Dashboard', hero:'Hero Slides', berita:'Berita', pengumuman:'Pengumuman', fasilitas:'Fasilitas', program:'Program Pendidikan', galeri:'Galeri Eksplore', prestasi:'Prestasi Siswa', kegiatan:'Kegiatan Kalender', spmb:'Pendaftaran SPMB', testimoni:'Testimoni', faq:'FAQ' };
```

- [ ] **Step 5: Tambah label di `labelMap`**

Cari:
```javascript
const labelMap = { hero:'Hero Slide', berita:'Berita', pengumuman:'Pengumuman', fasilitas:'Fasilitas', program:'Konten Program', galeri:'Foto Galeri', prestasi:'Prestasi Siswa', kegiatan:'Kegiatan', spmb:'Pendaftar' };
```
Ganti dengan:
```javascript
const labelMap = { hero:'Hero Slide', berita:'Berita', pengumuman:'Pengumuman', fasilitas:'Fasilitas', program:'Konten Program', galeri:'Foto Galeri', prestasi:'Prestasi Siswa', kegiatan:'Kegiatan', spmb:'Pendaftar', testimoni:'Testimoni', faq:'FAQ' };
```

- [ ] **Step 6: Tambah kolom render ke `buildTable()` dalam `cols`**

Cari bagian akhir `cols` di dalam `buildTable()`:
```javascript
    spmb:       { heads:['Nama Wali','Siswa','Jenjang','Tanggal','Status','Aksi'], row: r => `...` },
  };
```
Tambahkan sebelum `};`:
```javascript
    spmb:       { heads:['Nama Wali','Siswa','Jenjang','Tanggal','Status','Aksi'], row: r => `<td><strong>${r.nama_wali}</strong><br><small>${r.email||''}</small></td><td>${r.nama_siswa}</td><td><span class="badge badge-yellow">${r.jenjang?.toUpperCase()}</span></td><td>${r.created_at?.slice(0,10)||'-'}</td><td>${spmbBadge(r.status)}</td><td>${spmbAksi(r.id, r.status)}</td>` },
    testimoni:  { heads:['Nama','Jabatan','Bintang','Urutan','Status','Aksi'], row: r => `<td><strong>${r.nama}</strong></td><td>${r.jabatan||'-'}</td><td>${'★'.repeat(r.bintang||5)}</td><td>${r.urutan||1}</td><td>${statusBadge(r.aktif)}</td><td>${aksiBtn('testimoni',r.id,r.aktif)}</td>` },
    faq:        { heads:['Pertanyaan','Kategori','Urutan','Status','Aksi'], row: r => `<td><strong>${r.pertanyaan}</strong><br><small style="color:var(--teks-light)">${(r.jawaban||'').slice(0,80)}...</small></td><td>${r.kategori||'Umum'}</td><td>${r.urutan||1}</td><td>${statusBadge(r.aktif)}</td><td>${aksiBtn('faq',r.id,r.aktif)}</td>` },
  };
```

**PENTING:** Hapus baris `spmb` yang lama (yang sudah ada), ganti dengan versi di atas.

- [ ] **Step 7: Tambah form builder untuk Testimoni & FAQ di `buildForm()`**

Cari:
```javascript
    spmb: `
```
Sisipkan SEBELUM baris itu:
```javascript
    testimoni: `
      ${field('Nama','nama','text',v('nama'),true)}
      <div class="field-row">
        ${field('Jabatan / Keterangan','jabatan','text',v('jabatan'))}
        ${field('Inisial (1-2 huruf)','inisial','text',v('inisial')||'A')}
      </div>
      ${field('Isi Testimoni','isi','textarea',v('isi'),true)}
      <div class="field-row">
        ${fieldSelect('Bintang','bintang',[['5','★★★★★ 5'],['4','★★★★☆ 4'],['3','★★★☆☆ 3']],String(v('bintang')||'5'))}
        ${field('Urutan Tampil','urutan','number',v('urutan')||1)}
      </div>
      ${fieldToggle('Tampilkan di website',v('aktif')!==false)}`,
    faq: `
      ${field('Pertanyaan','pertanyaan','text',v('pertanyaan'),true)}
      ${field('Jawaban','jawaban','textarea',v('jawaban'),true)}
      <div class="field-row">
        ${fieldSelect('Kategori','kategori',[['Umum','Umum'],['PPDB','PPDB'],['Akademik','Akademik'],['Fasilitas','Fasilitas'],['Biaya','Biaya']],v('kategori')||'Umum')}
        ${field('Urutan Tampil','urutan','number',v('urutan')||1)}
      </div>
      ${fieldToggle('Aktif',v('aktif')!==false)}`,
    spmb: `
```

- [ ] **Step 8: Daftarkan fields di `saveForm()`**

Cari:
```javascript
    spmb:       ['nama_wali','email','telp','nama_siswa','jenjang','status','catatan'],
```
Tambahkan sebelum itu:
```javascript
    testimoni:  ['nama','jabatan','inisial','isi','bintang','urutan','aktif'],
    faq:        ['pertanyaan','jawaban','kategori','urutan','aktif'],
    spmb:       ['nama_wali','email','telp','nama_siswa','jenjang','status','catatan'],
```

- [ ] **Step 9: Tambah stat card Testimoni di dashboard**

Cari:
```html
          <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-num" id="stat-spmb">-</div><div class="stat-label">Pendaftar SPMB</div></div>
```
Tambahkan setelahnya:
```html
          <div class="stat-card"><div class="stat-icon">💬</div><div class="stat-num" id="stat-testimoni">-</div><div class="stat-label">Testimoni</div></div>
          <div class="stat-card"><div class="stat-icon">❓</div><div class="stat-num" id="stat-faq">-</div><div class="stat-label">FAQ</div></div>
```

- [ ] **Step 10: Update `loadDashboard()` untuk hitung Testimoni & FAQ**

Cari:
```javascript
  const tables = ['berita','pengumuman','hero_slides','fasilitas','prestasi','spmb_pendaftar'];
  const ids    = ['stat-berita','stat-pengumuman','stat-hero','stat-fasilitas','stat-prestasi','stat-spmb'];
```
Ganti dengan:
```javascript
  const tables = ['berita','pengumuman','hero_slides','fasilitas','prestasi','spmb_pendaftar','testimoni','faq'];
  const ids    = ['stat-berita','stat-pengumuman','stat-hero','stat-fasilitas','stat-prestasi','stat-spmb','stat-testimoni','stat-faq'];
```

- [ ] **Step 11: Test CMS — buka admin-alqomar.html → login → cek sidebar ada Testimoni & FAQ → tambah data**

---

## Task 3c: Dynamic Testimoni & FAQ di Website

**File:** `~/alqomar-muthmainnah/index-live.html`

- [ ] **Step 1: Tambah id ke container Testimoni**

Cari:
```html
    <div class="tst-grid rv">
```
Ganti dengan:
```html
    <div class="tst-grid rv" id="tst-grid">
```

- [ ] **Step 2: Tambah id ke container FAQ**

Cari:
```html
    <div class="faqg rv">
```
Ganti dengan:
```html
    <div class="faqg rv" id="faq-grid">
```

- [ ] **Step 3: Tambah script dynamic Testimoni & FAQ**

Sisipkan sebelum tag `<script src="/js/schema-loader.js"></script>`:
```html
<!-- SUPABASE TESTIMONI DINAMIS -->
<script>
(async function() {
  function renderTestimoni(list) {
    var grid = document.getElementById('tst-grid');
    if (!grid || !list || !list.length) return;
    grid.innerHTML = list.map(function(t) {
      var stars = '★'.repeat(t.bintang||5) + '☆'.repeat(5-(t.bintang||5));
      return '<div class="tst-card">'
        + '<div class="tst-qt">"</div>'
        + '<p class="tst-isi">' + (t.isi||'') + '</p>'
        + '<div class="tst-stars">' + stars + '</div>'
        + '<div class="tst-profile">'
        + '<div class="tst-avatar">' + (t.inisial||'A') + '</div>'
        + '<div><div class="tst-nama">' + (t.nama||'') + '</div>'
        + '<div class="tst-peran">' + (t.jabatan||'Orang Tua Siswa') + '</div></div>'
        + '</div></div>';
    }).join('');
  }
  try {
    var res = await window._sb.from('testimoni')
      .select('nama,jabatan,inisial,isi,bintang')
      .eq('aktif', true)
      .order('urutan', {ascending: true})
      .limit(6);
    if (res.error) throw res.error;
    if (res.data && res.data.length) renderTestimoni(res.data);
  } catch(e) { console.warn('Testimoni error:', e.message); }
})();
</script>

<!-- SUPABASE FAQ DINAMIS -->
<script>
(async function() {
  function renderFaq(list) {
    var grid = document.getElementById('faq-grid');
    if (!grid || !list || !list.length) return;
    grid.innerHTML = list.map(function(f) {
      return '<div class="faqc">'
        + '<div class="faqh" onclick="toggleFaq(this)">'
        + '<p>' + (f.pertanyaan||'') + '</p><span class="faqarr">▾</span>'
        + '</div>'
        + '<div class="faqb"><p>' + (f.jawaban||'') + '</p></div>'
        + '</div>';
    }).join('');
  }
  try {
    var res = await window._sb.from('faq')
      .select('pertanyaan,jawaban,kategori')
      .eq('aktif', true)
      .order('urutan', {ascending: true});
    if (res.error) throw res.error;
    if (res.data && res.data.length) renderFaq(res.data);
  } catch(e) { console.warn('FAQ error:', e.message); }
})();
</script>
```

- [ ] **Step 4: Hapus hardcoded Testimoni (opsional — biarkan sebagai fallback)**

Hardcoded Testimoni di `.tst-grid` bisa dibiarkan sebagai fallback visual saat Supabase kosong. Tapi jika sudah ada data di Supabase, JS akan replace kontennya.

- [ ] **Step 5: Upload index-live.html ke Hostinger dan test**

---

## Task 4: Rich Text Editor Quill untuk Berita

**File:** `~/Downloads/05-Claude Project/05-ALQ WEB SEKOLAH/admin-alqomar.html`

- [ ] **Step 1: Tambah Quill CDN**

Cari (setelah SheetJS CDN yang ditambahkan di Task 2):
```html
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
```
Tambahkan setelahnya:
```html
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
```

- [ ] **Step 2: Tambah CSS untuk Quill editor**

Cari closing tag `</style>` terakhir sebelum `<!-- Cropper.js -->`:
```html
</style>
<!-- Cropper.js -->
```
Sisipkan style sebelum `<!-- Cropper.js -->`:
```html
/* Quill Editor */
.ql-container { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; border-radius: 0 0 8px 8px; border-color: var(--abu-border) !important; background: var(--abu); }
.ql-toolbar { border-radius: 8px 8px 0 0; border-color: var(--abu-border) !important; background: #fff; }
.ql-container:focus-within { border-color: var(--hijau) !important; background: var(--putih); }
.ql-editor { min-height: 180px; }
</style>
<!-- Cropper.js -->
```

- [ ] **Step 3: Ganti textarea konten di form Berita dengan Quill**

Cari dalam `buildForm()`:
```javascript
    berita: `
      ${field('Judul Berita','judul','text',v('judul'),true)}
      ${field('Ringkasan','ringkasan','textarea',v('ringkasan'))}
      ${field('Konten Lengkap','konten','textarea',v('konten'))}
      ${field('Tanggal Publikasi','tanggal','date',v('tanggal'))}
      ${uploadField(v('foto_url'))}
      ${fieldToggle('Aktif',v('aktif')!==false)}`,
```
Ganti dengan:
```javascript
    berita: `
      ${field('Judul Berita','judul','text',v('judul'),true)}
      ${field('Ringkasan','ringkasan','textarea',v('ringkasan'))}
      <div class="field">
        <label>Konten Lengkap</label>
        <div id="quill-editor" style="border-radius:8px;overflow:hidden"></div>
        <input type="hidden" id="f-konten" value="">
      </div>
      ${field('Tanggal Publikasi','tanggal','date',v('tanggal'))}
      ${uploadField(v('foto_url'))}
      ${fieldToggle('Aktif',v('aktif')!==false)}`,
```

- [ ] **Step 4: Init Quill setelah modal dibuka**

Tambahkan variabel `quillInstance` di atas deklarasi variabel global.

Cari:
```javascript
let currentTable = null;
let editId = null;
let allData = {};
let uploadedUrl = null;
```
Ganti dengan:
```javascript
let currentTable = null;
let editId = null;
let allData = {};
let uploadedUrl = null;
let quillInstance = null;
```

- [ ] **Step 5: Init Quill dalam `openModal()` setelah innerHTML set**

Cari:
```javascript
  document.getElementById('modal-body').innerHTML = buildForm(name, data);
  document.getElementById('modal-overlay').style.display = 'flex';
  if (data?.foto_url) { const p = document.getElementById('foto-preview'); if(p){p.src=data.foto_url;p.style.display='block';} }
```
Ganti dengan:
```javascript
  document.getElementById('modal-body').innerHTML = buildForm(name, data);
  document.getElementById('modal-overlay').style.display = 'flex';
  if (data?.foto_url) { const p = document.getElementById('foto-preview'); if(p){p.src=data.foto_url;p.style.display='block';} }

  if (name === 'berita') {
    setTimeout(function() {
      var editorEl = document.getElementById('quill-editor');
      if (!editorEl) return;
      if (quillInstance) { try { quillInstance = null; } catch(e){} }
      quillInstance = new Quill('#quill-editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold','italic','underline'],
            [{list:'ordered'},{list:'bullet'}],
            ['link'],
            ['clean']
          ]
        }
      });
      var existing = data ? (data.konten || '') : '';
      if (existing) quillInstance.root.innerHTML = existing;
    }, 50);
  }
```

- [ ] **Step 6: Update `saveForm()` untuk ambil konten dari Quill**

Cari:
```javascript
  const payload = {};
  (fields[name] || []).forEach(k => { const v = getFormValue(k); if (v !== undefined) payload[k] = v; });
```
Ganti dengan:
```javascript
  const payload = {};
  (fields[name] || []).forEach(k => { const v = getFormValue(k); if (v !== undefined) payload[k] = v; });
  if (name === 'berita' && quillInstance) {
    payload.konten = quillInstance.root.innerHTML;
  }
```

- [ ] **Step 7: Reset Quill saat modal ditutup**

Cari:
```javascript
function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; uploadedUrl = null; }
```
Ganti dengan:
```javascript
function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  uploadedUrl = null;
  quillInstance = null;
}
```

- [ ] **Step 8: Test — buka admin → Berita → Tambah Berita → editor harus tampil dengan toolbar bold/italic/list**

---

## Urutan Eksekusi yang Disarankan

```
Task 3a → (SQL Supabase dulu)
Task 1  → (Fix kegiatan — masalah utama)
Task 3b → (Tambah panel CMS Testimoni & FAQ)
Task 3c → (Dynamic Testimoni & FAQ di website)
Task 2  → (Export Excel SPMB)
Task 4  → (Quill editor Berita)
```

## Upload Checklist

Setelah semua task selesai:

- [ ] Upload `index-live.html` ke Hostinger `public_html/`
- [ ] Upload `admin-alqomar.html` ke Hostinger `public_html/`
- [ ] Test di browser incognito: alqomar.sch.id — cek Kegiatan, Testimoni, FAQ load dari Supabase
- [ ] Test admin: alqomar.sch.id/admin-alqomar.html — cek semua panel baru berfungsi
