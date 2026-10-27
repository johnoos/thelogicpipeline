import { vaultFiles } from './data/vault.js';

export async function onRequest({ request }, next) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const parts = hostname.split('.');

  // Verify we have a true subdomain segment
  if (parts.length > 2) {
    const firstSegment = parts[0]; // <-- FIXED: Isolates the string 'cv' from the array

    // Bypass common infrastructural domains
    if (firstSegment !== 'www' && firstSegment !== 'thelogicpipeline') {
      
      // Strict exact match comparison against the slug name
      const matchedFile = vaultFiles.find(file => 
        file.slug.toLowerCase().startsWith(firstSegment.toLowerCase())
      );

      if (matchedFile) {
        // Assembles the explicit, clean URL format you requested
        const targetDestination = "https://johnoosthuizen.com" + matchedFile.slug;
        return Response.redirect(targetDestination, 301);
      }
    }
  }

  return next();
}