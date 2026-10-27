import { vaultFiles } from './data/vault.js';
import type { MiddlewareHandler } from 'astro';

const ROOT = 'johnoosthuizen.com';
const RESERVED = new Set(['www', 'thelogicpipeline']);

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const { hostname } = new URL(request.url);
  const host = hostname.toLowerCase();

  if (host.endsWith(`.${ROOT}`)) {
    const sub = host.slice(0, -(ROOT.length + 1));
    if (!sub.includes('.') && !RESERVED.has(sub)) {
      const file = vaultFiles.find(f => f.slug.replace(/\.pdf$/i, '').toLowerCase() === sub);
      if (file) {
        return Response.redirect(`https://${ROOT}/assets/${file.slug}`, 302);
      }
    }
  }
  return next();
};