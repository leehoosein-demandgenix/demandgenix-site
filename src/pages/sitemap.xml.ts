import { getAllBlogPosts, getHomePage, getServicesPage, getContactPage, getBlogPage } from '../lib/sanity.js';

// A lastmod is only given where a real date exists: when a page was last edited in the CMS, or when a
// post was published. Stamping every URL with the build date teaches search engines to ignore the field.
const day = (value?: string) => (value ? String(value).split('T')[0] : undefined);

export async function GET() {
  const baseUrl = 'https://demandgenix.uk';

  const safe = async <T,>(label: string, load: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await load();
    } catch (error) {
      console.error(`Error fetching ${label} for sitemap:`, error);
      return fallback;
    }
  };

  const [posts, home, services, contact, blog] = await Promise.all([
    safe('blog posts', () => getAllBlogPosts(), [] as any[]),
    safe('home page', () => getHomePage(), null as any),
    safe('services page', () => getServicesPage(), null as any),
    safe('contact page', () => getContactPage(), null as any),
    safe('blog page', () => getBlogPage(), null as any)
  ]);

  // The blog index changes when a post is added, so it is as fresh as the newest post or its own copy.
  const newestPost = posts.map((p: any) => day(p.publishDate)).filter(Boolean).sort().pop();
  const blogUpdated = [day(blog?._updatedAt), newestPost].filter(Boolean).sort().pop();

  const pages = [
    { url: '', priority: '1.0', changefreq: 'weekly', lastmod: day(home?._updatedAt) },
    { url: '/services/', priority: '0.9', changefreq: 'monthly', lastmod: day(services?._updatedAt) },
    { url: '/contact/', priority: '0.9', changefreq: 'monthly', lastmod: day(contact?._updatedAt) },
    { url: '/blog/', priority: '0.8', changefreq: 'weekly', lastmod: blogUpdated },
    { url: '/privacy-policy/', priority: '0.5', changefreq: 'yearly', lastmod: undefined },
    { url: '/cookie-policy/', priority: '0.5', changefreq: 'yearly', lastmod: undefined },
    ...posts.map((post: any) => ({
      url: `/blog/${post.slug.current}/`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: day(post.publishDate)
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
${page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>\n` : ''}    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}
