import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  
  // Explicitly compile into Cloudflare Serverless Edge Functions
  output: 'server', 

  // Set your single, absolute primary deployment domain
  site: 'https://thelogicpipeline.johnoosthuizen.com',

  integrations: [
    sitemap()
  ],

  // Configure the Cloudflare adapter to assemble structural routing files natively
  adapter: cloudflare({
    mode: 'directory'
  }),
});