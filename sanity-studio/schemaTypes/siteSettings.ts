// schemaTypes/siteSettings.ts
// Things that appear on every page, plus the facts search engines and AI assistants use to describe the business.
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'cta', title: 'Button and menu', default: true},
    {name: 'widget', title: '"Where the money goes"'},
    {name: 'business', title: 'Business facts'},
    {name: 'person', title: 'About you (for search and AI)'},
    {name: 'legacy', title: 'Company details'},
  ],
  fields: [
    // Button and menu
    {
      name: 'ctaLabel',
      title: 'Main button wording',
      type: 'string',
      group: 'cta',
      description: 'Used on every main button across the site, so it only ever needs changing here.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ctaNote',
      title: 'Small line beside the button',
      type: 'string',
      group: 'cta',
    },
    {
      name: 'writeNote',
      title: 'Line for people who would rather write',
      type: 'string',
      group: 'cta',
      description: 'Shown under the Home page button and in its closing section. It links to your email address.',
    },
    {
      name: 'ctaHref',
      title: 'Where the button goes',
      type: 'string',
      group: 'cta',
      initialValue: '/contact/',
    },
    {
      name: 'navLinks',
      title: 'Menu links',
      type: 'array',
      group: 'cta',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required()},
            {name: 'href', title: 'Address', type: 'string', validation: (Rule: any) => Rule.required()},
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        },
      ],
    },

    // Widget
    {name: 'spendWidget', title: '"Where the money goes"', type: 'spendWidget', group: 'widget'},

    // Business facts
    {
      name: 'siteDescription',
      title: 'What the business is, in two sentences',
      type: 'text',
      rows: 3,
      group: 'business',
      description:
        'Plain, factual, no marketing language. Search engines and AI assistants use this to describe you, so it should be accurate and consistent with your LinkedIn.',
    },
    {name: 'tradingName', title: 'Name you trade under', type: 'string', group: 'business'},
    {name: 'email', title: 'Contact email', type: 'string', group: 'business'},
    {name: 'locality', title: 'Town or city', type: 'string', group: 'business', description: 'For example Manchester.'},
    {name: 'region', title: 'County or region', type: 'string', group: 'business'},
    {name: 'country', title: 'Country code', type: 'string', group: 'business', initialValue: 'GB'},
    {
      name: 'areaServed',
      title: 'Where you work',
      type: 'array',
      group: 'business',
      of: [{type: 'string'}],
      description: 'Countries or regions you take clients in.',
    },
    {
      name: 'defaultOgImage',
      title: 'Default social share image',
      type: 'image',
      group: 'business',
      description:
        'Shown when a page that has no image of its own is shared on LinkedIn and elsewhere. 1200 x 630 pixels. Until one is set, shared links show no image.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule: any) =>
            Rule.custom((alt: string, ctx: any) => (ctx.parent?.asset && !alt ? 'Add alt text for the image' : true)),
        },
      ],
    },
    {
      name: 'sameAs',
      title: 'Official profiles',
      type: 'array',
      group: 'business',
      of: [{type: 'url'}],
      description:
        'Your company’s official profiles (LinkedIn company page and so on). These tie your site to the same business on other sites. Only add profiles you actively keep up.',
    },

    // About you
    {name: 'founderName', title: 'Your name', type: 'string', group: 'person'},
    {name: 'founderJobTitle', title: 'Your title', type: 'string', group: 'person'},
    {
      name: 'founderBio',
      title: 'One-sentence bio',
      type: 'text',
      rows: 2,
      group: 'person',
      description: 'Factual and specific. Used in structured data and by AI assistants when they say who runs the business.',
    },
    {name: 'founderLinkedIn', title: 'Your LinkedIn address', type: 'url', group: 'person'},
    {
      name: 'founderBadge',
      title: 'Credential badge',
      type: 'image',
      group: 'person',
      description:
        'The official digital badge, shown beside your credentials on the Home page. Use the image exactly as issued: do not recolour or restyle it. It links to the first credential\u2019s public record.',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'For example "CIM Chartered Member (CMCIM) digital badge".',
          validation: (Rule: any) =>
            Rule.custom((alt: string, ctx: any) => (ctx.parent?.asset && !alt ? 'Add alt text for the badge' : true)),
        },
      ],
    },
    {
      name: 'founderCredentials',
      title: 'Your credentials',
      type: 'array',
      group: 'person',
      description:
        'Professional qualifications or chartered status. Shown on the Home page, and published to search engines and AI assistants as verifiable credentials. Only list ones you can point to a public record for.',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Credential', type: 'string', description: 'For example "Chartered Marketer".', validation: (Rule: any) => Rule.required()},
            {name: 'issuer', title: 'Awarded by', type: 'string', validation: (Rule: any) => Rule.required()},
            {name: 'issuerUrl', title: 'Awarding body website', type: 'url'},
            {
              name: 'verifyUrl',
              title: 'Public record',
              type: 'url',
              description: 'A page where anyone can check it, such as the awarding body\u2019s member directory.',
            },
          ],
          preview: {select: {title: 'name', subtitle: 'issuer'}},
        },
      ],
    },
    {
      name: 'founderKnowsAbout',
      title: 'Topics you are an authority on',
      type: 'array',
      group: 'person',
      of: [{type: 'string'}],
      description: 'Short topic names, for example "Paid advertising". Only list things you can back up.',
    },

    // Existing company details (kept as they were)
    {name: 'siteTitle', title: 'Site Title', type: 'string', group: 'legacy'},
    {name: 'linkedinUrl', title: 'Company LinkedIn URL', type: 'url', group: 'legacy'},
    {name: 'companyName', title: 'Legal Company Name', type: 'string', group: 'legacy'},
    {name: 'companyNumber', title: 'Company Number', type: 'string', group: 'legacy'},
    {name: 'vatNumber', title: 'VAT Number', type: 'string', group: 'legacy'},
    {name: 'registeredAddress', title: 'Registered Address', type: 'text', group: 'legacy'},
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
}
