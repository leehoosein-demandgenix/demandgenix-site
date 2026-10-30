// Cloudflare Pages Function: serves a page's Markdown twin, which src/integrations/markdown-twins.js
// writes at build time. It does so for `Accept: text/markdown` and for direct `.md` addresses
// (/services.md or /services/index.md). Every other request passes straight through.

// True when the client names text/markdown and ranks it at least as high as text/html. Browsers never
// list it, and a bare `*/*` does not count, so they keep getting HTML.
export function prefersMarkdown(accept) {
  if (!accept) return false;
  const q = {};
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const weight = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    q[type.trim()] = weight ? Number.parseFloat(weight.slice(2)) || 0 : 1;
  }
  const markdown = q['text/markdown'] ?? 0;
  return markdown > 0 && markdown >= (q['text/html'] ?? 0);
}

// "/services/" -> "/services/index.md"; anything with a file extension is not a page.
export function twinPath(pathname) {
  if (pathname.endsWith('/')) return `${pathname}index.md`;
  const last = pathname.split('/').pop();
  return last.includes('.') ? null : `${pathname}/index.md`;
}

// "/services.md" -> "/services/index.md"; "/services/index.md" and "/index.md" are already twins.
export function directTwinPath(pathname) {
  if (pathname.endsWith('/index.md')) return pathname;
  return `${pathname.slice(0, -'.md'.length)}/index.md`;
}

export async function onRequest({ request, next, env }) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();

  const url = new URL(request.url);
  const isDirect = url.pathname.endsWith('.md');
  const twin = isDirect
    ? directTwinPath(url.pathname)
    : prefersMarkdown(request.headers.get('Accept'))
      ? twinPath(url.pathname)
      : null;

  if (twin) {
    const asset = await env.ASSETS.fetch(new URL(twin, url));
    if (asset.ok) {
      const page = twin.slice(0, -'index.md'.length);
      const headers = new Headers({
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        Link: `<${url.origin}${page}>; rel="canonical"`,
        'X-Robots-Tag': 'noindex',
        Vary: 'Accept'
      });
      return new Response(request.method === 'HEAD' ? null : asset.body, { headers });
    }
  }

  // No twin found: carry on as normal, so a mistyped .md address gets the usual 404 page as HTML.
  const response = await next();
  if (!(response.headers.get('Content-Type') || '').includes('text/html')) return response;
  // Tell caches that the same URL can answer differently depending on Accept.
  const varied = new Response(response.body, response);
  varied.headers.append('Vary', 'Accept');
  return varied;
}
