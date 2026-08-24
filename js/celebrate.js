/*
  File: /js/celebrate.js
  Website: celebrate.oze.au
  Description: Shared JS — theme, wishes, click-to-load embeds
  Version: 3.0.1
  Date: 24 Aug 2026 | 5:14 PM AEST
  Author: Colin Dixon + Claude Opus 4.8
*/
const VERSION = 'v3.0.1';   // source of truth for bump-version.sh

async function loadEvent(jsonPath) {
  const res = await fetch(jsonPath);
  if (!res.ok) throw new Error(`Failed to load ${jsonPath}`);
  return res.json();
}

/* Countdown — retained for archived invitation pages */
function startCountdown(targetDateStr) {
  const bar = document.getElementById('countdown-bar');
  if (!bar) return;
  function update() {
    const now = new Date();
    const target = new Date(targetDateStr + 'T12:00:00+10:00');
    const diff = target - now;
    if (diff <= 0) {
      bar.innerHTML =
        '<span style="font-family:var(--font-display);font-size:1.5rem;color:#CECBF6">The celebration has been held.</span>';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };
    set('cd-days', days);
    set('cd-hours', hours);
    set('cd-minutes', minutes);
    set('cd-seconds', seconds);
  }
  update();
  setInterval(update, 1000);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Theme toggle */
function initTheme() {
  const saved = localStorage.getItem('celebrate-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateToggleLabel(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('celebrate-theme', next);
  updateToggleLabel(next);
}

function updateToggleLabel(theme) {
  document.querySelectorAll('.theme-toggle, #theme-toggle').forEach((btn) => {
    btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
  });
}

/* Mobile nav */
function initNavToggle() {
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });

  nav.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });
  });
}

/* Smooth scroll for in-page anchors */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* Wishes wall */
function renderWishes(wishes, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!wishes || wishes.length === 0) {
    el.innerHTML = '<p class="gallery-empty">Birthday messages will appear here.</p>';
    return;
  }
  el.innerHTML = `<div class="wishes-grid">${wishes.map((w) => `
    <article class="wish-card">
      <p class="wish-text">${escapeHtml(w.message)}</p>
      <p class="wish-name">— ${escapeHtml(w.name)}</p>
    </article>`).join('')}</div>`;
}

/**
 * Click-to-load embed.
 * data-embed-type: youtube | kuula
 * data-embed-id / data-embed-src
 * data-embed-title
 */
function initClickToLoadEmbeds(root = document) {
  root.querySelectorAll('[data-embed-type]').forEach((shell) => {
    if (shell.dataset.bound === '1') return;
    shell.dataset.bound = '1';
    const btn = shell.querySelector('.embed-load');
    if (!btn) return;

    const load = () => {
      const type = shell.dataset.embedType;
      const title = shell.dataset.embedTitle || 'Embedded media';
      let src = '';
      if (type === 'youtube') {
        const id = shell.dataset.embedId;
        if (!id) return;
        src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      } else if (type === 'kuula') {
        src = shell.dataset.embedSrc || '';
        if (!src) return;
      } else {
        src = shell.dataset.embedSrc || '';
      }
      if (!src) return;
      shell.innerHTML = `<iframe src="${src}" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    };

    btn.addEventListener('click', load);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        load();
      }
    });
  });
}

function youtubeThumb(id) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}

function formatDateAu(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavToggle();
  initSmoothScroll();
  initClickToLoadEmbeds();
});
