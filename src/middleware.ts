import { vaultFiles } from './data/vault.js';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const parts = hostname.split('.');

  // Intercept subdomains (e.g., ://johnoosthuizen.com)
  if (parts.length > 2) {
    const firstSegment = parts[0]; 

    // Bypass canonical system domains
    if (firstSegment !== 'www' && firstSegment !== 'thelogicpipeline') {
      const matchedFile = vaultFiles.find(file => 
        file.slug.toLowerCase().startsWith(firstSegment)
      );

      if (matchedFile) {
        // Construct the correct target path with the explicit assets folder
        const targetDestination = "https://johnoosthuizen.com" + matchedFile.slug;
        return Response.redirect(targetDestination, 301);
      }
    }
  }

  return next();
};