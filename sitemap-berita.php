<?php
// Sitemap dinamis berita — tarik semua berita aktif dari Supabase.
// Berita baru otomatis masuk sitemap tanpa edit manual.
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=3600');

$key = 'sb_publishable_F641BOnF7LUfmctyCmiJvw_yo6aiFXY';
$api = 'https://gzcgyqntluhxxrvbcwin.supabase.co/rest/v1/berita'
     . '?aktif=eq.true'
     . '&select=slug,tanggal,created_at'
     . '&order=tanggal.desc.nullslast'
     . '&limit=2000';

$ch = curl_init($api);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER     => ['apikey: ' . $key, 'Authorization: Bearer ' . $key],
  CURLOPT_TIMEOUT        => 8,
  CURLOPT_SSL_VERIFYPEER => true,
]);
$res  = curl_exec($ch);
$rows = json_decode($res, true);

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

// indeks daftar berita
echo '  <url><loc>https://www.alqomar.sch.id/berita</loc>'
   . '<changefreq>daily</changefreq><priority>0.7</priority></url>' . "\n";

if (is_array($rows)) {
  foreach ($rows as $r) {
    if (empty($r['slug'])) continue;
    $loc = 'https://www.alqomar.sch.id/berita/' . rawurlencode($r['slug']);
    $lastmod = '';
    $d = !empty($r['tanggal']) ? $r['tanggal'] : (!empty($r['created_at']) ? $r['created_at'] : '');
    if ($d) { $ts = strtotime($d); if ($ts) $lastmod = date('Y-m-d', $ts); }
    echo '  <url><loc>' . htmlspecialchars($loc, ENT_XML1, 'UTF-8') . '</loc>';
    if ($lastmod) echo '<lastmod>' . $lastmod . '</lastmod>';
    echo '<changefreq>monthly</changefreq><priority>0.6</priority></url>' . "\n";
  }
}

echo '</urlset>' . "\n";
