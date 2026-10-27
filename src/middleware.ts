import { vaultFiles } from './data/vault.js';

export async function onRequest({ request }, next) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase(); // e.g., "cv.johnoosthuizen.com"

  // Check if this is an incoming document shortcut subdomain
  if (hostname.includes('.') && !hostname.startsWith('www.') && !hostname.startsWith('thelogicpipeline.')) {
    // Safely extract the first prefix part before the first dot
    const subdomain = hostname.split('.')[0]; // e.g., "cv"

    // Scan your central vaultFiles registry for a slug matching the prefix
    const matchedFile = vaultFiles.find(file => 
      file.slug.toLowerCase().startsWith(subdomain)
    );

    if (matchedFile) {
      // Execute an immediate edge-level 301 redirect to the flat root asset path parameter
      return Response.redirect(`https://johnoosthuizen.com{matchedFile.slug}`, 301);
    }
  }

  // Continue to standard Astro page rendering if no document subdomain matches
  return next();
}