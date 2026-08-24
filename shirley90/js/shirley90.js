/*
  File: /shirley90/js/shirley90.js
  Website: celebrate.oze.au
  Description: Shirley 90th post-event page init
  Version: 3.0.1
  Date: 24 Aug 2026 | 5:14 PM AEST
  Author: Colin Dixon + Claude Opus 4.8
*/

function buildYoutubeCard(song, { example = false } = {}) {
  const id = song.youtubeId;
  if (!id) return '';
  const thumb = youtubeThumb(id);
  const badge = example
    ? `<span class="example-badge">${escapeHtml(song.exampleLabel || 'Example')}</span>`
    : '';
  const note = song.note ? `<p>${escapeHtml(song.note)}</p>` : '';
  const musicLink = song.musicSite
    ? `<a class="embed-fallback" href="${escapeHtml(song.musicSite)}" target="_blank" rel="noopener">More personalised music at music.oze.au</a>`
    : `<a class="embed-fallback" href="${escapeHtml(song.youtubeUrl || `https://youtu.be/${id}`)}" target="_blank" rel="noopener">Open on YouTube</a>`;

  return `
    <article class="embed-card${example ? ' is-example' : ''}">
      <div class="embed-meta">
        ${badge}
        <h3>${escapeHtml(song.title)}</h3>
        ${note}
      </div>
      <div class="embed-shell"
           data-embed-type="youtube"
           data-embed-id="${escapeHtml(id)}"
           data-embed-title="${escapeHtml(song.title)}">
        <img class="embed-poster" src="${thumb}" alt="" loading="lazy" width="640" height="360">
        <button type="button" class="embed-load" aria-label="Play ${escapeHtml(song.title)}">▶ Play</button>
      </div>
      ${musicLink}
    </article>`;
}

function renderGallery(photos) {
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  if (!grid) return;

  const items = (photos && photos.gallery) || [];
  if (!items.length) {
    grid.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;
  grid.hidden = false;
  grid.innerHTML = items.map((item) => `
    <figure>
      <img src="${escapeHtml(item.src)}"
           ${item.srcset ? `srcset="${escapeHtml(item.srcset)}"` : ''}
           alt="${escapeHtml(item.alt || 'Celebration photograph')}"
           loading="lazy" decoding="async">
      ${item.caption ? `<figcaption class="visually-hidden">${escapeHtml(item.caption)}</figcaption>` : ''}
    </figure>`).join('');
}

function renderAlbumLinks(photos) {
  const el = document.getElementById('gallery-albums');
  if (!el || !photos) return;
  const links = [];
  if (photos.eventAlbum?.url) {
    links.push(`<a class="btn btn-primary" href="${escapeHtml(photos.eventAlbum.url)}" target="_blank" rel="noopener">${escapeHtml(photos.eventAlbum.label || 'Event photographs')}</a>`);
  }
  if (photos.lifetimeAlbum?.url) {
    links.push(`<a class="btn btn-secondary" href="${escapeHtml(photos.lifetimeAlbum.url)}" target="_blank" rel="noopener">${escapeHtml(photos.lifetimeAlbum.label || 'Lifetime collection')}</a>`);
  }
  el.innerHTML = links.join('');
}

loadEvent('event.json').then((cfg) => {
  const { event, venue, video, songs, kuula, photos } = cfg;

  // Music
  const musicEl = document.getElementById('music-container');
  if (musicEl && Array.isArray(songs)) {
    const primary = songs.find((s) => s.primary) || songs[0];
    const examples = songs.filter((s) => s !== primary);
    musicEl.innerHTML = `
      <div class="music-grid">
        ${primary ? buildYoutubeCard(primary, { example: false }) : ''}
        ${examples.map((s) => buildYoutubeCard(s, { example: true })).join('')}
      </div>`;
    initClickToLoadEmbeds(musicEl);
  }

  // Tribute video
  const videoEl = document.getElementById('video-container');
  if (videoEl && video?.youtubeId) {
    videoEl.innerHTML = buildYoutubeCard({
      youtubeId: video.youtubeId,
      youtubeUrl: `https://youtu.be/${video.youtubeId}`,
      title: video.title || 'Birthday video',
      note: video.description || ''
    });
    initClickToLoadEmbeds(videoEl);
  }

  // Kuula
  const kuulaEl = document.getElementById('kuula-container');
  if (kuulaEl && kuula?.shareUrl) {
    kuulaEl.innerHTML = `
      <article class="embed-card">
        <div class="embed-meta">
          <h3>${escapeHtml(kuula.title || '360° experience')}</h3>
          <p>${escapeHtml(kuula.description || '')}</p>
        </div>
        <div class="embed-shell"
             data-embed-type="kuula"
             data-embed-src="${escapeHtml(kuula.shareUrl)}"
             data-embed-title="${escapeHtml(kuula.title || '360 degree view')}">
          <button type="button" class="embed-load">Open 360° view</button>
        </div>
        <a class="embed-fallback" href="${escapeHtml(kuula.shareUrl)}" target="_blank" rel="noopener">Open full screen on Kuula</a>
      </article>`;
    initClickToLoadEmbeds(kuulaEl);
  }

  renderGallery(photos);
  renderAlbumLinks(photos);

  // Optional dynamic facts if placeholders exist
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };
  setText('fact-date', event?.dateDisplay || formatDateAu(event?.date));
  setText('fact-venue', venue?.name);
  setText('fact-address', venue?.fullAddress || `${venue?.address}, ${venue?.suburb} ${venue?.state} ${venue?.postcode}`);

}).catch((err) => {
  console.warn('Could not load event.json', err);
});

fetch('wishes.json')
  .then((r) => r.json())
  .then((wishes) => renderWishes(wishes, 'wishes-container'))
  .catch(() => renderWishes([], 'wishes-container'));
