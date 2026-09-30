# PRD — A Paso Ligero .com (Rediseño moderno)

## Problem statement (original)
Redesign the user's existing Dreamweaver website as a complete modern website while preserving all existing content and functionality from the supplied source site. Aggressive, striking modern military visual identity with minimalist execution: strong editorial typography, disciplined grid layouts, high contrast, subtle tactical textures, bold visual hierarchy, restrained military-inspired detailing, polished responsive interactions. Reorganize content into clearer modern navigation/page structure without removing information. Responsive across desktop/tablet/mobile, SEO-friendly. The supplied website is the source of truth for content, links, images, functionality.

## Source site
"A Paso Ligero .com" (apasoligero.com) — Spanish military music heritage archive by Álvar Barrios Martínez (online since ~2003, Dreamweaver, ISO-8859-1). Supplied as `Página Web.rar` (210MB), extracted to /tmp/source_site. Main site in `APasoLigero/` (BackUps/ and Dark In Tampere/ folders are unrelated duplicates/other projects — excluded).

## User choices
- Visual direction: Dark tactical (dark olive/black base, high-contrast accents, editorial type)
- Static site: content pages, contact form displayed but no server processing (form composes a mailto:)
- Preserve everything from the source site exactly (all copy verbatim in Spanish)

## Architecture
- Frontend-only React SPA (react-router-dom v7, framer-motion, lenis smooth scroll, Tailwind)
- Content pipeline: /tmp/extract_content.py parses all 176 legacy .htm files (BeautifulSoup, cp1252) into /app/frontend/src/data/archive.json (145 song records, 9 himnos groups, 8 lemas groups, 34 bugle calls, 36 audio archive entries, static pages)
- Media: /app/frontend/public/assets/audio (69 mp3; 5 WMA + 1 WAV converted via ffmpeg), /assets/img (16 original images/emblems)
- Backend: untouched template (static site per user choice)
- Design system: /app/design_guidelines.json (obsidian #070907, olive drab, brass #D4A359, Barlow Condensed/DM Sans/JetBrains Mono/Playfair Display)

## Implemented (2026-09-30)
- Kinetic home hero: masked line-by-line reveal, site's own photography with corner-bracket clipped frames, scroll parallax, stats band, slow editorial marquee, bento section grid, ¡Aporten! CTA, NUEVO audio-archive band
- Full preserved structure: Canciones hub; Paso Ligero (38), Himnos (9 branches / 83 anthems), Corneta (34 calls w/ inline audio + meanings), Otras (25), Internacional; Audios archive (36, search + download); Lemas (8 branches, 101 mottos w/ Latin + translation); Libro de Visitas (external guestbook link preserved); Enlaces (8 links + Sello de Calidad EYM); Contacto (author bio verbatim + transmission form → mailto + direct email fallback)
- 145 dossier-style lyric pages: sticky ficha (emblem, date badge, audio player, credits), Playfair verse typography, prev/next navigation
- Global persistent audio player bar (play/pause/seek/time/download/close) + inline play buttons + nav playing indicator
- Search filters on Paso Ligero, Otras, Himnos groups, Audios
- SVG bugle logo mark (also favicon), SEO meta in Spanish, per-page document.title, data-testids throughout, 404 page
- Verified: home/section/detail/corneta/lemas/contacto/audios flows, audio playback triggers player bar, search filters, 375/768/1366 responsive

## Backlog
- P1: Replace mailto contact form with real delivery (Resend) if user wants
- P1: Guestbook could be re-implemented natively (currently links to legacy external smartgb)
- P2: Audio waveform visualizer in player bar; global audio search across all 69 files
- P2: Dark In Tampere blog content (present in the .rar) is a separate project — ask user if it should be included
- P2: Lyrics print view / PDF songbook export
