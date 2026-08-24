/*
  File: /shirley90/js/invitation.js
  Website: celebrate.oze.au
  Description: Archived invitation page init (historical pre-event UI)
  Version: 3.0.1
  Date: 24 Aug 2026 | 5:14 PM AEST
  Author: Colin Dixon + Claude Opus 4.8
*/

loadEvent('event.json').then((cfg) => {
  const { event, video, songs, photos } = cfg;
  const song = (songs && songs.find((s) => s.primary)) || (songs && songs[0]) || cfg.song || {};

  const rsvpBtn = document.getElementById('rsvp-btn');
  if (rsvpBtn) {
    rsvpBtn.textContent = 'RSVP closed — see the celebration';
    rsvpBtn.href = './';
    rsvpBtn.removeAttribute('target');
  }

  const videoEl = document.getElementById('video-container');
  if (videoEl && video?.youtubeId) {
    videoEl.innerHTML = `
      <div class="video-wrapper">
        <iframe src="https://www.youtube-nocookie.com/embed/${video.youtubeId}"
          title="${escapeHtml(video.title || 'Birthday video')}" allowfullscreen loading="lazy"></iframe>
      </div>`;
  }

  const songEl = document.getElementById('song-container');
  if (songEl && song.youtubeId) {
    songEl.innerHTML = `
      <p style="font-family:var(--font-display);font-size:18px;margin-bottom:8px;">${escapeHtml(song.title || "Shirley's Song")}</p>
      <p style="color:var(--text-muted);font-size:14px;margin-bottom:1rem;">${escapeHtml(song.note || '')}</p>
      <a href="${escapeHtml(song.youtubeUrl || `https://youtu.be/${song.youtubeId}`)}" target="_blank" rel="noopener"
         style="display:inline-block;background:var(--brand);color:#fff;padding:10px 20px;border-radius:20px;text-decoration:none;font-weight:700;">
        ▶ Listen on YouTube
      </a>`;
  }

  if (event?.date) startCountdown(event.date);

  const gallery = document.getElementById('gallery-container');
  if (gallery && photos?.eventAlbum) {
    gallery.innerHTML = `
      <a href="${escapeHtml(photos.eventAlbum.url)}" target="_blank" rel="noopener" class="main-album-btn">
        <span style="font-size:22px;">📸</span>
        <span>
          <strong style="display:block;font-size:16px;margin-bottom:2px;">${escapeHtml(photos.eventAlbum.label)}</strong>
          <span style="font-size:12px;opacity:0.85;">View photographs on Google Photos</span>
        </span>
      </a>`;
  }
}).catch(() => {
  startCountdown('2026-07-25');
});

fetch('wishes.json')
  .then((r) => r.json())
  .then((wishes) => renderWishes(wishes, 'wishes-container'))
  .catch(() => renderWishes([], 'wishes-container'));
