/*
    File: /src/pages/sitemap.xml.ts
    Website: celebrate.oze.au
    Description: Sitemap for the addresses Cloudflare serves. The case study
                 keeps its trailing slash; the flat pages lose .html. The repo
                 root sitemap.xml still lists the .html addresses for Hostinger
                 and is not copied into the build.
    Author: Colin Dixon + Claude Opus 5
*/
import type { APIRoute } from 'astro';
import { SITE_URL } from '../site';

const pages = [
  { path: '/', priority: '1.0' },
  { path: '/shirley90/', priority: '0.9' },
  { path: '/shirley90/invitation', priority: '0.6' },
  { path: '/legal/terms', priority: '0.3' },
  { path: '/legal/privacy', priority: '0.3' },
  { path: '/legal/disclaimer', priority: '0.3' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
