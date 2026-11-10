/* berita-detail.js — dipindah dari skrip inline berita-detail.php (10 Nov 2026) agar lolos CSP script-src self */
  const SUPABASE_URL = 'https://gzcgyqntluhxxrvbcwin.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_F641BOnF7LUfmctyCmiJvw_yo6aiFXY';
  // Kalau CDN Supabase gagal/lambat dimuat, jangan biarkan halaman
  // nyangkut selamanya di "Memuat berita..." — langsung tampilkan error.
  let db = null;
  if (typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  function timeout(ms) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
  }

  function getSlug() {
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get('slug');
    if (slugParam) return slugParam;
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'berita') return parts[1].replace(/\.html$/, '');
    return null;
  }

  function formatTanggal(tgl) {
    if (!tgl) return '';
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function updateOG(judul, ringkasan, foto) {
    // Update meta OG dengan data berita yang sebenarnya
    // <title> sudah dipangkas server-side (≤60 kar.) — hanya isi kalau server gagal (masih judul default)
    if (document.title === 'Berita — Al-Qomar Muthmainnah') document.title = judul + ' — Al-Qomar Muthmainnah';
    document.querySelector('meta[property="og:title"]').setAttribute('content', judul + ' — Al-Qomar Muthmainnah');
    document.querySelector('meta[property="og:description"]').setAttribute('content', ringkasan || '');
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', judul + ' — Al-Qomar Muthmainnah');
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', ringkasan || '');
    document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
    if (foto) {
      const og = imgCms(foto, 1200).replace('&resize=contain', '&height=630&resize=cover');
      document.querySelector('meta[property="og:image"]').setAttribute('content', og);
      document.querySelector('meta[name="twitter:image"]').setAttribute('content', og);
    }
  }

  // --- Pengaman keluaran ------------------------------------------------
  // Semua nilai dari tabel `berita` (judul, foto_url, slug, konten) berasal
  // dari CMS. Sebelum ini dimasukkan mentah ke innerHTML / atribut src =>
  // stored XSS bila akun CMS atau baris database disusupi.
  const esc = s => (s == null ? '' : String(s)).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const escUrl = u => { const t = String(u == null ? '' : u).trim(); return /^(?:https?:\/\/|\/)/i.test(t) ? esc(t) : ''; };
  // Gambar CMS diminta seukuran pakainya, bukan berkas unggahan mentah.
  // Supabase mengecilkan di server dan menegosiasikan WebP lewat header Accept.
  const CMS_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i;
  function imgCms(u, w) {
    const t = String(u || '');
    if (!CMS_RE.test(t)) return t;
    return t.split('?')[0];
  }
  function attrCms(u, lebar, sizes) {
    const t = String(u || '');
    if (!CMS_RE.test(t)) return '';
    return ` srcset="${esc(lebar.map(w => imgCms(t, w) + ' ' + w + 'w').join(', '))}" sizes="${esc(sizes)}"`;
  }
  const SANITASI_TAG=['p','br','hr','strong','b','em','i','u','s','sub','sup','ul','ol','li','h2','h3','h4','h5','h6','blockquote','a','img','figure','figcaption','span','div','table','thead','tbody','tfoot','tr','th','td','code','pre'];
  const SANITASI_ATTR=['href','title','target','rel','src','srcset','sizes','alt','width','height','class','loading','decoding'];
  let __purifyHook = false;
  // Fail-closed: tanpa DOMPurify, HTML diescape jadi teks biasa.
  function bersihkanHtml(html) {
    if (html == null || html === '') return '';
    const D = window.DOMPurify;
    if (!D || typeof D.sanitize !== 'function') return esc(html);
    if (!__purifyHook) {
      __purifyHook = true;
      D.addHook('afterSanitizeAttributes', n => {
        if (n.tagName === 'A' && n.getAttribute('href')) { n.setAttribute('target','_blank'); n.setAttribute('rel','noopener noreferrer nofollow'); }
        if (n.tagName === 'IMG') { n.setAttribute('loading','lazy'); n.setAttribute('decoding','async'); }
      });
    }
    return D.sanitize(String(html), {
      ALLOWED_TAGS: SANITASI_TAG, ALLOWED_ATTR: SANITASI_ATTR,
      ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false,
      FORBID_TAGS: ['script','style','iframe','object','embed','form','input','button','svg','math','link','meta','base'],
      FORBID_ATTR: ['style','srcdoc','formaction','xlink:href'],
      ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i
    });
  }

  function renderBerita(b) {
    updateOG(b.judul, b.ringkasan, b.foto_url);
    document.getElementById('judul-berita').textContent = b.judul;
    document.getElementById('tanggal-berita').textContent = formatTanggal(b.tanggal);
    const fotos = (Array.isArray(b.foto_urls) && b.foto_urls.length) ? b.foto_urls.filter(Boolean) : (b.foto_url ? [b.foto_url] : []);
    if (fotos.length) {
      const fc = document.getElementById('foto-container');
      const main = `<img src="${escUrl(imgCms(fotos[0],900))}"${attrCms(fotos[0],[600,900,1200],'(max-width:940px) 100vw, 900px')} alt="${esc(b.judul)}" decoding="async" style="width:100%;border-radius:12px;display:block" />`;
      const rest = fotos.slice(1);
      const thumbs = rest.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:10px">${rest.map((u,i)=>`<a href="${escUrl(imgCms(u,1600))}" target="_blank" rel="noopener"><img src="${escUrl(imgCms(u,300))}"${attrCms(u,[220,300,440],'110px')} alt="${esc(b.judul)} foto ${i+2}" width="110" height="90" loading="lazy" decoding="async" style="width:100%;height:90px;object-fit:cover;border-radius:8px;cursor:zoom-in" /></a>`).join('')}</div>` : '';
      // Foto utama sudah dirender server dengan URL yang sama -> biarkan (tidak diunduh ulang,
      // atribut width/height dari server tetap ada); cukup tambahkan foto lainnya.
      const ada = fc.querySelector(':scope > img');
      if (ada && ada.getAttribute('src') === imgCms(fotos[0],900)) {
        fc.querySelectorAll(':scope > div').forEach(n => n.remove());
        if (thumbs) fc.insertAdjacentHTML('beforeend', thumbs);
      } else {
        fc.innerHTML = main + thumbs;
      }
      tandaiPotret();
    }
    if (b.ringkasan) {
      document.getElementById('ringkasan-berita').textContent = b.ringkasan;
      document.getElementById('ringkasan-box').style.display = 'block';
    }
    const kontenEl = document.getElementById('konten-berita');
    if (b.konten) {
      if (/<[a-z][\s\S]*>/i.test(b.konten)) {
        kontenEl.innerHTML = bersihkanHtml(b.konten);
      } else {
        kontenEl.innerHTML = b.konten.split('\n\n').filter(p => p.trim()).map(p => `<p>${esc(p.trim())}</p>`).join('');
      }
    }
    const shareText = encodeURIComponent(`${b.judul}\n\n${b.ringkasan || ''}\n\n🔗 ${window.location.href}`);
    document.getElementById('share-wa').href = `https://wa.me/?text=${shareText}`;
  }

  function renderBeritaLain(list) {
    const grid = document.getElementById('berita-lain-grid');
    if (!list.length) { grid.closest('.berita-lain').style.display = 'none'; return; }
    grid.innerHTML = list.map(b => `
      <a href="/berita/${encodeURIComponent(b.slug)}" class="berita-card">
        ${b.foto_url ? `<img src="${escUrl(imgCms(b.foto_url,400))}"${attrCms(b.foto_url,[300,400,600],'(max-width:640px) 45vw, 240px')} alt="${esc(b.judul)}" loading="lazy" decoding="async" />` : `<div class="berita-card-placeholder">🕌</div>`}
        <div class="berita-card-body">
          <div class="berita-card-tanggal">${formatTanggal(b.tanggal)}</div>
          <div class="berita-card-judul">${esc(b.judul)}</div>
        </div>
      </a>`).join('');
  }

  function copyLink(btn) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      btn.classList.add('copied');
      btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Tersalin!`;
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Salin Link`;
      }, 2500);
    });
  }

  async function loadBerita() {
    const slug = getSlug();
    if (!slug) {
      // Dulu: langsung lempar diam-diam ke beranda (terasa seperti "nyasar"
      // tanpa penjelasan). Sekarang: tampilkan pesan error yang jelas,
      // dengan link kembali ke beranda yang bisa dipilih sendiri oleh pengguna.
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      return;
    }
    if (!db) {
      // CDN Supabase gagal dimuat — tampilkan error, jangan nyangkut di loading
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      return;
    }
    try {
      const { data, error } = await Promise.race([
        db.from('berita').select('*').eq('slug', slug).eq('aktif', true).single(),
        timeout(12000)
      ]);
      if (error || !data) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        return;
      }
      renderBerita(data);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      try {
        const { data: lain } = await Promise.race([
          db.from('berita').select('judul,slug,foto_url,tanggal').eq('aktif', true).neq('slug', slug).order('tanggal', { ascending: false }).limit(3),
          timeout(12000)
        ]);
        if (lain) renderBeritaLain(lain);
      } catch (lainErr) {
        document.getElementById('berita-lain-grid').closest('.berita-lain').style.display = 'none';
      }
    } catch (err) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
    }
  }

  loadBerita();
  var _cp=document.querySelector('[data-copylink]');if(_cp)_cp.addEventListener('click',function(){copyLink(_cp);});
