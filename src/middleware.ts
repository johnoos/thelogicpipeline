import { vaultFiles } from './data/vault.js';

export async function onRequest({ request }, next) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase(); // e.g., "cv.johnoosthuizen.com"

  // Check if this is an incoming document shortcut subdomain
  if (hostname.includes('.') && !hostname.startsWith('www.') && !hostname.startsWith('thelogicpipeline.')) {
    // Safely isolate the first prefix string part before the first dot
    const subdomain = hostname.split('.')[0]; // e.g., "cv"

    // Scan your central vaultFiles registry for a slug matching the prefix prefix
    const matchedFile = vaultFiles.find(file => 
      file.slug.toLowerCase().startsWith(subdomain)
    );

    if (matchedFile) {
      // Direct concatenation eliminates template string interpolation syntax errors completely
      const targetDestination = "https://johnoosthuizen.com" + matchedFile.slug;
      
      return Response.redirect(targetDestination, 301);
    }
  }

  // Continue to standard Astro page rendering if no document subdomain matches
  return next();
}