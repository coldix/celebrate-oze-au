<!--
    File: /README.md
    Website: celebrate.oze.au
    Description: Project README
    Version: 2.1.1
    Date: 23 Jun 2026 | 1:38 AM AEST
    Author: Colin Dixon + Claude Opus 4.8
-->
# celebrate.oze.au

**Beautiful personalised celebration pages for birthdays, anniversaries and life's big moments.**

A [Colin Dixon / OzOnLine](https://oze.au) project. Pure HTML / CSS / JS — no
framework, no build step.

---

## Live Site

- **Platform:** https://celebrate.oze.au
- **Demo (Shirley's 90th):** https://celebrate.oze.au/shirley90

---

## Project Structure

```
celebrate/
├── index.html              # Platform homepage
├── README.md               # This file (the only doc — versioned via bump-version.sh)
├── bump-version.sh         # One-shot version bump across all files (see Versioning)
├── deploy.sh               # Local helper: commit + push to main
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions → rsync over SSH → Hostinger
├── css/
│   └── celebrate.css       # Shared styles (dark/light mode, all components)
├── js/
│   ├── celebrate.js        # Shared JS (countdown, themes, wishes, config loader)
│   └── confetti.js         # Drifting confetti canvas animation (site-wide)
├── legal/                  # Terms, privacy, disclaimer
└── shirley90/              # Shirley Dixon's 90th birthday celebration
    ├── index.html          # Main celebration page
    ├── css/shirley90.css   # Page-specific styles (hero bg, pills, organiser card)
    ├── js/shirley90.js     # Page-specific init (event config, gallery, wishes)
    ├── event.json          # *** ALL event-specific data — edit this file ***
    ├── wishes.json         # Birthday wishes wall entries
    ├── generate_flyer.py   # Flyer/PDF generator
    ├── images/             # Local images (if not using Google Photos URLs)
    └── audio/              # Birthday song audio file (if not using Suno URL)
```

---

## Customising an Event

All event-specific data lives in `event.json`. Edit it to update:

- Person's name, age, birthday
- Event date, time, venue
- Organiser contact details
- Photo URLs (Google Photos)
- RSVP form URL (Google Forms)
- YouTube video ID (birthday tribute video)
- Suno song URL (birthday song)
- Google Photos gallery URL

**No other files need editing for a data change to an existing event.**

---

## Creating a New Celebration

```bash
# 1. Copy shirley90 as a template
cp -r shirley90/ johnsmith70/

# 2. Edit the config — usually the ONLY file you need to change
nano johnsmith70/event.json
```

Then, if the look needs to differ:
- Rename / adjust `css/shirley90.css` (hero background, page colours)
- Rename / tweak `js/shirley90.js` (gallery / wishes logic)
- Update the hero image + page title in the new `index.html`

The new page goes live at `celebrate.oze.au/johnsmith70/`.

---

## Deployment

**Auto-deploys via GitHub Actions on push to `main`** — `.github/workflows/deploy.yml`
rsyncs the repo over SSH to the Hostinger subfolder. No webhook, no manual upload.

```bash
./deploy.sh        # local helper: checks branch, shows diff, commits, pushes main
# …or just: git push origin main
```

**Always verify live** — a green CI tick can rsync stale bytes. Curl the live
asset's `?v=` and confirm the version actually changed:

```bash
curl -s "https://celebrate.oze.au/index.html?z=$RANDOM" | grep -o 'confetti.js?v=[0-9.]*'
curl -s "https://celebrate.oze.au/js/confetti.js?z=$RANDOM" | grep -o 'Version: [0-9.]*'
```

If a deploy times out (Hostinger fail2ban, exit 255), just re-run it:

```bash
gh run rerun --repo coldix/celebrate-oze-au \
  $(gh run list --repo coldix/celebrate-oze-au -L1 --json databaseId --jq '.[0].databaseId')
```

**One-time subdomain setup (Hostinger hPanel):** Domains → Subdomains → add
`celebrate` on `oze.au`, document root `/public_html/celebrate/`.

---

## Versioning & Cache-Busting

One version number drives everything. Assets are linked with a `?v=` cache-buster
so browsers fetch fresh files after a deploy. **Never bump by hand** — run:

```bash
./bump-version.sh 2.1.2    # semver vX.Y.Z; then commit + push
```

It updates `?v=` busters, the `VERSION` constant in `js/celebrate.js`, every
`Version:` header, the footer build stamps, and the `Date:` headers (today,
date + time AEST) across the repo. Version is pure semver; the date is a
separate auto-maintained build date. House standard: https://oze.au/docs/PLAYBOOK.md

---

## Animations

`js/confetti.js` — a self-contained drifting-confetti canvas (brand palette amber
`#ffc107` / blue `#3498db` / white, semi-transparent), injected behind content at
`z-index:2`. Skips on `prefers-reduced-motion`, fewer pieces on mobile, pauses on
hidden tab. **On globally**; opt a page out with `<body data-confetti="off">`.

---

## Features

- Dark / light mode toggle (saved to localStorage)
- Site-wide confetti celebration animation
- Live countdown timer to the event
- Then & now hero photos
- Google Photos gallery integration
- YouTube video tribute embed
- Suno birthday song audio player
- Birthday wishes wall (loaded from `wishes.json`)
- RSVP button linking to Google Form
- All details driven from `event.json` — no hardcoded content
- Fully mobile responsive, no framework dependencies

---

## Roadmap

- [ ] Self-serve builder (fill in a form, get a page)
- [ ] Wishes submission form (guests add wishes directly)
- [ ] QR code generator for flyers
- [ ] Google Sheets RSVP integration
- [ ] Admin dashboard to manage events
- [ ] White-label for event planners

---

## License & Usage

Personal and commercial use by Colin Dixon / OzOnLine.
Contact [col@dixon.net.au](mailto:col@dixon.net.au) for enquiries.

---

*celebrate.oze.au — because every milestone deserves a beautiful moment.*
