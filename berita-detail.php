<?php
// ── OG tags server-side untuk preview WhatsApp/Facebook (crawler tidak jalankan JS) ──
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';
if ($slug === '' && isset($_SERVER['REQUEST_URI'])) {
  $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $parts = array_values(array_filter(explode('/', $path)));
  if (count($parts) >= 2 && $parts[0] === 'berita') { $slug = $parts[1]; }
}
$slug = preg_replace('/\.html$/', '', $slug);

// Default (fallback kalau slug kosong / berita tak ketemu)
$ogTitle = 'Berita — Al-Qomar Muthmainnah';
$ogDesc  = 'Berita terkini dari Al-Qomar Muthmainnah — Sekolah Islam Terpadu Akreditasi A, Kalideres Jakarta Barat.';
$ogImage = 'https://www.alqomar.sch.id/images/IMG_7809.webp';
$ogUrl   = 'https://www.alqomar.sch.id/berita' . ($slug !== '' ? '/' . $slug : '');

// null = belum bisa dipastikan (Supabase gagal dihubungi); true/false = jawaban pasti dari DB
$ketemu = null;
$ogTanggal = '';

if ($slug !== '') {
  $SB  = 'https://gzcgyqntluhxxrvbcwin.supabase.co';
  $KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6Y2d5cW50bHVoeHhydmJjd2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODQ4NzAsImV4cCI6MjA4OTA2MDg3MH0.s54F8pW-Z8Ox8y1coz8oI71WqYkRJ4tY2CIR0vfMEKQ';
  $api = $SB . '/rest/v1/berita?select=judul,ringkasan,foto_url,tanggal&aktif=eq.true&slug=eq.' . rawurlencode($slug) . '&limit=1';
  $raw = null;
  if (function_exists('curl_init')) {
    $ch = curl_init($api);
    curl_setopt_array($ch, array(
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 5,
      CURLOPT_HTTPHEADER => array('apikey: ' . $KEY, 'Authorization: Bearer ' . $KEY),
    ));
    $raw = curl_exec($ch);
    // curl_close() sengaja tidak dipanggil: sejak PHP 8.0 fungsinya tidak
    // berefek apa-apa dan sejak 8.5 memicu peringatan Deprecated yang akan
    // tercetak ke dalam HTML — merusak tag OG begitu Hostinger menaikkan PHP.
    unset($ch);
  } else {
    $ctx = stream_context_create(array('http' => array(
      'header' => "apikey: $KEY\r\nAuthorization: Bearer $KEY\r\n",
      'timeout' => 5,
    )));
    $raw = @file_get_contents($api, false, $ctx);
  }
  if ($raw) {
    $rows = json_decode($raw, true);
    if (is_array($rows)) {
      $ketemu = count($rows) > 0;
      if ($ketemu) {
        $b = $rows[0];
        if (!empty($b['judul']))     { $ogTitle = $b['judul'] . ' — Al-Qomar Muthmainnah'; }
        if (!empty($b['ringkasan'])) { $ogDesc  = $b['ringkasan']; }
        if (!empty($b['foto_url']))  { $ogImage = $b['foto_url']; }
        if (!empty($b['tanggal']))   { $ogTanggal = $b['tanggal']; }
      }
    }
  }
}

// Slug diminta tapi DB menjawab pasti "tidak ada" -> 404 sungguhan, bukan soft-404.
// $ketemu === null berarti Supabase gagal dihubungi; JANGAN 404 di situ, kalau tidak
// gangguan sesaat bisa membuat Google mencabut artikel yang sebenarnya sehat.
if ($slug !== '' && $ketemu === false) {
  http_response_code(404);
}
function e($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= e($ogTitle) ?></title>
  <meta name="description" content="<?= e($ogDesc) ?>" />
  <link rel="canonical" href="<?= e($ogUrl) ?>" />
<?php if ($slug !== '' && $ketemu === false): ?>
  <meta name="robots" content="noindex, follow" />
<?php endif; ?>
<?php if ($ketemu === true): ?>
  <script type="application/ld+json">
  <?= json_encode(array(
    '@context' => 'https://schema.org',
    '@graph' => array(
      array(
        '@type' => 'NewsArticle',
        'headline' => mb_substr(isset($b['judul']) ? $b['judul'] : '', 0, 110),
        'description' => $ogDesc,
        'image' => array($ogImage),
        'datePublished' => $ogTanggal,
        'dateModified' => $ogTanggal,
        'inLanguage' => 'id-ID',
        'mainEntityOfPage' => array('@type' => 'WebPage', '@id' => $ogUrl),
        'author' => array('@type' => 'Organization', 'name' => 'Al-Qomar Muthmainnah', 'url' => 'https://www.alqomar.sch.id/'),
        'publisher' => array(
          '@type' => 'Organization',
          'name' => 'Al-Qomar Muthmainnah',
          'url' => 'https://www.alqomar.sch.id/',
          'logo' => array('@type' => 'ImageObject', 'url' => 'https://www.alqomar.sch.id/logo/logo.png')
        )
      ),
      array(
        '@type' => 'BreadcrumbList',
        'itemListElement' => array(
          array('@type' => 'ListItem', 'position' => 1, 'name' => 'Beranda', 'item' => 'https://www.alqomar.sch.id/'),
          array('@type' => 'ListItem', 'position' => 2, 'name' => 'Berita', 'item' => 'https://www.alqomar.sch.id/berita'),
          array('@type' => 'ListItem', 'position' => 3, 'name' => isset($b['judul']) ? $b['judul'] : 'Artikel')
        )
      )
    )
  ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>
  </script>
<?php endif; ?>

  <!-- Open Graph — preview saat dibagikan di WA/Instagram/Facebook (diisi server-side dari Supabase) -->
  <meta property="og:site_name" content="Al-Qomar Muthmainnah" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="<?= e($ogTitle) ?>" />
  <meta property="og:description" content="<?= e($ogDesc) ?>" />
  <meta property="og:image" content="<?= e($ogImage) ?>" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="<?= e($ogUrl) ?>" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?= e($ogTitle) ?>" />
  <meta name="twitter:description" content="<?= e($ogDesc) ?>" />
  <meta name="twitter:image" content="<?= e($ogImage) ?>" />

  <!-- Font: /cf-fonts/* 404 sejak Juni 2026 (aset Cloudflare yang sudah tidak ada).
       Dialihkan ke Google Fonts, sumber yang sama dipakai index.html. -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3" integrity="sha384-+exuGmToMCgcfiTDu+P+1aCmlH2Mis7lstkjVmVHdwvJqtNNqhxMreqsIe6bVstn" crossorigin="anonymous"></script>
  <!-- Sanitasi HTML konten CMS sebelum masuk DOM (mitigasi stored XSS) -->
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js" integrity="sha384-eEu5CTj3qGvu9PdJuS+YlkNi7d2XxQROAFYOr59zgObtlcux1ae1Il3u7jvdCSWu" crossorigin="anonymous"></script>
  <style>
    :root {
      --hijau-tua: #1a4731;
      --hijau: #2d6a4f;
      --hijau-muda: #52b788;
      --hijau-terang: #95d5b2;
      --krem: #f8f4ee;
      --putih: #ffffff;
      --abu: #6b7280;
      --teks: #1f2937;
      --border: #e5e7eb;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--krem); color: var(--teks); min-height: 100vh; }
    nav { background: var(--hijau-tua); padding: 16px 24px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
    nav a.back-btn { color: var(--hijau-terang); text-decoration: none; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
    nav a.back-btn:hover { color: #fff; }
    nav .nav-brand { font-family: 'Amiri', serif; color: #fff; font-size: 18px; font-weight: 700; }
    nav .nav-divider { color: var(--hijau-muda); margin: 0 4px; }
    nav .nav-section { color: var(--hijau-terang); font-size: 13px; }
    #loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--hijau-terang); border-top-color: var(--hijau); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    #loading p { color: var(--abu); font-size: 14px; }
    #error { display: none; text-align: center; padding: 80px 24px; }
    #error .error-icon { font-size: 48px; margin-bottom: 16px; }
    #error h2 { color: var(--hijau-tua); margin-bottom: 8px; }
    #error p { color: var(--abu); font-size: 14px; }
    #error a { display: inline-block; margin-top: 20px; padding: 10px 24px; background: var(--hijau); color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; }
    #content { display: none; }
    .hero { background: linear-gradient(135deg, var(--hijau-tua) 0%, var(--hijau) 100%); padding: 60px 24px 40px; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -60px; right: -60px; width: 300px; height: 300px; background: rgba(255,255,255,0.03); border-radius: 50%; }
    .hero-inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); color: var(--hijau-terang); font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 999px; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); }
    .hero h1 { font-size: clamp(22px, 4vw, 34px); font-weight: 700; color: #fff; line-height: 1.35; margin-bottom: 20px; }
    .meta { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; }
    .meta-item { display: flex; align-items: center; gap: 6px; color: var(--hijau-terang); font-size: 13px; }
    .foto-container { max-width: 800px; margin: -20px auto 0; padding: 0 24px; position: relative; z-index: 2; }
    .foto-container img { width: 100%; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); display: block; max-height: 420px; object-fit: cover; }
    .artikel-wrap { max-width: 800px; margin: 0 auto; padding: 40px 24px 80px; }
    .ringkasan-box { background: #fff; border-left: 4px solid var(--hijau-muda); border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .ringkasan-box p { font-size: 15px; line-height: 1.8; color: var(--teks); font-style: italic; }
    .konten-body { background: #fff; border-radius: 16px; padding: 36px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); font-size: 15px; line-height: 1.9; color: #374151; }
    .konten-body p { margin-bottom: 16px; }
    .konten-body p:last-child { margin-bottom: 0; }
    .konten-body strong { color: var(--hijau-tua); }
    .konten-body ul, .konten-body ol { padding-left: 20px; margin-bottom: 16px; }
    .konten-body li { margin-bottom: 6px; }
    .konten-body h2, .konten-body h3 { color: var(--hijau-tua); margin: 24px 0 12px; font-weight: 700; }
    .share-section { margin-top: 32px; padding: 24px; background: #fff; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
    .share-label { font-size: 13px; font-weight: 600; color: var(--abu); text-transform: uppercase; letter-spacing: 0.6px; }
    .share-btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; }
    .share-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .share-wa { background: #25D366; color: #fff; }
    .share-copy { background: var(--krem); color: var(--teks); border: 1px solid var(--border); }
    .share-copy.copied { background: var(--hijau-terang); color: var(--hijau-tua); }
    .berita-lain { max-width: 800px; margin: 0 auto; padding: 0 24px 80px; }
    .section-title { font-size: 18px; font-weight: 700; color: var(--hijau-tua); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid var(--hijau-terang); }
    .berita-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .berita-card { background: #fff; border-radius: 12px; overflow: hidden; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
    .berita-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
    .berita-card img { width: 100%; height: 130px; object-fit: cover; }
    .berita-card-placeholder { width: 100%; height: 130px; background: linear-gradient(135deg, var(--hijau-tua), var(--hijau)); display: flex; align-items: center; justify-content: center; font-size: 28px; }
    .berita-card-body { padding: 14px; }
    .berita-card-tanggal { font-size: 11px; color: var(--abu); margin-bottom: 6px; }
    .berita-card-judul { font-size: 13px; font-weight: 600; color: var(--teks); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    footer { background: var(--hijau-tua); color: var(--hijau-terang); text-align: center; padding: 24px; font-size: 13px; }
    footer a { color: var(--hijau-terang); text-decoration: none; }
    @media (max-width: 600px) { .konten-body { padding: 24px 20px; } .hero { padding: 40px 20px 30px; } .berita-grid { grid-template-columns: 1fr 1fr; } }
  </style>
</head>
<body>

<nav>
  <a href="/" class="back-btn">
    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
    Kembali
  </a>
  <span class="nav-divider">•</span>
  <span class="nav-brand">Al-Qomar Muthmainnah</span>
  <span class="nav-divider">|</span>
  <span class="nav-section">Berita & Kegiatan</span>
</nav>

<div id="loading">
  <div class="spinner"></div>
  <p>Memuat berita...</p>
</div>

<div id="error">
  <div class="error-icon">📰</div>
  <h2>Berita tidak ditemukan</h2>
  <p>Berita yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.</p>
  <a href="/">← Kembali ke Beranda</a>
</div>

<div id="content">
  <div class="hero">
    <div class="hero-inner">
      <div class="badge">📰 Berita Sekolah</div>
      <h1 id="judul-berita">–</h1>
      <div class="meta">
        <div class="meta-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span id="tanggal-berita">–</span>
        </div>
        <div class="meta-item">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Al-Qomar Muthmainnah, Tegal Alur</span>
        </div>
      </div>
    </div>
  </div>

  <div class="foto-container" id="foto-container"></div>

  <div class="artikel-wrap">
    <div class="ringkasan-box" id="ringkasan-box" style="display:none;">
      <p id="ringkasan-berita"></p>
    </div>
    <div class="konten-body" id="konten-berita"></div>
    <div class="share-section">
      <span class="share-label">Bagikan:</span>
      <a id="share-wa" href="#" target="_blank" class="share-btn share-wa">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L0 24l6.335-1.658A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.513-5.17-1.406l-.371-.22-3.762.985 1.003-3.663-.241-.384A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        WhatsApp
      </a>
      <button onclick="copyLink(this)" class="share-btn share-copy">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Salin Link
      </button>
    </div>
  </div>

  <div class="berita-lain">
    <div class="section-title">📌 Berita Lainnya</div>
    <div class="berita-grid" id="berita-lain-grid"></div>
  </div>
</div>

<footer>
  <p>© 2026 Al-Qomar Muthmainnah — <a href="/">alqomar.sch.id</a></p>
</footer>

<script>
  const SUPABASE_URL = 'https://gzcgyqntluhxxrvbcwin.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6Y2d5cW50bHVoeHhydmJjd2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODQ4NzAsImV4cCI6MjA4OTA2MDg3MH0.s54F8pW-Z8Ox8y1coz8oI71WqYkRJ4tY2CIR0vfMEKQ';
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
    document.title = judul + ' — Al-Qomar Muthmainnah';
    document.querySelector('meta[property="og:title"]').setAttribute('content', judul + ' — Al-Qomar Muthmainnah');
    document.querySelector('meta[property="og:description"]').setAttribute('content', ringkasan || '');
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', judul + ' — Al-Qomar Muthmainnah');
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', ringkasan || '');
    document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
    if (foto) {
      document.querySelector('meta[property="og:image"]').setAttribute('content', foto);
      document.querySelector('meta[name="twitter:image"]').setAttribute('content', foto);
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
    return t.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?width=' + w + '&quality=72&resize=contain';
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
      const main = `<img src="${escUrl(imgCms(fotos[0],900))}"${attrCms(fotos[0],[600,900,1200],'(max-width:768px) 100vw, 760px')} alt="${esc(b.judul)}" decoding="async" style="width:100%;border-radius:12px;display:block" />`;
      const rest = fotos.slice(1);
      const thumbs = rest.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;margin-top:10px">${rest.map((u,i)=>`<a href="${escUrl(imgCms(u,1600))}" target="_blank" rel="noopener"><img src="${escUrl(imgCms(u,300))}"${attrCms(u,[220,300,440],'110px')} alt="${esc(b.judul)} foto ${i+2}" width="110" height="90" loading="lazy" decoding="async" style="width:100%;height:90px;object-fit:cover;border-radius:8px;cursor:zoom-in" /></a>`).join('')}</div>` : '';
      fc.innerHTML = main + thumbs;
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
    if (!slug) { window.location.href = '/'; return; }
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
</script>
</body>
</html>
