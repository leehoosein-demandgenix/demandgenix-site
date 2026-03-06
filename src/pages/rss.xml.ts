import { getAllBlogPosts } from '../lib/sanity.js';

export async function GET() {
  const baseUrl = 'https://demandgenix.uk';

  let blogPosts = [];
  try {
    blogPosts = await getAllBlogPosts();
  } catch (error) {
    console.error('Error fetching blog posts for RSS feed:', error);
  }

  const items = blogPosts.map(post => {
    const postUrl = `${baseUrl}/blog/${post.slug.current}/`;
    const pubDate = post.publishDate
      ? new Date(post.publishDate).toUTCString()
      : new Date().toUTCString();
    const excerpt = post.excerpt
      ? post.excerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      : '';

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category><![CDATA[${post.category}]]></category>` : ''}
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DemandGenix Blog</title>
    <link>${baseUrl}/blog/</link>
    <description>Demand generation insights, pipeline strategy, and B2B marketing advice from DemandGenix.</description>
    <language>en-gb</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'max-age=3600',
    },
  });
}
