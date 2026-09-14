import {defineConfig} from 'astro/config';
import react from '@astrojs/react';

// Static output for Cloudflare Pages. The whole site is a client-only React SPA
// (<App client:only>), so it prerenders a shell and hydrates in the browser.
// Server API routes (chat/subscribe) were removed — those move to Aurox. Client
// routing is handled by the SPA + a Pages catch-all redirect (public/_redirects).
export default defineConfig({
  output: 'static',
  integrations: [react()],
});
