import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { vaultFiles } from './src/data/vault.js';

export default defineConfig({
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  output: 'server',
  site: 'https://thelogicpipeline.johnoosthuizen.com',

  integrations: [
    sitemap({
      customPages: vaultFiles.map(f => `https://johnoosthuizen.com/assets/${f.slug}`)
    })
  ],

  adapter: cloudflare(),
});