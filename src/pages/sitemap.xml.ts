// src/pages/sitemap.xml.ts
// Dynamic sitemap generator with Sanity CMS integration

import type { APIRoute } from 'astro';

// Static pages configuration
const staticPages = [
    { 
      url: '', 
      priority: '1.0', 
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    { 
      url: '/contact', 
      priority: '0.9', 
      changefreq: 'monthly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    { 
      url: '/privacy-policy', 
      priority: '0.5', 
      changefreq: 'yearly',
      lastmod: new Date().toISOString().split('T')[0]
    },
    { 
      url: '/cookie-policy', 
      priority: '0.5', 
      changefreq: 'yearly',
      lastmod: new Date().toISOString().split('T')[0]
    }
];

// Function to fetch dynamic content from Sanity (when implemented)
async function getDynamicPages() {
  const dynamicPages = [];
  
  try {
    // Example: Fetch blog posts from Sanity
    // const client = createClient({
    //   projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    //   dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    //   useCdn: true
    // });
    
    // const posts = await client.fetch(`
    //   *[_type == "post" && !(_id in path("drafts.**"))] {
    //     "slug": slug.current,
    //     _updatedAt
    //   }
    // `);
    
    // posts.forEach(post => {
    //   dynamicPages.push({
    //     url: `/blog/${post.slug}/`,
    //     priority: '0.7',
    //     changefreq: 'monthly',
    //     lastmod: post._updatedAt.split('T')[0]
    //   });
    // });

    // Example: Case studies (when implemented)
    // const caseStudies = await client.fetch(`
    //   *[_type == "caseStudy" && !(_id in path("drafts.**"))] {
    //     "slug": slug.current,
    //     _updatedAt
    //   }
    // `);
    
    // caseStudies.forEach(study => {
    //   dynamicPages.push({
    //     url: `/case-studies/${study.slug}/`,
    //     priority: '0.8',
    //     changefreq: 'monthly',
    //     lastmod: study._updatedAt.split('T')[0]
    //   });
    // });

  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
    // Continue with static pages only if CMS fetch fails
  }
  
  return dynamicPages;
}

export const GET: APIRoute = async () => {
  try {
    // Fetch dynamic pages
    const dynamicPages = await getDynamicPages();
    
    // Combine static and dynamic pages
    const allPages = [...staticPages, ...dynamicPages];
    
    // Sort pages by priority (highest first)
    allPages.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));
    
    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>https://demandgenix.uk${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Robots-Tag': 'noindex' // Don't index the sitemap itself
      }
    });
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap with just static pages if there's an error
    const basicSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>https://demandgenix.uk${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(basicSitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800' // Shorter cache on error
      }
    });
  }
};