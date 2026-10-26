// Structured data (schema.org JSON-LD) built from CMS content, so what search engines and AI
// assistants read always matches what is on the page.

export const SITE_URL = 'https://demandgenix.uk'

const id = (suffix) => `${SITE_URL}/#${suffix}`

export function blocksToPlain(blocks) {
  if (!Array.isArray(blocks)) return typeof blocks === 'string' ? blocks : ''
  return blocks
    .filter((b) => b && b._type === 'block')
    .map((b) => (b.children || []).map((c) => c.text || '').join(''))
    .join('\n\n')
    .trim()
}

const absolute = (url) => (!url ? undefined : url.startsWith('http') ? url : `${SITE_URL}${url}`)

// Nodes that describe the business and the person. Identical on every page.
export function buildSiteNodes(settings) {
  const s = settings
  const sameAs = (s.sameAs || []).filter(Boolean)

  const organization = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': id('organization'),
    name: s.tradingName || 'DemandGenix',
    legalName: s.companyName,
    url: SITE_URL,
    description: s.siteDescription,
    email: s.email,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/Favicon.svg` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: s.locality,
      addressRegion: s.region,
      addressCountry: s.country
    },
    areaServed: s.areaServed,
    founder: { '@id': id('founder') },
    ...(sameAs.length ? { sameAs } : {})
  }
  if (s.defaultOgImage?.url) organization.image = s.defaultOgImage.url

  const credentials = (s.founderCredentials || []).filter((c) => c && c.name && c.issuer)

  const founder = {
    '@type': 'Person',
    '@id': id('founder'),
    name: s.founderName,
    jobTitle: s.founderJobTitle,
    description: s.founderBio,
    url: SITE_URL,
    worksFor: { '@id': id('organization') },
    ...(s.founderLinkedIn ? { sameAs: [s.founderLinkedIn] } : {}),
    ...(s.founderKnowsAbout?.length ? { knowsAbout: s.founderKnowsAbout } : {}),
    ...(credentials.length
      ? {
          hasCredential: credentials.map((c, i) => ({
            '@type': 'EducationalOccupationalCredential',
            name: c.name,
            credentialCategory: 'Professional status',
            recognizedBy: { '@type': 'Organization', name: c.issuer, ...(c.issuerUrl ? { url: c.issuerUrl } : {}) },
            ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
            ...(i === 0 && s.founderBadge?.url ? { image: absolute(s.founderBadge.url) } : {})
          })),
          memberOf: credentials.map((c) => ({
            '@type': 'Organization',
            name: c.issuer,
            ...(c.issuerUrl ? { url: c.issuerUrl } : {})
          }))
        }
      : {})
  }

  const website = {
    '@type': 'WebSite',
    '@id': id('website'),
    url: SITE_URL,
    name: s.tradingName || 'DemandGenix',
    inLanguage: 'en-GB',
    publisher: { '@id': id('organization') }
  }

  return [organization, founder, website]
}

// Page kinds that may carry a `breadcrumb` (schema.org defines it on WebPage and its subtypes only).
// Anything else, an article for example, gets its own node linked to a separate WebPage node that holds
// the breadcrumb, which is the shape Google and schema.org's validator expect.
const WEBPAGE_TYPES = ['WebPage', 'ContactPage', 'CollectionPage', 'AboutPage', 'ItemPage', 'ProfilePage']

// Nodes for one page. `faqs` is [{ question, answer }] where answer is Portable Text or a string.
// `services` is [{ name, description }], passed only on the page that actually presents them.
export function buildPageNodes({ url, name, description, abstract, dateModified, breadcrumbs, faqs, services, extra, extraNodes, type = 'WebPage' }) {
  const pageId = `${url}#webpage`
  const articleId = `${url}#article`
  const nodes = []

  const finalType = (extra && extra['@type']) || type
  const isWebPage = [].concat(finalType).some((t) => WEBPAGE_TYPES.includes(t))

  const shared = {
    url,
    name,
    description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': id('website') },
    ...(dateModified ? { dateModified } : {})
  }

  let page
  let article = null
  if (isWebPage) {
    page = {
      '@type': type,
      '@id': pageId,
      ...shared,
      about: { '@id': id('organization') },
      ...(abstract ? { abstract } : {}),
      ...(extra || {})
    }
  } else {
    page = { '@type': 'WebPage', '@id': pageId, ...shared, mainEntity: { '@id': articleId } }
    article = {
      '@type': type,
      '@id': articleId,
      ...shared,
      ...(abstract ? { abstract } : {}),
      mainEntityOfPage: { '@id': pageId },
      ...(extra || {})
    }
  }

  if (breadcrumbs?.length) {
    page.breadcrumb = { '@id': `${url}#breadcrumb` }
    nodes.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: absolute(b.url)
      }))
    })
  }

  if (faqs?.length) {
    // A page's main entity is the FAQ itself; for an article the main entity is the article, so the
    // FAQ is a part of the page instead.
    if (isWebPage) page.mainEntity = { '@id': `${url}#faq` }
    else page.hasPart = [{ '@id': `${url}#faq` }]
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      isPartOf: { '@id': pageId },
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: blocksToPlain(f.answer) }
      }))
    })
  }

  for (const svc of services || []) {
    if (!svc.name) continue
    nodes.push({
      '@type': 'Service',
      '@id': `${url}#service-${svc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
      name: svc.name,
      description: svc.description,
      provider: { '@id': id('organization') },
      areaServed: svc.areaServed
    })
  }

  return [page, ...(article ? [article] : []), ...nodes, ...(extraNodes || [])]
}

export const toJsonLd = (nodes) => JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
