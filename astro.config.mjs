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
    sitemap({
      // Manually injecting your clean best-practice subdomains into the build output index
      customPages: [
        'https://d-thesis.johnoosthuizen.com/assets/phd_dissertation.pdf',
        'https://m-thesis.johnoosthuizen.com/assets/mmus-thesis.pdf',
        'https://h-thesis.johnoosthuizen.com/assets/bmus-hons-assignment.pdf',
        'https://certificates.johnoosthuizen.com/assets/certs.pdf',
        'https://phdreports.johnoosthuizen.com/assets/phdreports.pdf',
        'https://transcripts.johnoosthuizen.com/assets/transcripts.pdf',
        'https://intl-exch-student.johnoosthuizen.com/assets/intl-exch-student.pdf',
        'https://cv.johnoosthuizen.com/assets/cv.pdf',
        'https://ea-certifications.johnoosthuizen.com/assets/ea-certs.pdf',
        'https://intl-courses.johnoosthuizen.com/assets/intl-courses.pdf',
        'https://article.johnoosthuizen.com/assets/article.pdf',
        'https://books.johnoosthuizen.com/assets/books.pdf'
      ]
    })
  ],

  // Configure the Cloudflare adapter to assemble structural routing files natively
  adapter: cloudflare({
    mode: 'directory'
  }),
});