# CLAUDE.md

Guidance for Claude Code (and other contributors) working in this repository.

## Project overview

This is an **Astro static site** for Utila Island Cleanups
(www.utilaislandcleanups.org), deployed via **GitHub Pages** (see
`public/CNAME`).

Routes are `.astro` files under `src/pages/` built on a shared
`Layout.astro` + `Navbar.astro`/`Footer.astro` component set, producing
clean URLs (e.g. `/about`, `/impact`) rather than `.html` files. Content
is trilingual (English/Spanish/French) via a client-side language toggle.

Key files:
- `src/pages/*.astro` — site routes: `index` (`/`), `about`, `contact`,
  `gallery`, `get-involved`, `impact`, `partners`, `admin` (noindex)
- `src/layouts/Layout.astro` — shared `<head>` (title/meta/OG tags,
  ionicons, global stylesheet) and `<body>` wrapper; takes props for
  per-page SEO tags and toggles (`robots`, `siteScript`, `ionicons`)
- `src/components/Navbar.astro`, `src/components/Footer.astro` — shared
  nav (with the EN/ES/FR language switcher) and footer, identical across
  pages
- `src/scripts/` — client JS modules (`supabase.js`, `live-counters.js`,
  `volunteer-form.js`, `admin.js`); wired into pages via an inline
  `<script>import '../scripts/x.js'</script>` tag so Astro/Vite bundles
  them (a plain `<script src="../scripts/x.js">` is **not** bundled —
  Astro only rewrites script `src` for certain cases, so always use the
  `import` form for local modules)
- `public/` — static files copied as-is to `dist/`: `style.css`,
  `script.js` (global nav/lang-toggle/slider behavior, non-module),
  images (`UICsquare.png`, `banner.jpg`, `Around_the_World/`,
  `Before_After/`, `Community_Photos/`, `Treasures/`, `logos/`),
  `sitemap.xml`, `robots.txt`, `CNAME`. Anything referenced from an
  `.astro` page must live here and be linked with a **leading-slash
  absolute path** (e.g. `/UICsquare.png`) — a relative path breaks once
  the route is nested under a clean-URL directory (`/about/index.html`).
- `astro.config.mjs` — static output config; `vite.envPrefix` is set to
  `['VITE_', 'PUBLIC_']` so the existing `VITE_SUPABASE_*` env vars in
  `.env.local` keep working without renaming to `PUBLIC_*`
- `.github/workflows/deploy.yml` — builds and deploys `dist/` to GitHub
  Pages on push to `main` (unchanged by the Astro migration — `npm run
  build` still outputs to `dist/`)

## Development commands

- `npm run dev` (or `npm start`) — start the Astro dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally

Check pages at common breakpoints (mobile, tablet, desktop) since the site
is responsive.

## Rules for making edits

- Write plain `.astro`/CSS/JS; don't introduce a UI framework (React,
  Vue, etc.) or MDX beyond what Astro already provides.
- Keep edits responsive — verify changes at mobile, tablet, and desktop
  widths, since there's no CSS framework enforcing this automatically.
- Preserve trilingual (English/Spanish/French) content — when editing
  copy, update all three `data-en`/`data-es`/`data-fr` attributes.
- Keep styling consistent with `public/style.css` rather than adding
  inline styles or new stylesheets.
- Don't touch `public/CNAME` unless intentionally changing the custom
  domain.
- New top-level pages are just new `src/pages/*.astro` files — Astro
  derives routes from the file system, so there's no build-input list to
  update (unlike the old `vite.config.js`).
- Internal links must use clean, extensionless paths (`/about`, not
  `about.html`); asset `src`/`href` values must be root-absolute (see
  `public/` note above).
- `main` is the single active branch and reflects the live production
  site, deployed on every push — commit and push directly to `main`.
