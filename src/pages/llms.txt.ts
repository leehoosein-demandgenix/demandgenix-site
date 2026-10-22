// Generates /llms.txt (https://llmstxt.org) from the CMS: a plain-text briefing that AI assistants can
// read in one request. It uses only what is published on the site, so it cannot drift from it.
import { getSiteSettings, getHomePage, getServicesPage, getContactPage, getBlogPage, getAllBlogPosts } from '../lib/sanity.js';
import { SITE_URL, blocksToPlain } from '../lib/seo.js';
import { getCategoryLabel } from '../lib/blogHelpers.js';

const oneLine = (s: string) => String(s || '').replace(/\s+/g, ' ').trim();
const joinList = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items[0] || '');

export async function GET() {
  const [settings, home, services, contact, blog, posts] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServicesPage(),
    getContactPage(),
    getBlogPage(),
    getAllBlogPosts().catch(() => [])
  ]);

  const url = (path: string) => `${SITE_URL}${path}`;
  const lines: string[] = [];

  lines.push(`# ${settings.tradingName}`, '');
  lines.push(`> ${oneLine(settings.siteDescription)}`, '');
  lines.push(oneLine(home.seo.summary), '');
  lines.push(
    `${settings.companyName} is based in ${settings.locality}, UK, and works remotely with clients in ${joinList(settings.areaServed)}. ` +
      `It is run by ${settings.founderName}, ${settings.founderJobTitle}. ${oneLine(settings.founderBio)}`,
    ''
  );

  lines.push('## What DemandGenix takes on', '');
  lines.push(oneLine(services.seo.summary), '');
  lines.push(`The descriptions below are written in the first person by ${settings.founderName}, who runs DemandGenix.`, '');
  for (const area of services.areas) {
    lines.push(`### ${area.name}`, '', oneLine(area.summary), '', oneLine(blocksToPlain(area.whatIDo)), '');
    if (area.lookFirst?.length) {
      lines.push('What is looked at first:');
      for (const item of area.lookFirst) lines.push(`- ${item}`);
      lines.push('');
    }
  }

  lines.push('## Who it is for', '');
  for (const point of services.whoPoints) lines.push(`- ${point}`);
  if (services.whoTail) lines.push('', services.whoTail);
  lines.push('');

  lines.push('## How work starts', '');
  services.startSteps.forEach((step: any, i: number) => {
    lines.push(`${i + 1}. **${step.title}.** ${oneLine(blocksToPlain(step.body))}`);
  });
  lines.push('', oneLine(blocksToPlain(services.startNeed)), '');

  lines.push('## Pricing', '');
  lines.push('Prices are not published. Cost depends on what the first piece of work finds, and is discussed on the free intro call before any commitment.', '');

  lines.push('## Questions and answers', '');
  for (const faq of services.faqs) lines.push(`**${faq.question}**`, oneLine(blocksToPlain(faq.answer)), '');

  lines.push('## Pages', '');
  lines.push(`- [Home](${url('/')}): ${oneLine(home.seo.metaDescription)}`);
  lines.push(`- [Services](${url('/services/')}): ${oneLine(services.seo.metaDescription)}`);
  lines.push(`- [Blog](${url('/blog/')}): ${oneLine(blog.seo.metaDescription)}`);
  lines.push(`- [Contact](${url(settings.ctaHref || '/contact/')}): ${oneLine(contact.seo.metaDescription)}`);
  lines.push('');

  if (posts.length) {
    lines.push('## Blog articles', '');
    for (const post of posts) {
      const date = post.publishDate ? ` (${String(post.publishDate).slice(0, 10)}, ${getCategoryLabel(post.category)})` : '';
      lines.push(`- [${oneLine(post.title)}](${url(`/blog/${post.slug.current}/`)}): ${oneLine(post.excerpt)}${date}`);
    }
    lines.push('');
  }

  lines.push('## Contact', '');
  lines.push(`- Email: ${settings.email}`);
  lines.push(`- Free 30-minute intro call: ${url(settings.ctaHref || '/contact/')}`);
  lines.push(`- ${oneLine(contact.responseTime)}`);
  if (settings.founderLinkedIn) lines.push(`- LinkedIn (${settings.founderName}): ${settings.founderLinkedIn}`);
  for (const profile of settings.sameAs || []) lines.push(`- ${profile}`);
  lines.push('');

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
