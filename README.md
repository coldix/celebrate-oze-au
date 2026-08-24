<!--
    File: /README.md
    Website: celebrate.oze.au
    Description: Project README
    Version: 3.0.1
    Date: 24 Aug 2026 | 5:14 PM AEST
    Author: Colin Dixon + Claude Opus 4.8
-->
# celebrate.oze.au

**Personalised celebration pages for birthdays and life’s milestones — from invitation to lasting memory.**

A [Colin Dixon / OzOnLine](https://oze.au) project. Pure HTML / CSS / JS — no framework, no build step.

---

## Live Site

- **Platform:** https://celebrate.oze.au
- **Case study:** https://celebrate.oze.au/shirley90/ (Shirley Dixon’s 90th — completed 25 July 2026)
- **Invitation archive:** https://celebrate.oze.au/shirley90/invitation.html

---

## Project Structure

```
celebrate/
├── index.html              # Platform homepage
├── README.md               # This file
├── bump-version.sh         # Semver bump + cache-busters
├── deploy.sh               # Local helper: commit + push to main
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions → rsync over SSH → Hostinger
├── css/celebrate.css       # Shared styles
├── js/
│   ├── celebrate.js        # Theme, nav, wishes, click-to-load embeds
│   └── confetti.js         # Optional confetti (respects reduced-motion)
├── legal/                  # Terms, privacy, disclaimer
├── docs/                   # Local-only source material (NOT deployed)
└── shirley90/              # Shirley Dixon’s 90th birthday
    ├── index.html          # Post-event celebration showcase
    ├── invitation.html     # Archived original invitation
    ├── event.json          # Event + media configuration
    ├── wishes.json         # Public birthday messages (permissioned only)
    ├── css/ · js/ · images/
    └── …
```

---

## Shirley’s page (post-event)

`/shirley90/` is a **completed celebration** story:

- The day (who / when / where)
- Gallery (local WebP when present + Google Photos albums)
- Music (Shirley’s song + Frank’s example)
- Video tribute
- 360° lodge experience (Kuula, click-to-load)
- Permissioned birthday messages
- Karbeethong Lodge venue feature (bookings stay with the lodge)
- Link to the original invitation archive

Edit **`shirley90/event.json`** for media URLs, venue facts and embeds.

### Adding event photographs

1. Drop optimised WebP files into `shirley90/images/event/`
2. List them in `event.json` → `photos.gallery` as:
   `{ "src": "images/event/photo.webp", "alt": "…", "caption": "…" }`
3. Bump version and deploy

---

## Privacy

- RSVP exports and private docs live under `docs/` and are **gitignored / not deployed**.
- `wishes.json` contains only messages with explicit public permission.
- Never publish emails, phones, dietary or accessibility data from RSVP sources.

---

## Deployment

Auto-deploys via GitHub Actions on push to `main` (rsync over SSH to Hostinger).

```bash
./deploy.sh        # or: git push origin main
```

Verify live cache-busters after deploy:

```bash
curl -s "https://celebrate.oze.au/shirley90/?z=$RANDOM" | grep -o 'shirley90.js?v=[0-9.]*'
```

---

## Versioning

```bash
./bump-version.sh 3.0.0
```

Updates `?v=` busters, `VERSION` in `js/celebrate.js`, file headers, footer build stamps and `Date:` lines.

---

## License & Usage

Personal and commercial use by Colin Dixon / OzOnLine.
Contact [col@dixon.net.au](mailto:col@dixon.net.au).

---

*celebrate.oze.au — from invitation to lasting memory.*
