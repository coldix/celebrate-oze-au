#!/usr/bin/env node
/*
    File: /scripts/smoke-test.mjs
    Website: celebrate.oze.au
    Description: Parity checks for the Astro build against the live Hostinger
                 pages, plus the structural facts this port depends on: the
                 /shirley90/ directory URL, relative asset paths, and the
                 JSON the case study fetches at runtime.
    Author: Colin Dixon + Claude Opus 5
*/
import { readFileSync, existsSync } from 'node:fs';

let failures = 0;
const check = (name, ok, detail = '') => {
  if (ok) return console.log(`ok   ${name}`);
  failures++;
  console.error(`FAIL ${name}${detail ? ` - ${detail}` : ''}`);
};

if (!existsSync('dist/index.html')) {
  console.error('dist/ is missing. Run `npm run build` first.');
  process.exit(1);
}

const PAGES = [
  'index.html',
  'legal/terms.html',
  'legal/privacy.html',
  'legal/disclaimer.html',
  'shirley90/index.html',
  'shirley90/invitation.html',
];

const decode = (t) =>
  t
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&times;/g, '×')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const visibleText = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

for (const page of PAGES) {
  const live = visibleText(readFileSync(page, 'utf8'));
  const built = visibleText(readFileSync(`dist/${page}`, 'utf8'));
  let detail = '';
  if (live !== built) {
    const i = [...live].findIndex((c, n) => c !== built[n]);
    detail = `first difference at ${i}: live "${live.slice(i - 40, i + 60)}" vs built "${built.slice(i - 40, i + 60)}"`;
  }
  check(`${page} visible text matches the live page`, live === built, detail);
}

// The whole reason this site uses build.format 'preserve': the case study must
// stay a directory index so /shirley90/ keeps working. 'file' emits
// /shirley90.html instead, which silently moves a URL that is in print.
check('case study is a directory index', existsSync('dist/shirley90/index.html'));
check('case study was NOT flattened to /shirley90.html', !existsSync('dist/shirley90.html'));
check('invitation sits under the case study', existsSync('dist/shirley90/invitation.html'));
for (const legal of ['terms', 'privacy', 'disclaimer']) {
  check(`legal/${legal} built`, existsSync(`dist/legal/${legal}.html`));
}
check('404 page built for not_found_handling', existsSync('dist/404.html'));
check('sitemap generated', existsSync('dist/sitemap.xml'));

const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
check('sitemap keeps the /shirley90/ trailing slash', sitemap.includes('<loc>https://celebrate.oze.au/shirley90/</loc>'));
check('sitemap has no .html addresses', !sitemap.includes('.html'));

// Relative asset paths resolve the same from /legal/terms, /shirley90/ and
// /shirley90/invitation, so they are kept exactly as the live pages wrote them.
const shirley = readFileSync('dist/shirley90/index.html', 'utf8');
const invitation = readFileSync('dist/shirley90/invitation.html', 'utf8');
const terms = readFileSync('dist/legal/terms.html', 'utf8');
check('case study keeps ../css/celebrate.css', shirley.includes('href="../css/celebrate.css'));
check('case study keeps css/shirley90.css', shirley.includes('href="css/shirley90.css'));
check('case study loads celebrate.js, shirley90.js and confetti.js', ['../js/celebrate.js', 'js/shirley90.js', '../js/confetti.js'].every((s) => shirley.includes(s)));
check('invitation loads invitation.js', invitation.includes('js/invitation.js'));
check('legal pages keep ../css/celebrate.css', terms.includes('href="../css/celebrate.css'));

// The case study fetches its content at runtime; those files must ship.
for (const f of ['shirley90/event.json', 'shirley90/wishes.json', 'shirley90/css/shirley90.css', 'shirley90/js/shirley90.js', 'shirley90/js/invitation.js', 'css/celebrate.css', 'css/adnet.css', 'js/celebrate.js', 'js/confetti.js']) {
  check(`dist ships ${f}`, existsSync(`dist/${f}`));
}
check('the flyer PDF ships', existsSync('dist/shirley90/shirley90-flyer.pdf'));
check('local-only Python helpers do not ship', !existsSync('dist/shirley90/generate_flyer.py') && !existsSync('dist/legal/generate_consent_pdf.py'));

// No page may still point at a .html address that now redirects.
for (const page of PAGES) {
  const html = readFileSync(`dist/${page}`, 'utf8');
  check(`${page} has no stale .html links`, !/href="[^"]*(?:terms|privacy|disclaimer|invitation)\.html"/.test(html));
}
// ...but /shirley90/ links must keep their trailing slash.
const home = readFileSync('dist/index.html', 'utf8');
check('home links to /shirley90/ with its slash', /href="[^"]*shirley90\/"/.test(home));

check('home loads the house ad tag', home.includes('https://ads.oze.net.au/t.js'));
check('adnet.css only on the home page', home.includes('css/adnet.css') && !shirley.includes('adnet.css'));

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
