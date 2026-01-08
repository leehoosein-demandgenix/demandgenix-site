import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'fv5q0f3v',
  dataset: 'production',
  useCdn: true, 
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
  try {
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    console.error(`Sanity fetch error for query: ${query.substring(0, 50)}...`, error.message)
    // Return fallback instead of throwing (prevents 5xx errors)
    return fallback
  }
}

// Helper functions - now with current live site fallbacks
export async function getHero() {
  return await fetchWithFallback(
    `*[_type == "hero"][0]`,
    {},
    {
      title: 'Stop Guessing. Start Scaling. Senior B2B Demand Gen Leadership, Without the Headcount.',
      subtitle: 'I help B2B companies fix broken pipelines, lower CAC, and build predictable revenue engines. 20 years experience. Impact in 90 days.',
      description: '',
      ctaText: 'Get a free strategy review',
      ctaLink: '/contact'
    }
  )
}

export async function getServices() {
  return await fetchWithFallback(
    `*[_type == "service"] | order(order asc)`,
    {},
    [
      {
        name: 'The Fractional Leader',
        price: 'Custom pricing',
        duration: 'Ongoing',
        description: 'For teams that need ongoing direction.',
        features: [
          '1-2 days/week',
          'Strategy + Hands-on execution',
          'Team mentoring included'
        ],
        order: 1
      },
      {
        name: 'The 90-Day Sprint',
        price: 'Custom pricing',
        duration: '90 days',
        description: 'For specific problems that need solving now.',
        features: [
          'Full Audit & Roadmap',
          'Channel, tracking and measurement setup',
          'Handover to your team'
        ],
        order: 2
      }
    ]
  )
}

export async function getAbout() {
  return await fetchWithFallback(
    `*[_type == "about"][0]`,
    {},
    {
      title: "Why we built DemandGenix",
      content: [
        {
          _type: 'block',
          children: [
            {
              text: "In my 20-years experience in working in scale up companies, I've felt the pain and pressure on marketing teams to hit growth goals. Companies need to scale fast, and choosing between an agency or building a team (or both) eats up valuable time."
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              text: "I built DemandGenix to be the third option; boutique expertise with startup speed. I know what it's like to be under pressure to prove ROI, to have limited budget for experiments, and to need results yesterday while building for tomorrow."
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              text: "My approach is simple: diagnose fast, fix the foundations, scale efficiently. No overly-long commitments, no enterprise overhead, just clear outcomes delivered in weeks."
            }
          ]
        }
      ],
      edgePoints: [
        {
          title: "Boutique Agility, Not Agency Overhead",
          description: "Get direct access to a B2B digital marketing strategist who can also do the work for you. No relaying the same info to different members of the same team, and faster execution turnaround."
        },
        {
          title: "Structured Experiments, Adaptive Execution",
          description: "I provide a 90-day plan with a clear scope of deliverables, and the agility to pivot fast on the experimentation insights. This gives you a clear of idea of what works, and what doesn't, to give you a greater chance of pipeline growth."
        },
        {
          title: "Practical Over Performative",
          description: "Results are more important to me than accolades. Based on the KPIs that are important to your growth goals, each recommendation includes customised implementation advice and success metrics."
        },
        {
          title: "Partnership, Not Vendor Relationship",
          description: "When you succeed, so do I. Even if it means suggesting something I don't do, expect frank advice supported by solid data."
        }
      ]
    }
  )
}

export async function getContact() {
  return await fetchWithFallback(
    `*[_type == "contact"][0]`,
    {},
    {
      title: "Let's figure this out together",
      description: "Whether you need a quick audit, a strategic conversation, or you're ready to dive into a full engagement, I'm here to help. No sales pressure, just practical advice.",
      ctaText: "Get in touch",
      calendlyLink: "/contact",
      email: "hello@demandgenix.uk",
      phone: ""
    }
  )
}

export async function getSiteSettings() {
  return await fetchWithFallback(
    `*[_type == "siteSettings"][0]`,
    {},
    {
      siteTitle: "Demand Generation and Digital Marketing in Manchester, UK | DemandGenix",
      siteDescription: "Manchester-based demand gen and digital marketing consultancy helping growing companies scale efficiently. Fixed-scope sprints, fractional leadership, AI utilization.",
      linkedinUrl: "https://linkedin.com/company/demandgenix",
      companyName: "DemandGenix Limited",
      companyNumber: "16660290",
      vatNumber: "501 3963 18",
      registeredAddress: "48 Sandy Lane, Prestwich, Manchester, M25 9NB"
    }
  )
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

export async function getFeaturedTestimonials() {
  return await fetchWithFallback(
    `
    *[_type == "testimonial" && isPublic == true] | order(order asc)[0..2] {
      name,
      title,
      company,
      recommendation,
      linkedinUrl,
      relationship,
      "profilePhoto": profilePhoto.asset->url
    }
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
        profilePhoto: "https://cdn.sanity.io/images/fv5q0f3v/production/7cef51bd5b55245acfd620f612fd60616f88ef05-800x800.jpg"
      },
      {
        name: "Zoe Laycock",
        title: "Product Marketing Leader",
        company: "",
        recommendation: "Lee is a strategic thinker and a hands-on executor, blending creative storytelling with data-driven decision-making to deliver outstanding results. I highly recommend Lee to any organization looking for a results-driven marketer with strong leadership and strategic vision.",
        linkedinUrl: "https://www.linkedin.com/in/zoelaycock/",
        relationship: "LinkedIn Recommendation",
        profilePhoto: "https://cdn.sanity.io/images/fv5q0f3v/production/30e798f60e92e086c6b15cb13f094ab3bde640c3-412x412.jpg"
      },
      {
        name: "Will Dolby",
        title: "Head of Sector Marketing",
        company: "",
        recommendation: "Lee's brilliant at balancing creativity with data-driven decisions, and he always knows how to deliver a great campaign. On top of all that, Lee is a genuinely great person to work with - positive, collaborative and always ready to support others.",
        linkedinUrl: "https://www.linkedin.com/in/william-dolby-81446927/",
        relationship: "LinkedIn Recommendation",
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