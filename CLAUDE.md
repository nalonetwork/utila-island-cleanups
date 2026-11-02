# CLAUDE.md

Guidance for Claude Code (and other contributors) working in this repository.

## Project overview

This is a **multi-page HTML/CSS/JS website** for Utila Island Cleanups
(www.utilaislandcleanups.org), built with **Vite** and deployed via
**GitHub Pages** (see `public/CNAME`).

Pages are plain `.html` files that reference `style.css` and `script.js`
directly; Vite handles bundling, asset hashing, and dev serving. Content
is bilingual (English/Spanish).

Key files:
- `index.html`, `about.html`, `contact.html`, `gallery.html`,
  `get-involved.html`, `impact.html`, `partners.html` — site pages
  (registered as build entry points in `vite.config.js`)
- `style.css` — global styles
- `script.js` — global behavior
- `Around_the_World/`, `Before_After/`, `Community_Photos/`, `Treasures/`,
  `logos/` — image assets used by the gallery and other pages (referenced
  via relative paths; Vite picks these up automatically as build assets)
- `public/` — static files copied as-is to `dist/`: `sitemap.xml`,
  `robots.txt`, `CNAME`
- `vite.config.js` — multi-page build config
- `.github/workflows/deploy.yml` — builds and deploys `dist/` to GitHub
  Pages on push to `main`

## Development commands

- `npm run dev` — start the Vite dev server (standard way to work on this
  site locally; do **not** open HTML files directly via `file://`)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

Check pages at common breakpoints (mobile, tablet, desktop) since the site
is responsive.

## Rules for making edits

- Write plain HTML/CSS/JS; don't introduce frameworks or transpilers
  beyond the existing Vite build.
- Keep edits responsive — verify changes at mobile, tablet, and desktop
  widths, since there's no CSS framework enforcing this automatically.
- Preserve bilingual (English/Spanish) content — when editing copy, update
  both language versions.
- Keep styling consistent with `style.css` rather than adding inline styles
  or new stylesheets.
- Don't touch `public/CNAME` unless intentionally changing the custom
  domain.
- New top-level pages must be added to `rollupOptions.input` in
  `vite.config.js`, or they won't be built.
- This branch (`feature/site-redesign`) is for redesign work in isolation
  from `main`, which reflects the live production site — don't merge to
  `main` without review.
