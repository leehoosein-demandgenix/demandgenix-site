import { getAllBlogPosts, getHomePage } from '../lib/sanity.js';

export async function GET() {
  const baseUrl = 'https://demandgenix.uk';
  
  // Get all published blog posts
  let blogPosts = [];
  try {
    blogPosts = await getAllBlogPosts();} catch (error) {
   console.error('Error fetching blog posts for sitemap:', error);
 }
 
 // Static pages. A lastmod date is only given where a real one exists (a page edited in the CMS);
 // stamping every page with today's date teaches search engines to ignore the field.
 let homeUpdated;
 try {
   const home = await getHomePage();
   homeUpdated = home?._updatedAt?.split('T')[0];
 } catch (error) {
   console.error('Error fetching home page for sitemap:', error);
 }

 const staticPages = [
   { url: '', priority: '1.0', changefreq: 'weekly', lastmod: homeUpdated },
   { url: '/contact/', priority: '0.9', changefreq: 'monthly' },
   { url: '/blog/', priority: '0.8', changefreq: 'weekly' },
   { url: '/privacy-policy/', priority: '0.5', changefreq: 'yearly' },
   { url: '/cookie-policy/', priority: '0.5', changefreq: 'yearly' }
 ];

 // Blog post pages
 const blogPages = blogPosts.map(post => ({
   url: `/blog/${post.slug.current}/`,
   priority: '0.7',
   changefreq: 'monthly',
   lastmod: post.publishDate
 }));

 // Combine all pages
 const allPages = [...staticPages, ...blogPages];

 const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
   <loc>${baseUrl}${page.url}</loc>
${page.lastmod ? `   <lastmod>${page.lastmod}</lastmod>\n` : ''}   <changefreq>${page.changefreq}</changefreq>
   <priority>${page.priority}</priority>
 </url>`).join('\n')}
</urlset>`;

 return new Response(sitemap, {
   headers: {
     'Content-Type': 'application/xml',
     'Cache-Control': 'max-age=3600'
   },
 });
}