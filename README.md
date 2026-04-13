# celebrate.oze.au

**Beautiful personalised celebration pages for birthdays, anniversaries and life's big moments.**

A [Colin Dixon / OzOnLine](https://oze.au) project.

---

## Live Site

- **Platform:** https://celebrate.oze.au
- **Demo (Shirley's 90th):** https://celebrate.oze.au/shirley90

---

## Project Structure

```
celebrate/
├── index.html              # Platform homepage
├── css/
│   └── celebrate.css       # Shared styles (dark/light mode, all components)
├── js/
│   └── celebrate.js        # Shared JS (countdown, themes, wishes, config loader)
└── shirley90/              # Shirley Dixon's 90th birthday celebration
    ├── index.html          # Main celebration page
    ├── event.json          # *** ALL event-specific data -- edit this file ***
    ├── wishes.json         # Birthday wishes wall entries
    ├── images/             # Local images (if not using Google Photos URLs)
    └── audio/              # Birthday song audio file (if not using Suno URL)
```

---

## Customising an Event

All event-specific data lives in `event.json`. Edit this file to update:

- Person's name, age, birthday
- Event date, time, venue
- Organiser contact details
- Photo URLs (Google Photos)
- RSVP form URL (Google Forms)
- YouTube video ID (birthday tribute video)
- Suno song URL (birthday song)
- Google Photos gallery URL

**No other files need to be edited for a new event.**

---

## Creating a New Celebration

1. Duplicate the `shirley90/` folder
2. Rename to e.g. `johnsmith70/`
3. Edit `event.json` with the new event details
4. Update `index.html` hero images and page title
5. Deploy to `celebrate.oze.au/johnsmith70/`

---

## Deployment (Hostinger)

1. Upload the entire `celebrate/` folder contents to your Hostinger File Manager
2. Point `celebrate.oze.au` subdomain to the folder root
3. Each celebration lives at `celebrate.oze.au/[eventname]/`

**Subdomain setup in Hostinger:**
- Hosting > Manage > Subdomains
- Add `celebrate` pointing to `/public_html/celebrate/`

---

## Features

- Dark / light mode toggle (saved to localStorage)
- Live countdown timer to the event
- Then & now hero photos
- Google Photos gallery integration
- YouTube video tribute embed
- Suno birthday song audio player
- Birthday wishes wall (loaded from `wishes.json`)
- RSVP button linking to Google Form
- All details driven from `event.json` -- no hardcoded content
- Fully mobile responsive
- No framework dependencies -- pure HTML / CSS / JS

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

*celebrate.oze.au -- because every milestone deserves a beautiful moment.*
