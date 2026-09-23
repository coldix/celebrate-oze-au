import { defineConfig } from 'astro/config';

// Static site to dist/, served by Cloudflare Workers assets (no adapter).
// format 'preserve' mirrors the source tree: index.astro -> index.html,
// legal/terms.astro -> legal/terms.html, shirley90/index.astro ->
// shirley90/index.html. 'file' flattens that last one to /shirley90.html and
// loses the case-study URL; 'directory' would turn every flat page into a
// folder. Checked against the build output, not assumed.
export default defineConfig({
  site: 'https://celebrate.oze.au',
  output: 'static',
  build: { format: 'preserve', assets: 'astro' },
});
