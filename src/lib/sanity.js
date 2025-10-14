import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'fv5q0f3v',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Helper functions
export async function getHero() {
  return await client.fetch(`*[_type == "hero"][0]`)
}

export async function getServices() {
  return await client.fetch(`*[_type == "service"] | order(order asc)`)
}

export async function getAbout() {
  return await client.fetch(`*[_type == "about"][0]`)
}

export async function getContact() {
  return await client.fetch(`*[_type == "contact"][0]`)
}

export async function getSiteSettings() {
  return await client.fetch(`*[_type == "siteSettings"][0]`)
}
// Testimonials functions
export async function getTestimonials() {
  return await client.fetch(`
    *[_type == "testimonial"] {
      name,
      title,
      company,
      recommendation,
      linkedinUrl,
      relationship,
      order,
      isPublic,
      "profilePhoto": profilePhoto.asset->url
    } | order(order asc)
  `)
}

export async function getFeaturedTestimonials() {
  return await client.fetch(`
    *[_type == "testimonial" && isPublic == true] | order(order asc)[0..2] {
      name,
      title,
      company,
      recommendation,
      linkedinUrl,
      relationship,
      "profilePhoto": profilePhoto.asset->url
    }
  `)
}

// Blog functions
export async function getAllBlogPosts() {
  return await client.fetch(`
    *[_type == "blogPost" && isPublished == true] | order(publishDate desc) {
      _id,
      title,
      slug,
      excerpt,
      publishDate,
      category,
      tags,
      author,
      readingTime,
      isFeatured,
      "heroImage": heroImage{
        "url": asset->url,
        "alt": alt
      }
    }
  `)
}

export async function getFeaturedBlogPosts(limit = 3) {
  return await client.fetch(`
    *[_type == "blogPost" && isPublished == true && isFeatured == true] | order(publishDate desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      publishDate,
      category,
      author,
      readingTime,
      "heroImage": heroImage{
        "url": asset->url,
        "alt": alt
      }
    }
  `)
}

export async function getBlogPostBySlug(slug) {
  return await client.fetch(`
    *[_type == "blogPost" && slug.current == $slug && isPublished == true][0] {
      _id,
      title,
      slug,
      excerpt,
      content[]{
        ...,
        _type == "threeColumnBlock" => {
          _type,
          columns[]{
            title,
            content
          }
        },
        markDefs[]{
          ...,
          _type == "link" => {
            _type,
            _key,
            href
          }
        },
        children[]{
          ...,
          marks[]
        }
      },
      publishDate,
      category,
      tags,
      author,
      readingTime,
      metaTitle,
      metaDescription,
      "heroImage": heroImage{
        "url": asset->url,
        "alt": alt
      }
    }
  `, { slug })
}

export async function getRecentBlogPosts(limit = 6) {
  return await client.fetch(`
    *[_type == "blogPost" && isPublished == true] | order(publishDate desc)[0...${limit}] {
      _id,
      title,
      slug,
      excerpt,
      publishDate,
      category,
      author,
      readingTime,
      "heroImage": heroImage{
        "url": asset->url,
        "alt": alt
      }
    }
  `)
}
/* Force rebuild Wed 10 Sep 2025 16:40:57 BST */
/* Force rebuild Fri 12 Sep 2025 12:43:29 BST */
