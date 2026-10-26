import { createClient } from '@sanity/client'
import { logger } from './logger.js'
import { siteSettingsDefaults, homePageDefaults, servicesPageDefaults, contactPageDefaults, blogPageDefaults } from '../content/defaults.js'

export const client = createClient({
  projectId: 'fv5q0f3v',
  dataset: 'production',
  useCdn: false, 
  apiVersion: '2024-01-01',
  requestTagPrefix: 'demandgenix',
  timeout: 5000, // 5 second timeout to prevent hanging
  retries: {
    maxRetries: 2,
    retryDelay: 300
  }
})

// Add error handling wrapper to prevent 5xx errors
async function fetchWithFallback(query, params = {}, fallback = null) {
  const typeMatch = query.match(/_type\s*==\s*"([^"]+)"/)
  const context = typeMatch ? typeMatch[1] : query.substring(0, 50).trim()
  try {
    const result = await client.fetch(query, params)
    // If query succeeds but returns null/undefined, use fallback
    if (result === null || result === undefined) {
      return fallback
    }
    return result
  } catch (error) {
    logger.error(context, error.message)
    // Return fallback instead of throwing (prevents 5xx errors)
    return fallback
  }
}

// --- Copy that lives in the CMS -------------------------------------------
// Each document is merged over the draft copy in src/content/defaults.js, field by field,
// so a page never renders blank if the CMS is empty, unreachable, or missing a field.
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)

export function withDefaults(defaults, doc) {
  if (!doc) return defaults
  const out = { ...doc }
  for (const [key, fallback] of Object.entries(defaults)) {
    const current = doc[key]
    if (isEmpty(current)) out[key] = fallback
    else if (isPlainObject(fallback) && isPlainObject(current)) out[key] = withDefaults(fallback, current)
  }
  return out
}

const imageRef = (field) => `${field}{ alt, "url": asset->url }`
// Photos also carry their size and hotspot, so the page can crop around the face and reserve space.
const photoRef = (field) => `${field}{ alt, hotspot, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`

// Site settings and the two pages are read many times during a build, so fetch each once.
// In development they are always re-fetched so edits in Studio show up on refresh.
const cache = {}
function once(name, load) {
  if (import.meta.env?.DEV) return load()
  if (!cache[name]) cache[name] = load()
  return cache[name]
}

export function getSiteSettings() {
  return once('siteSettings', async () => {
    const doc = await fetchWithFallback(
      `*[_type == "siteSettings"][0]{ ..., ${imageRef('defaultOgImage')}, ${photoRef('founderBadge')} }`,
      {},
      null
    )
    return withDefaults(siteSettingsDefaults, doc)
  })
}

export function getHomePage() {
  return once('homePage', async () => {
    const doc = await fetchWithFallback(
      `*[_type == "homePage"][0]{ ..., _updatedAt, ${photoRef('heroPhoto')}, ${photoRef('aboutPhoto')}, seo{ ..., ${imageRef('ogImage')} } }`,
      {},
      null
    )
    return withDefaults(homePageDefaults, doc)
  })
}

export function getContactPage() {
  return once('contactPage', async () => {
    const doc = await fetchWithFallback(
      `*[_type == "contactPage"][0]{ ..., _updatedAt, seo{ ..., ${imageRef('ogImage')} } }`,
      {},
      null
    )
    return withDefaults(contactPageDefaults, doc)
  })
}

export function getBlogPage() {
  return once('blogPage', async () => {
    const doc = await fetchWithFallback(
      `*[_type == "blogPage"][0]{ ..., _updatedAt, seo{ ..., ${imageRef('ogImage')} } }`,
      {},
      null
    )
    return withDefaults(blogPageDefaults, doc)
  })
}

export function getServicesPage() {
  return once('servicesPage', async () => {
    const doc = await fetchWithFallback(
      `*[_type == "servicesPage"][0]{ ..., _updatedAt, seo{ ..., ${imageRef('ogImage')} } }`,
      {},
      null
    )
    return withDefaults(servicesPageDefaults, doc)
  })
}

// Testimonials functions
export async function getTestimonials() {
  return await fetchWithFallback(
    `
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
    `,
    {},
    [
      {
        name: "Matt Hurley",
        title: "Creative Director",
        company: "",
        recommendation: "Lee is an exceptional marketer who blends creativity with data-driven strategy to deliver campaigns that really do deliver. He's collaborative, forward-thinking, and a fantastic partner to work with from concept through to execution.",
        linkedinUrl: "https://www.linkedin.com/in/mattphurley/",
        relationship: "LinkedIn Recommendation",
        order: 1,
        isPublic: true,
        profilePhoto: "https://cdn.sanity.io/images/fv5q0f3v/production/7cef51bd5b55245acfd620f612fd60616f88ef05-800x800.jpg"
      },
      {
        name: "Zoe Laycock",
        title: "Product Marketing Leader",
        company: "",
        recommendation: "Lee is a strategic thinker and a hands-on executor, blending creative storytelling with data-driven decision-making to deliver outstanding results. I highly recommend Lee to any organization looking for a results-driven marketer with strong leadership and strategic vision.",
        linkedinUrl: "https://www.linkedin.com/in/zoelaycock/",
        relationship: "LinkedIn Recommendation",
        order: 2,
        isPublic: true,
        profilePhoto: "https://cdn.sanity.io/images/fv5q0f3v/production/30e798f60e92e086c6b15cb13f094ab3bde640c3-412x412.jpg"
      },
      {
        name: "Will Dolby",
        title: "Head of Sector Marketing",
        company: "",
        recommendation: "Lee's brilliant at balancing creativity with data-driven decisions, and he always knows how to deliver a great campaign. On top of all that, Lee is a genuinely great person to work with - positive, collaborative and always ready to support others.",
        linkedinUrl: "https://www.linkedin.com/in/william-dolby-81446927/",
        relationship: "LinkedIn Recommendation",
        order: 3,
        isPublic: true,
        profilePhoto: "https://cdn.sanity.io/images/fv5q0f3v/production/ccff9def3142b2e38820521ae55bba7489164341-316x316.jpg"
      }
    ]
  )
}

// Blog functions
export async function getAllBlogPosts() {
  return await fetchWithFallback(
    `
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
    `,
    {},
    []
  )
}

export async function getFeaturedBlogPosts(limit = 3) {
  return await fetchWithFallback(
    `
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
    `,
    {},
    []
  )
}

export async function getBlogPostBySlug(slug) {
  return await fetchWithFallback(
    `
    *[_type == "blogPost" && slug.current == $slug && isPublished == true][0] {
      _id,
      _updatedAt,
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
        _type == "comparisonTable" => {
          _type,
          col1Header,
          col2Header,
          col3Header,
          rows[]{
            col1,
            col2,
            col3
          }
        },
        _type == "twoColumnTable" => {
          _type,
          col1Header,
          col2Header,
          rows[]{
            label,
            value
          }
        },
        _type == "fiveColumnTable" => {
          _type,
          tableTitle,
          col1Header,
          col2Header,
          col3Header,
          col4Header,
          col5Header,
          rows[]{
            col1,
            col2,
            col3,
            col4,
            col5
          }
        },
        _type == "calloutBox" => {
          _type,
          type,
          title,
          content
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
      },
      faqs[]{ question, answer }
    }
    `,
    { slug },
    null
  )
}

export async function getRecentBlogPosts(limit = 6) {
  return await fetchWithFallback(
    `
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
    `,
    {},
    []
  )
}

/* Force rebuild Wed 10 Sep 2025 16:40:57 BST */
/* Force rebuild Fri 12 Sep 2025 12:43:29 BST */