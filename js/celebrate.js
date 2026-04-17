/* celebrate.oze.au | celebrate.js | v1.1 | 2026-04-14 22:30 AEST */

/* Load event config and render dynamic content */
async function loadEvent(jsonPath) {
  const res = await fetch(jsonPath);
  const cfg = await res.json();
  return cfg;
}

/* Countdown timer */
function startCountdown(targetDateStr, timezone) {
  function update() {
    const now = new Date();
    const target = new Date(targetDateStr + 'T12:00:00+10:00');
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('countdown-bar').innerHTML =
        '<span style="font-family:var(--font-display);font-size:1.5rem;color:#CECBF6">The celebration is today! 🎂</span>';
      return;
    }
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('cd-days').textContent    = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2,'0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2,'0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
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
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
}

/* Format date nicely */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const d = new Date(); d.setHours(h, m);
  return d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/* Wishes wall -- load from local JSON or API */
function renderWishes(wishes, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!wishes || wishes.length === 0) {
    el.innerHTML = '<p class="placeholder-block">Birthday wishes will appear here as guests RSVP and send messages.</p>';
    return;
  }
  el.innerHTML = wishes.map(w => `
    <div class="wish-card">
      <p class="wish-text">${w.message}</p>
      <p class="wish-name">-- ${w.name}${w.location ? ', ' + w.location : ''}</p>
    </div>
  `).join('');
}

/* Smooth scroll nav */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
