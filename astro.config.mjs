import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  
  // Set your primary deployment subdomain engine path
  site: 'https://johnoosthuizen.com',
  
  integrations: [
    sitemap({
      // Manually injecting your clean best-practice subdomains into the build output index
      customPages: [
        'https://cv.johnoosthuizen.com',
        'https://phdreports.johnoosthuizen.com',
        'https://theses.johnoosthuizen.com',
        'https://theses.johnoosthuizen.com/masters',
        'https://theses.johnoosthuizen.com/honours',
        'https://transcripts.johnoosthuizen.com',
        'https://credentials.johnoosthuizen.com',
        'https://publications.johnoosthuizen.com'
      ]
    })
  ],
});