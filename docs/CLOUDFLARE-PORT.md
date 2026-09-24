<!--
    File: /docs/CLOUDFLARE-PORT.md
    Website: celebrate.oze.au
    Description: Astro + Cloudflare port notes for the oze.au zone cutover
    Author: Colin Dixon + Claude Opus 5
-->
# celebrate.oze.au — Astro port for the Cloudflare cutover

Prepared 23 September 2026. **No DNS or production routing changed.**

## Three-line handover

1. The site builds as an Astro static site into `dist/`, deployed as the Worker
   **`celebrate-oze-au-preview`** (account `1b494ec3…`, Colin@oze.com.au):
   <https://celebrate-oze-au-preview.bridge-oze-au.workers.dev> — noindex, no custom domain.
2. The repo-root `index.html`, `legal/*.html` and `shirley90/*.html` are
   untouched and still the Hostinger production site. That is the rollback path.
3. At cutover, attach `celebrate.oze.au` as a custom domain on the Worker
   (`routes` is empty today) and disable the Hostinger workflow.

## The /shirley90/ URL, checked before anything was written

The case-study address is in print and must not move. Two settings decide it,
and both were measured against `wrangler dev` on a fixture with this site's
exact shape — not assumed. Note that wrangler does **not** hot-reload
`html_handling`, so each mode needs a fresh server or the results lie.

**`build.format` in `astro.config.mjs`:**

| format | `src/pages/shirley90/index.astro` becomes |
| --- | --- |
| `file` | `/shirley90.html` — **loses the URL** |
| `directory` | every flat page becomes a folder too |
| **`preserve`** | `/shirley90/index.html` — mirrors the live tree |

**`html_handling` in `wrangler.jsonc`:**

| path | `auto` | `force` | `drop` | `none` |
| --- | --- | --- | --- | --- |
| `/` | 200 | 200 | 200 | **not mapped → 404 page** |
| `/shirley90/` | **200** | 200 | 307 → `/shirley90` | 404 |
| `/shirley90` | 307 → `/shirley90/` | 307 → `/shirley90/` | 200 | 404 |
| `/shirley90/invitation.html` | 307 → `/shirley90/invitation` | 307 → `…/invitation/` | 307 → `…/invitation` | 200 |
| `/legal/terms.html` | 307 → `/legal/terms` | 307 → `/legal/terms/` | 307 → `/legal/terms` | 200 |

Live Apache serves `/shirley90/` as 200 and 301s `/shirley90` to it. So
`preserve` + `auto-trailing-slash` reproduces the case-study URLs exactly,
while the flat pages lose `.html` like the other ported sites.

The `none` column is about a bare `none` config: it does no path mapping, so
every address that is not a literal file falls through to `not_found_handling`.
Cloudflare's own table for `none` says only "depends on `not_found_handling`".
A site can still use `none` and route its own root — `art.oze.net.au` does,
with an explicit `/ /index.html 200` rewrite in its `dist/_redirects` — but that
is work these sites have no reason to take on.

## What changed

| Piece | Standard |
| --- | --- |
| Framework | Astro 5, `output: 'static'`, `build.format: 'preserve'` |
| Adapter | None |
| Worker | `wrangler.jsonc`, `assets.directory: "./dist"`, `not_found_handling: "404-page"` |
| Account | `1b494ec3de3d84b846e3100f5bbf561d` |
| Preview | `--env preview` gives `celebrate-oze-au-preview`, `routes: []`, noindex |
| Browser JS | Unchanged. `js/celebrate.js`, `js/confetti.js` and the shirley90 scripts ship as-is |

Unlike the other ports, **`BaseLayout` here owns only the document shell**:
html/head/body, the stylesheet and script tags. This site has four different
footers and only the case study has a header, so there was nothing honest to
hoist. Each page keeps its own header and footer, and its own `lang`
(`en-AU` and `en` are both in use and were carried over rather than normalised).

Relative asset paths (`../css/celebrate.css`, `css/shirley90.css`) are kept
exactly as written. They resolve identically from `/legal/terms`, `/shirley90/`
and `/shirley90/invitation`, which was verified in the browser, not reasoned
about: the case study fetches `event.json` and `wishes.json` relatively at
runtime, and both load from both of its pages.

`scripts/copy-public-assets.mjs` mirrors `css/`, `js/`, `images/`, `shirley90/`
and `legal/` into `public/`, skipping `.html` (Astro generates those), `.py`
(local-only tooling the Hostinger workflow already refuses to publish) and
dotfiles.

## Known, not a regression

**House ads are blank on the preview.** `adnet` echoes CORS only for domains in
its snapshot, and the workers.dev host is not one. Only the home page carries
the ad tag, as on the live site.

## Fixed

**The two Google Photos images are now self-hosted.** Hotlinking from
`lh3.googleusercontent.com` was refused in the browser even though the URLs
returned 200 to curl, so both photos are rehosted as
`shirley90/images/shirley-20.webp` and `shirley-89.webp`. Google only ever
served a 400x400 original for these (`=s0` and `=d` both cap there), so the
`=w800` and `=w1200` in the old markup were never getting those widths; the
webp copies are the full 400x400 the source has. The case study, the
invitation, their Astro twins and `event.json` all point at the local files,
and `og:image` now uses an absolute `celebrate.oze.au` URL like the home page.

## Commands

```sh
npm ci
npm run cf:dev        # build plus wrangler dev on 127.0.0.1:8794
npm test              # builds, then checks parity against the live HTML
npm run cf:check      # dry-run packaging
npm run cf:preview    # build with noindex, deploy the preview Worker
./bump-version.sh 3.0.2   # stamps root HTML/JS/CSS, src/, package.json
```

Run `npx wrangler whoami` first: four Cloudflare accounts are reachable here.

## Verified 23 September 2026

`npm test` compares the visible text of all six built pages against the live
pages character for character, and they match. Against the local Worker and the
deployed preview: `/shirley90/` serves 200 and `/shirley90` redirects to it,
matching live; `/shirley90/invitation` and `/legal/terms` serve with their
`.html` addresses redirecting; `event.json` and `wishes.json` load from both
case-study pages; six wishes render; confetti and both stylesheets work; the
flyer PDF ships and the Python helpers do not.

Related: `oze-sites/oze.au/docs/WEEKEND-CUTOVER.md`.
