import { vaultFiles } from './data/vault.js';

export async function onRequest({ request }, next) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase(); // e.g., "cv.johnoosthuizen.com"

  // Process rules only if it is an incoming document shortcut subdomain
  if (hostname.includes('.') && !hostname.startsWith('www.') && !hostname.startsWith('thelogicpipeline.')) {
    
    // CRITICAL FIX: Extract strictly the FIRST text string element before the first dot
    const subdomain = hostname.split('.')[0]; // e.g., "cv"

    // Scan your central data array for a slug matching this string prefix
    const matchedFile = vaultFiles.find(file => 
      file.slug.toLowerCase().startsWith(subdomain)
    );

    if (matchedFile) {
      const targetDestination = "https://johnoosthuizen.com" + matchedFile.slug;
      return Response.redirect(targetDestination, 301);
    }
  }

  // Continue to standard Astro page lifecycle if no shortcut maps out
  return next();
}