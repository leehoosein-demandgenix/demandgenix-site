import { getAllBlogPosts } from '../lib/sanity.js';

export async function GET() {
  const baseUrl = 'https://demandgenix.uk';
  
  // Get all published blog posts
  let blogPosts = [];
  try {
    blogPosts = await getAllBlogPosts();} catch (error) {
   console.error('Error fetching blog posts for sitemap:', error);
 }
 
 // Static pages
 const staticPages = [
   { 
     url: '', 
     priority: '1.0', 
     changefreq: 'weekly',
     lastmod: new Date().toISOString().split('T')[0]
   },
   { 
     url: '/contact/', 
     priority: '0.9', 
     changefreq: 'monthly',
     lastmod: new Date().toISOString().split('T')[0]
   },
   { 
     url: '/blog/', 
     priority: '0.8', 
     changefreq: 'weekly',
     lastmod: new Date().toISOString().split('T')[0]
   },
   { 
     url: '/privacy-policy/', 
     priority: '0.5', 
     changefreq: 'yearly',
     lastmod: new Date().toISOString().split('T')[0]
   },
   { 
     url: '/cookie-policy/', 
     priority: '0.5', 
     changefreq: 'yearly',
     lastmod: new Date().toISOString().split('T')[0]
   }
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
   <lastmod>${page.lastmod}</lastmod>
   <changefreq>${page.changefreq}</changefreq>
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