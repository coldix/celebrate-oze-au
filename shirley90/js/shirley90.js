/*
  File: /shirley90/js/shirley90.js
  Website: celebrate.oze.au
  Description: shirley90 page init — config, gallery, wishes
  Version: 2.1.1
  Date: 23 Jun 2026 | 1:38 AM AEST
  Author: Colin Dixon + Claude Opus 4.8
*/

// Load config and initialise all dynamic sections
loadEvent('event.json').then(cfg => {
  const { event, venue, organiser, rsvpFormUrl, video, song, photos } = cfg;

  // RSVP button
  if (rsvpFormUrl) {
    document.getElementById('rsvp-btn').href = rsvpFormUrl;
  } else {
    document.getElementById('rsvp-btn').href = '#';
    document.getElementById('rsvp-btn').textContent = 'RSVP coming soon';
  }

  // Video
  if (video.youtubeId) {
    document.getElementById('video-container').innerHTML = `
      <div class="video-wrapper">
        <iframe src="https://www.youtube.com/embed/${video.youtubeId}"
          title="${video.title}" allowfullscreen></iframe>
      </div>`;
  }

  // Song — audio player if Suno URL exists, otherwise link buttons
  const songEl = document.getElementById('song-container');
  let songHTML = `
    <p style="font-family:var(--font-display);font-size:18px;margin-bottom:4px;">${song.title}</p>
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:1rem;">${song.note || ''}</p>`;

  if (song.sunoUrl) {
    songHTML += `<audio controls style="width:100%;margin-bottom:1rem;">
      <source src="${song.sunoUrl}" type="audio/mpeg">
    </audio>`;
  }

  const btnRow = [];

  if (song.youtubeUrl || song.youtubeId) {
    const ytUrl = song.youtubeUrl || `https://www.youtube.com/watch?v=${song.youtubeId}`;
    btnRow.push(`
      <a href="${ytUrl}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:8px;
               background:#FF0000;color:white;padding:9px 20px;border-radius:20px;
               text-decoration:none;font-size:13px;font-weight:700;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        Watch on YouTube
      </a>`);
  }

  if (song.spotifyUrl) {
    btnRow.push(`
      <a href="${song.spotifyUrl}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:8px;
               background:#1DB954;color:white;padding:9px 20px;border-radius:20px;
               text-decoration:none;font-size:13px;font-weight:700;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        Listen on Spotify
      </a>`);
  }

  if (song.appleMusicUrl) {
    btnRow.push(`
      <a href="${song.appleMusicUrl}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:8px;
               background:#FC3C44;color:white;padding:9px 20px;border-radius:20px;
               text-decoration:none;font-size:13px;font-weight:700;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a6.303 6.303 0 0 0-1.933-.737 9.15 9.15 0 0 0-1.369-.164c-.05-.003-.09-.01-.12-.014H5.847a4.43 4.43 0 0 0-.497.04 8.05 8.05 0 0 0-1.518.242C2.554 0.669 1.62 1.42.978 2.427A6.026 6.026 0 0 0 .24 4.29 9.658 9.658 0 0 0 .005 5.85C0 5.988 0 6.124 0 6.261v11.48c0 .136 0 .271.006.407.03.9.19 1.784.554 2.607.49 1.12 1.3 1.93 2.424 2.43a7.16 7.16 0 0 0 2.09.48c.443.05.886.073 1.33.073H17.59c.444 0 .888-.023 1.33-.073a7.16 7.16 0 0 0 2.09-.48c1.124-.5 1.934-1.31 2.424-2.43.364-.823.524-1.706.554-2.607.006-.136.006-.271.006-.407V6.261c0-.137 0-.273-.006-.41l.006.273zm-6.8 3.957v5.034c0 .64-.144 1.247-.5 1.79-.43.65-1.04 1.05-1.79 1.23a3.98 3.98 0 0 1-.92.1c-1.19 0-2.22-.86-2.44-2.04a2.462 2.462 0 0 1 1.61-2.72c.44-.15.9-.22 1.36-.3.31-.05.62-.11.92-.19.42-.11.61-.34.63-.78V8.2c0-.48-.17-.64-.64-.54l-4.27.86c-.47.1-.61.26-.61.75v6.54c0 .65-.15 1.26-.52 1.81-.43.64-1.04 1.03-1.79 1.2a4.21 4.21 0 0 1-.93.1c-1.19 0-2.23-.87-2.44-2.05a2.46 2.46 0 0 1 1.96-2.8c.44-.09.88-.17 1.32-.25.32-.06.64-.12.96-.2.38-.1.56-.33.57-.73V6.7c0-.47.17-.82.62-.96l5.6-1.12c.76-.15 1.3.3 1.3 1.07v4.36l-.01-.003z"/>
        </svg>
        Apple Music
      </a>`);
  }

  if (btnRow.length) {
    songHTML += `<div style="display:flex;flex-wrap:wrap;gap:10px;">${btnRow.join('')}</div>`;
  }
  songEl.innerHTML = songHTML;

  // Countdown
  startCountdown(event.date, event.timezone);

  // Gallery
  let galleryHTML = `<p style="font-family:var(--font-display);font-size:16px;margin-bottom:8px;">Nine decades of Shirley</p>`;

  if (photos && photos.mainAlbum) {
    galleryHTML += `
      <a href="${photos.mainAlbum.url}" target="_blank" rel="noopener" class="main-album-btn">
        <span style="font-size:22px;">📸</span>
        <span>
          <strong style="display:block;font-size:16px;margin-bottom:2px;">${photos.mainAlbum.label}</strong>
          <span style="font-size:12px;opacity:0.85;">View full collection on Google Photos — updated as new scans are added</span>
        </span>
        <span style="font-size:20px;margin-left:auto;">&#9658;</span>
      </a>`;
  }

  galleryHTML += `<p style="font-size:13px;color:var(--text-muted);margin-top:14px;margin-bottom:6px;">Browse by year:</p>`;
  document.getElementById('gallery-container').innerHTML = galleryHTML;

  if (photos && photos.albums) {
    document.getElementById('gallery-albums').innerHTML = photos.albums.map(album => `
      <a href="${album.url}" target="_blank" rel="noopener"
        style="display:inline-block;background:var(--brand);color:white;padding:9px 20px;border-radius:8px;
               text-decoration:none;font-size:13px;font-weight:700;">
        &#9658; ${album.label}
      </a>`).join('');
  }

}).catch(err => {
  console.warn('Could not load event.json, using static content', err);
  startCountdown('2026-07-25', 'Australia/Melbourne');
});

// Wishes — load from wishes.json first
fetch('wishes.json')
  .then(r => r.json())
  .then(wishes => renderWishes(wishes, 'wishes-container'))
  .catch(() => renderWishes([], 'wishes-container'));

// Blogger comments feed — live wishes wall
const BLOGGER_FEED = 'https://shirley90th.blogspot.com/feeds/comments/default?alt=json&max-results=50';
fetch(BLOGGER_FEED)
  .then(r => r.json())
  .then(data => {
    const entries = data.feed.entry || [];
    const feedEl = document.getElementById('wishes-feed');
    if (!entries.length) return;
    feedEl.innerHTML = `<div class="wishes-grid">` + entries.map(e => {
      const name = e.author?.[0]?.name?.['$t'] || 'A friend';
      const msg  = e.content?.['$t'] || e.summary?.['$t'] || '';
      const date = e.published?.['$t']
        ? new Date(e.published['$t']).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
        : '';
      return `<div class="wish-card">
        <p class="wish-text">${msg}</p>
        <p class="wish-name">— ${name}${date ? ' &nbsp;·&nbsp; ' + date : ''}</p>
      </div>`;
    }).join('') + `</div>`;
  })
  .catch(() => {});
