#!/usr/bin/env node
/*
  File: scripts/sync-family.mjs
  Website: celebrate.oze.au
  Description: Pull the OZE family kit (https://oze.au/family/) in before a build.
               Saves family.json to src/data/oze-family.json and family.css to
               src/styles/oze-family.css. If oze.au cannot be reached, the last saved copy
               is kept and the build carries on. See oze.au docs/FAMILY-KIT.md.
  Version: 3.1.0
  Date: 23/10/2026 | 3:45 PM AEDT
  Author: Colin Dixon + Claude
*/
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const BASE = process.env.OZE_FAMILY_URL || 'https://oze.au/family/';
const files = [
  ['family.json', join(root, 'src/data/oze-family.json')],
  ['family.css', join(root, 'src/styles/oze-family.css')],
];

for (const [name, dest] of files) {
  try {
    const res = await fetch(new URL(name, BASE), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (name.endsWith('.json')) {
      const data = JSON.parse(text);
      if (!Array.isArray(data.sites) || data.sites.length === 0) throw new Error('no sites in family.json');
    }
    writeFileSync(dest, text);
    console.log(`family kit: updated ${name}`);
  } catch (err) {
    if (!existsSync(dest)) throw new Error(`family kit: cannot fetch ${name} and there is no saved copy (${err.message})`);
    console.log(`family kit: kept the saved ${name} (${err.message})`);
  }
}
