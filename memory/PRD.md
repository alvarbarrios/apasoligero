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
- Backend: FastAPI + MongoDB — /app/backend/routes/contact.py (POST /api/contact → Emergent managed Resend email to CONTACT_TO_EMAIL, honeypot + 5/h/IP rate limit), /app/backend/routes/guestbook.py (GET/POST /api/guestbook, MongoDB `guestbook` collection, uuid ids, email never published, honeypot + 3/h/IP), /app/backend/services/email.py (playbook guardrail gate). Env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="A Paso Ligero .com", CONTACT_TO_EMAIL=dark_slmnk@hotmail.com (owner's public email from source site — change in .env if needed)
- Tests: /app/backend/tests/test_api.py (pytest, 4 passing), /app/backend/tests/test_features.py (testing agent)
- Design system: /app/design_guidelines.json (obsidian #070907, olive drab, brass #D4A359, Barlow Condensed/DM Sans/JetBrains Mono/Playfair Display)

## Implemented (2026-09-30)
- Kinetic home hero: masked line-by-line reveal, site's own photography with corner-bracket clipped frames, scroll parallax, stats band, slow editorial marquee, bento section grid, ¡Aporten! CTA, NUEVO audio-archive band
- Full preserved structure: Canciones hub; Paso Ligero (38), Himnos (9 branches / 83 anthems), Corneta (34 calls w/ inline audio + meanings), Otras (25), Internacional; Audios archive (36, search + download); Lemas (8 branches, 101 mottos w/ Latin + translation); Libro de Visitas (external guestbook link preserved); Enlaces (8 links + Sello de Calidad EYM); Contacto (author bio verbatim + transmission form → mailto + direct email fallback)
- 145 dossier-style lyric pages: sticky ficha (emblem, date badge, audio player, credits), Playfair verse typography, prev/next navigation
- Global persistent audio player bar (play/pause/seek/time/download/close) + inline play buttons + nav playing indicator
- Search filters on Paso Ligero, Otras, Himnos groups, Audios
- SVG bugle logo mark (also favicon), SEO meta in Spanish, per-page document.title, data-testids throughout, 404 page
- Verified: home/section/detail/corneta/lemas/contacto/audios flows, audio playback triggers player bar, search filters, 375/768/1366 responsive

## Implemented (2026-09-30, session 2)
- Himnos: España card/group/fichas now use Spanish flag SVG (/assets/img/espana.svg) instead of bugle mark (user visual-edit request)
- Real contact delivery: /contacto form POSTs to /api/contact → HTML email (dark tactical template) to owner inbox via Emergent Resend, Reply-To = visitor email; success panel + "Enviar otra transmisión"; mailto fallback preserved
- Native Libro de Visitas: sign form (nombre, lugar, UCO, mensaje, email opcional) + paginated ledger of entries (10/page, numbered, date, Playfair message); legacy smartgb link preserved as "Libro histórico"
- Player upgrade: canvas waveform visualizer (Web Audio AnalyserNode, brass = played portion) with invisible range overlay for seek; track queue (QueueButton "+" on Audios rows, Corneta toques, song fichas; "Reproducir todo" on Audios queues filtered list; queue panel with play/remove/clear; next button; auto-advance on ended; badge count); global sonner Toaster in App.js
- Verified by testing agent (iteration_1.json): 100% backend + frontend, incl. 1 real email send + real guestbook signature, 375px responsive

## Implemented (2026-09-30, session 3)
- Owner auth (single admin seeded from ADMIN_EMAIL/ADMIN_PASSWORD, bcrypt + JWT Bearer 12h, 5-fail/15-min lockout in Mongo login_attempts): /app/backend/routes/auth.py; creds in /app/memory/test_credentials.md
- Moderation panel /admin (footer link "Acceso autor"): login form → list all/visible/hidden signatures with email, hide/show toggle, delete with confirm. Public guestbook excludes hidden. Routes /app/backend/routes/admin.py
- Global search: header button + Ctrl/⌘K → SearchDialog (accent-insensitive, grouped Canciones/Audios/Lemas/Secciones, lyric + motto body search, keyboard nav, audio results play instantly). Index in /app/frontend/src/data/searchIndex.js
- Printable songbook sheet: song dossier "Hoja imprimible" → /imprimir/{paso-ligero|otras}/:slug or /imprimir/himnos/:group/:slug, rendered without site chrome (white A4 sheet, 1/2 columns, font size 80–140%, print CSS, emblem, footer attribution)
- Share signature: permalink /libro-de-visitas/firma/:id (GET /api/guestbook/{id}), compact share buttons on each entry (copy, WhatsApp, X, mail, native share) + share card on permalink page
- Verified by testing agent (iteration_2.json): 100% backend + frontend; pytest /app/backend/tests/test_api.py 8 passing

## Implemented (2026-09-30, session 4)
- Lema del Día on home (below marquee): deterministic daily motto from the 101 lemas (day-of-year), with Latin translation, unit, emblem, link to group, "Otro lema" shuffle with clip-path reveal — /app/frontend/src/components/LemaDelDia.jsx
- Custom brand logo (brass bugle + laurel + star, transparent PNG generated & cleaned): header, footer, favicon (/assets/img/logo-apl.png, /favicon-64.png). CornetaMark still used as neutral emblem in Himnos/SongDetail/PrintSheet
- Official Escudo de España (Wikimedia SVG, /assets/img/escudo-espana.svg) now used for Himnos → España and Lemas → Varios (user visual-edit requests); espana.svg flag removed

## Implemented (2026-10-01)
- Added 2 user-supplied songs to "Otras Canciones y Miscelánea" (Escuela Militar de Paracaidismo): "Si El Viento Sopla" (/canciones/otras/sielvientosopla) and "¿Quiénes Somos?" (/canciones/otras/quienessomos), with lyrics (stanzas from .txt), MP3s copied to /assets/audio/{sielvientosopla,quienessomos}.mp3, also listed in /audios. Counts now dynamic in search index (otras=27, audios=38). Header brand no longer wraps when player pill shows.
- HOW TO ADD SONGS: edit /app/frontend/src/data/archive.json → songs["otras/<slug>"] {title, stanzas[[]], audios[{file,label}], notes, images, date} + otras.items[{slug,title}] (+ audios.items for the audio list); copy mp3 to /app/frontend/public/assets/audio/

## Backlog
- P2: Dark In Tampere blog content (present in the .rar) is a separate project — ask user if it should be included
- P2: Print whole section/group as a multi-page songbook (cancionero completo)
- P2: Admin: moderate contact submissions log / view sent messages
- P3: Restrict CORS to site domain on deployment; remove legacy /api/status template routes; Pydantic response model for admin list
