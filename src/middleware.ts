import { vaultFiles } from './data/vault.js';

export async function onRequest({ request }, next) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase(); // e.g., "cv.johnoosthuizen.com"

  // 1. Break the hostname down into a clean array of string components
  const parts = hostname.split('.'); // ['cv', 'johnoosthuizen', 'com']

  // 2. We only intercept if there is a distinct subdomain segment present
  if (parts.length > 2) {
    const firstSegment = parts[0]; // e.g., "cv" or "transcripts"

    // 3. Skip administrative or core application tracks immediately
    if (firstSegment !== 'www' && firstSegment !== 'thelogicpipeline') {
      
      // 4. Match the extracted segment directly against your file data registry
      const matchedFile = vaultFiles.find(file => 
        file.slug.toLowerCase().startsWith(firstSegment)
      );

      if (matchedFile) {
        // 5. Force an immediate dynamic redirect out to the asset route parameter
        const targetDestination = "https://johnoosthuizen.com" + matchedFile.slug;
        return Response.redirect(targetDestination, 301);
      }
    }
  }

  // Fall through gracefully to standard Astro page rendering if no file shortcut matches
  return next();
}