# CLAUDE.md

Guidance for Claude Code (and other contributors) working in this repository.

## Project overview

This is a **static HTML/CSS/JS website** for Utila Island Cleanups
(www.utilaislandcleanups.org), deployed via **GitHub Pages** (see `CNAME`).

There is no build step, no bundler, and no npm scripts — pages are plain
`.html` files that reference `style.css` and `script.js` directly. Content
is bilingual (English/Spanish).

Key files:
- `index.html`, `about.html`, `contact.html`, `gallery.html`,
  `get-involved.html`, `impact.html`, `partners.html` — site pages
- `style.css` — global styles
- `script.js` — global behavior
- `Around_the_World/`, `Before_After/`, `Community_Photos/`, `Treasures/`,
  `logos/` — image assets used by the gallery and other pages
- `sitemap.xml`, `robots.txt` — SEO/crawler config
- `CNAME` — GitHub Pages custom domain config (do not remove/rename)

## Testing locally

Because this is a static site with relative links and no bundler, **don't
open HTML files directly via `file://`** — some features (fetch, relative
paths, etc.) behave inconsistently that way. Serve it over HTTP instead:

- **VS Code Live Server**: open the folder in VS Code, right-click
  `index.html` → "Open with Live Server".
- **npx serve**: from the repo root, run `npx serve .` and open the printed
  local URL.

Check pages at common breakpoints (mobile, tablet, desktop) since the site
is responsive.

## Rules for making edits

- No npm build scripts, bundlers, or package.json — keep the site
  dependency-free and deployable as-is via GitHub Pages.
- Write plain HTML/CSS/JS; don't introduce frameworks, transpilers, or a
  build pipeline.
- Keep edits responsive — verify changes at mobile, tablet, and desktop
  widths, since there's no CSS framework enforcing this automatically.
- Preserve bilingual (English/Spanish) content — when editing copy, update
  both language versions.
- Keep styling consistent with `style.css` rather than adding inline styles
  or new stylesheets.
- Don't touch `CNAME` unless intentionally changing the custom domain.
- This branch (`feature/site-redesign`) is for redesign work in isolation
  from `main`, which reflects the live production site — don't merge to
  `main` without review.
