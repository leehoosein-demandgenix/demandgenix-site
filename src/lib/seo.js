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
          hasCredential: credentials.map((c) => ({
            '@type': 'EducationalOccupationalCredential',
            name: c.name,
            credentialCategory: 'Professional status',
            recognizedBy: { '@type': 'Organization', name: c.issuer, ...(c.issuerUrl ? { url: c.issuerUrl } : {}) },
            ...(c.verifyUrl ? { url: c.verifyUrl } : {})
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

// Nodes for one page. `faqs` is [{ question, answer }] where answer is Portable Text or a string.
// `services` is [{ name, description }], passed only on the page that actually presents them.
export function buildPageNodes({ url, name, description, abstract, dateModified, breadcrumbs, faqs, services, extra, extraNodes, type = 'WebPage' }) {
  const pageId = `${url}#webpage`
  const nodes = []

  const page = {
    '@type': type,
    '@id': pageId,
    url,
    name,
    description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': id('website') },
    about: { '@id': id('organization') },
    ...(abstract ? { abstract } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(extra || {})
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
    page.mainEntity = { '@id': `${url}#faq` }
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

  return [page, ...nodes, ...(extraNodes || [])]
}

export const toJsonLd = (nodes) => JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
