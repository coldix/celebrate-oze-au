# celebrate.oze.au -- Git & Hostinger Setup Guide

## Overview

This site uses the same Git-to-Hostinger auto-deploy workflow as music.oze.au.
Push to `main` on GitHub and Hostinger deploys automatically.

---

## Step 1 -- Create the GitHub Repository

1. Go to https://github.com/new
2. Repository name: `celebrate-oze-au`
3. Set to **Private** (or Public if you want it open source)
4. Do NOT initialise with README (we have our own)
5. Click **Create repository**

---

## Step 2 -- Initialise Git Locally

Open Terminal, navigate to your celebrate folder:

```bash
cd ~/web/celebrate-oze-au
git init
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/celebrate-oze-au.git
git add .
git commit -m "Initial commit -- celebrate.oze.au with shirley90"
git push -u origin main
```

Make deploy.sh executable:
```bash
chmod +x deploy.sh
```

---

## Step 3 -- Set Up Hostinger Auto-Deploy

1. Log into **Hostinger hPanel**
2. Go to **Hosting > Manage** (for your oze.au hosting)
3. Find **Git** in the sidebar (under Advanced or DevTools)
4. Click **Add Repository**
5. Enter:
   - Repository URL: `https://github.com/YOUR_USERNAME/celebrate-oze-au.git`
   - Branch: `main`
   - Deploy path: `/public_html/celebrate/` *(or wherever oze.au lives)*
6. Click **Setup Auto-Deploy**
7. Copy the **webhook URL** Hostinger gives you
8. Go to GitHub repo > Settings > Webhooks > Add webhook
9. Paste the Hostinger webhook URL, set Content type to `application/json`, click **Add webhook**

---

## Step 4 -- Set Up the Subdomain

1. In Hostinger hPanel, go to **Domains > Subdomains**
2. Add subdomain: `celebrate`
3. Domain: `oze.au`
4. Document root: `/public_html/celebrate/`
5. Save -- DNS propagates in minutes

Your site will be live at:
- `https://celebrate.oze.au` -- platform homepage
- `https://celebrate.oze.au/shirley90/` -- Shirley's page

---

## Day-to-Day Deployment

Exactly like music.oze.au -- just run:

```bash
./deploy.sh
```

It will:
- Check you are on `main`
- Show what has changed
- Ask for a commit message
- Commit and push
- Hostinger auto-deploys within seconds

---

## Adding a New Celebration (e.g. someone's 70th)

```bash
# Copy shirley90 as a template
cp -r shirley90/ john70/

# Edit the config -- this is the ONLY file you need to change
nano john70/event.json

# Edit the hero images and page title in index.html
nano john70/index.html

# Deploy
./deploy.sh
```

The new page will be live at `celebrate.oze.au/john70/`

---

## Folder Structure on Hostinger

```
/public_html/celebrate/       <- celebrate.oze.au/
    index.html
    css/celebrate.css
    js/celebrate.js
    README.md
    deploy.sh
    shirley90/                <- celebrate.oze.au/shirley90/
        index.html
        event.json
        wishes.json
        images/
        audio/
```

---

## Notes

- The `event.json` file controls ALL dynamic content -- no need to touch HTML for data changes
- Add the Suno song URL to `event.json` when the song is ready
- Add the YouTube video ID to `event.json` when the video is ready
- Add the Google Form URL to `event.json` when the RSVP form is live
- Wishes can be added to `wishes.json` as RSVPs come in -- they appear on the wall automatically
