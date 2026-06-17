<?php
// Server-side Open Graph untuk berita — crawler WhatsApp/FB/Telegram tidak jalankan JS,
// jadi og:image/og:title/og:description harus ditulis di HTML mentah dari sini.

$slug = isset($_GET['slug']) ? preg_replace('/\s+/', '', $_GET['slug']) : '';

$og_title = 'Berita - Al-Qomar Muthmainnah';
$og_desc  = 'Berita terkini dari Al-Qomar Muthmainnah';
$og_image = 'https://www.alqomar.sch.id/images/og-alqomar.jpg';
$og_url   = 'https://www.alqomar.sch.id/berita/' . rawurlencode($slug);

if ($slug !== '') {
  $key = 'sb_publishable_F641BOnF7LUfmctyCmiJvw_yo6aiFXY';
  $api = 'https://gzcgyqntluhxxrvbcwin.supabase.co/rest/v1/berita'
       . '?slug=eq.' . rawurlencode($slug)
       . '&aktif=eq.true'
       . '&select=judul,ringkasan,foto_url,foto_urls&limit=1';

  $ch = curl_init($api);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['apikey: ' . $key, 'Authorization: Bearer ' . $key],
    CURLOPT_TIMEOUT        => 6,
    CURLOPT_SSL_VERIFYPEER => true,
  ]);
  $res = curl_exec($ch);
  curl_close($ch);

  $rows = json_decode($res, true);
  if (is_array($rows) && count($rows)) {
    $b = $rows[0];
    if (!empty($b['judul']))     $og_title = $b['judul'] . ' — Al-Qomar Muthmainnah';
    if (!empty($b['ringkasan'])) $og_desc  = $b['ringkasan'];
    $cover = '';
    if (!empty($b['foto_url'])) {
      $cover = $b['foto_url'];
    } elseif (!empty($b['foto_urls']) && is_array($b['foto_urls'])) {
      $cover = $b['foto_urls'][0];
    }
    if ($cover) $og_image = $cover;
  }
}

function e($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }

$og = "\n"
  . '  <title>' . e($og_title) . "</title>\n"
  . '  <meta name="description" content="' . e($og_desc) . "\" />\n"
  . '  <meta property="og:type" content="article" />' . "\n"
  . '  <meta property="og:site_name" content="Al-Qomar Muthmainnah" />' . "\n"
  . '  <meta property="og:title" content="' . e($og_title) . "\" />\n"
  . '  <meta property="og:description" content="' . e($og_desc) . "\" />\n"
  . '  <meta property="og:image" content="' . e($og_image) . "\" />\n"
  . '  <meta property="og:url" content="' . e($og_url) . "\" />\n"
  . '  <meta name="twitter:card" content="summary_large_image" />' . "\n"
  . '  <meta name="twitter:title" content="' . e($og_title) . "\" />\n"
  . '  <meta name="twitter:description" content="' . e($og_desc) . "\" />\n"
  . '  <meta name="twitter:image" content="' . e($og_image) . "\" />\n";

// Pakai berita-detail.html sebagai satu-satunya sumber layout/JS,
// cukup ganti title/description statis dengan blok OG dinamis.
$html = file_get_contents(__DIR__ . '/berita-detail.html');
$html = preg_replace('#\s*<title>.*?</title>#s', '', $html, 1);
$html = preg_replace('#\s*<meta name="description"[^>]*>#', '', $html, 1);
$html = preg_replace('#(<head>)#', '$1' . $og, $html, 1);

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
echo $html;
