# CLAUDE.md

## Project Overview

**Al-Qomar Muthmainnah School Website** — a static single-page website for an Islamic educational institution (Yayasan Pendidikan Islam Purnama Cendekia / YPIPC) located in Jakarta Barat, Indonesia. The school operates across four education levels: KB (preschool), TKIT (kindergarten), SDIT (elementary), and SMPIT (junior high).

- **Domain**: alqomar.sch.id (configured via `CNAME`)
- **Hosting**: Netlify / GitHub Pages
- **Language**: Indonesian (Bahasa Indonesia)

## Repository Structure

```
alqomar-muthmainnah/
├── index.html    # Complete single-page website (HTML + CSS + JS, ~2100 lines)
└── CNAME         # Custom domain mapping (alqomar.sch.id)
```

This is a **single-file static site** with no build system, package manager, or framework. All CSS and JavaScript are embedded inline within `index.html`.

## Technology Stack

- **HTML5** — semantic markup with responsive design
- **CSS3** — embedded styles using CSS custom properties, flexbox, and grid
- **Vanilla JavaScript** — no frameworks or libraries
- **Google Fonts** — Plus Jakarta Sans, Amiri, Playfair Display
- **External embeds** — Google Maps, YouTube videos

## Key CSS Variables (Design System)

| Variable | Value | Usage |
|----------|-------|-------|
| `--h`, `--h2`, `--h3` | `#1a5c38`, `#1e6e42`, `#2a8a54` | Primary green tones |
| `--e`, `--e2` | `#c8922a`, `#e0a832` | Accent gold tones |
| `--kr` | `#faf7f2` | Cream background |

## Page Sections (in order)

1. **Top bar** — ticker announcements + social links
2. **Navigation** — sticky navbar with dropdown menus + mobile hamburger
3. **Hero slider** — 4-slide carousel with auto-rotation (5.5s)
4. **Widget row** — statistics/info cards
5. **Kenapa** — "Why choose us" (3-column grid)
6. **Jenjang** — education levels showcase (4 columns)
7. **Fasilitas** — facilities (4-column grid)
8. **Visi & Misi** — vision and mission cards
9. **Prestasi** — achievements/statistics (4 columns)
10. **Berita** — news/articles (3-column grid)
11. **Video** — main player + sidebar
12. **Galeri** — photo gallery
13. **PPDB** — student admission registration banner
14. **Kontak** — contact info + embedded Google Maps
15. **Legalitas** — accreditation display
16. **Footer** — navigation, contact, social links
17. **Floating WhatsApp button**

## JavaScript Features

- Hero slider auto-rotation and manual navigation dots
- FAQ accordion toggle
- Scroll-reveal animations on section entry
- Navigation active state tracking on scroll
- Mobile hamburger menu toggle
- Real-time date display

## Development Workflow

### Making Changes

1. Edit `index.html` directly — all markup, styles, and scripts are in this single file
2. Open `index.html` in a browser to preview changes locally
3. Commit and push to deploy

### No Build Steps Required

There is no build process, transpilation, or bundling. Changes to `index.html` are deployed as-is.

### No Tests

No test framework or test files exist. Verify changes by visual inspection in a browser.

## Deployment

The site deploys automatically via Netlify on push to the `main` branch. The `CNAME` file maps the custom domain `alqomar.sch.id`.

## Conventions

- **Single-file architecture** — keep all code in `index.html` unless there is a strong reason to split
- **CSS custom properties** — use the existing design variables for color consistency
- **Indonesian language** — all user-facing content is in Bahasa Indonesia
- **Responsive design** — all sections must work on mobile, tablet, and desktop
- **No external JS dependencies** — use vanilla JavaScript only
- **Inline styles and scripts** — CSS in `<style>` tags, JS in `<script>` tags at end of body

## External Services

- **WhatsApp**: Direct chat links for admissions
- **Google Maps**: Embedded map for school location
- **YouTube**: Embedded video content
- **Social media**: Instagram, YouTube, Facebook links
