/**
 * alqomar.sch.id — schema-loader.js
 * Diperbaiki: 19 Mei 2026
 * File ini sebelumnya 0 byte. Sekarang berisi:
 * 1. Auto-inject BreadcrumbList schema per halaman
 * 2. Auto-fix canonical URL jika non-www
 * 3. Lazy video embed helper
 */

(function () {
  'use strict';

  const BASE_URL = 'https://www.alqomar.sch.id';

  // ----------------------------------------------------------
  // 1. BREADCRUMB SCHEMA — inject otomatis berdasar URL path
  // ----------------------------------------------------------
  function injectBreadcrumb() {
    const path = window.location.pathname;
    const items = [
      { pos: 1, name: 'Beranda', url: BASE_URL + '/' }
    ];

    const pageMap = {
      '/ppdb.html':    { pos: 2, name: 'PPDB 2026/2027' },
      '/sdit.html':    { pos: 2, name: 'SDIT' },
      '/smpit.html':   { pos: 2, name: 'SMPIT' },
      '/kb-tkit.html': { pos: 2, name: 'KB & TKIT' },
      '/program.html': { pos: 2, name: 'Program Unggulan' },
      '/berita.html':  { pos: 2, name: 'Berita' },
      '/kontak.html':  { pos: 2, name: 'Kontak' },
    };

    if (pageMap[path]) {
      items.push({
        pos: pageMap[path].pos,
        name: pageMap[path].name,
        url: BASE_URL + path
      });
    }

    if (items.length < 2) return; // skip untuk homepage

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map(item => ({
        '@type': 'ListItem',
        'position': item.pos,
        'name': item.name,
        'item': item.url
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ----------------------------------------------------------
  // 2. CANONICAL AUTO-FIX — pastikan selalu www
  // ----------------------------------------------------------
  function ensureCanonicalWWW() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const href = canonical.getAttribute('href');
      if (href && href.startsWith('https://alqomar.sch.id')) {
        canonical.setAttribute('href', href.replace('https://alqomar.sch.id', BASE_URL));
        console.log('[schema-loader] Canonical fixed to www:', canonical.href);
      }
    }
  }

  // ----------------------------------------------------------
  // 3. LAZY VIDEO EMBED — ganti iframe YouTube dengan thumbnail
  //    sampai user klik (hemat bandwidth, naik PageSpeed)
  // ----------------------------------------------------------
  function lazyVideoEmbed() {
    const iframes = document.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtu.be"]');
    iframes.forEach(function (iframe) {
      const src = iframe.src;
      const match = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&"'>]+)/);
      if (!match) return;

      const videoId = match[1];
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:relative;cursor:pointer;background:#000;';
      wrapper.style.paddingBottom = '56.25%'; // 16:9
      wrapper.innerHTML = `
        <img 
          src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"
          alt="Video Al-Qomar"
          loading="lazy"
          style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;opacity:0.8;"
        >
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          width:64px;height:64px;background:rgba(255,0,0,0.85);border-radius:50%;
          display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      `;
      wrapper.addEventListener('click', function () {
        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
        wrapper.innerHTML = '';
        wrapper.appendChild(iframe);
        iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
      });

      iframe.parentNode.insertBefore(wrapper, iframe);
      wrapper.style.position = 'relative';
      iframe.remove();
    });
  }

  // ----------------------------------------------------------
  // RUN ALL
  // ----------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    injectBreadcrumb();
    ensureCanonicalWWW();
    lazyVideoEmbed();
  });

})();
