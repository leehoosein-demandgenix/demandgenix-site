// Writes a Markdown twin beside every built page (dist/services/index.html -> dist/services/index.md).
// functions/_middleware.js serves the twin when a client asks for it with `Accept: text/markdown`,
// which is what Cloudflare's paid "Markdown for Agents" feature does, without the plan.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const SKIP_PAGES = new Set(['404.html']);

function makeConverter(pageUrl) {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
  td.use(gfm);
  td.remove(['script', 'style', 'noscript', 'template', 'svg', 'iframe', 'form', 'button']);
  td.remove((node) => node.getAttribute?.('aria-hidden') === 'true' || node.hasAttribute?.('hidden'));

  // Agents read the file out of context, so links and images need absolute URLs.
  const absolute = (value) => {
    try {
      return new URL(value, pageUrl).href;
    } catch {
      return value;
    }
  };
  td.addRule('absoluteLinks', {
    filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
    replacement: (content, node) => {
      const href = node.getAttribute('href');
      if (!content.trim() || href.startsWith('#')) return content;
      return `[${content.trim()}](${absolute(href)})`;
    }
  });
  td.addRule('absoluteImages', {
    filter: 'img',
    replacement: (_content, node) => {
      const alt = (node.getAttribute('alt') || '').trim();
      const src = node.getAttribute('src');
      return alt && src ? `![${alt}](${absolute(src)})` : '';
    }
  });
  return td;
}

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html') && !SKIP_PAGES.has(entry.name)) found.push(full);
  }
  return found;
}

export default function markdownTwins() {
  return {
    name: 'markdown-twins',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const site = 'https://demandgenix.uk';
        let written = 0;

        for (const file of await htmlFiles(outDir)) {
          const html = await readFile(file, 'utf8');
          const main = html.match(/<main[\s>][\s\S]*<\/main>/i)?.[0];
          if (!main) continue;

          // Pages with `noindex` are not public content, so they get no twin.
          if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;

          const rel = path.relative(outDir, file).split(path.sep).join('/');
          const pageUrl = `${site}/${rel.replace(/(^|\/)index\.html$/, '$1')}`;
          const markdown = makeConverter(pageUrl).turndown(main).replace(/\n{3,}/g, '\n\n').trim();
          if (!markdown) continue;

          await writeFile(file.replace(/\.html$/, '.md'), `${markdown}\n`);
          written++;
        }
        logger.info(`wrote ${written} markdown twins`);
      }
    }
  };
}
