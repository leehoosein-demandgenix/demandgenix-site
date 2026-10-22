// schemaTypes/seo.ts
// Reusable "search and sharing" block, attached to every page document.
export default {
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    {
      name: 'metaTitle',
      title: 'Search title',
      type: 'string',
      description:
        'The blue link in Google. Lead with what the page is about, put the brand last. Aim for 50 to 60 characters. This is separate from the on-page headline, so it can carry the words people actually search for.',
      validation: (Rule: any) => [
        Rule.required().error('Every page needs a search title'),
        Rule.min(30).warning('Under 30 characters leaves useful space unused'),
        Rule.max(60).warning('Over 60 characters is likely to be cut off in search results'),
      ],
    },
    {
      name: 'metaDescription',
      title: 'Search description',
      type: 'text',
      rows: 3,
      description:
        'The text under the link in search results. Say what the page offers and why to click. Aim for 110 to 160 characters. Written for a person, not a keyword list.',
      validation: (Rule: any) => [
        Rule.required().error('Every page needs a search description'),
        Rule.min(110).warning('Under 110 characters is short for a search snippet'),
        Rule.max(160).warning('Over 160 characters is likely to be cut off'),
      ],
    },
    {
      name: 'summary',
      title: 'Plain-English summary (for AI assistants)',
      type: 'text',
      rows: 4,
      description:
        'Two or three factual sentences saying who you are and what this page covers, with no marketing language. Used in structured data and llms.txt so AI assistants can describe you accurately. Aim for 40 to 70 words.',
      validation: (Rule: any) =>
        Rule.custom((value: string) => {
          if (!value) return true
          const words = value.trim().split(/\s+/).length
          if (words < 25) return 'A little short. Aim for 40 to 70 words.'
          if (words > 90) return 'Long for a summary. Aim for 40 to 70 words.'
          return true
        }).warning(),
    },
    {
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Shown when the page is shared on LinkedIn and elsewhere. 1200 x 630 pixels works best.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the image in a short sentence.',
          validation: (Rule: any) =>
            Rule.custom((alt: string, ctx: any) =>
              ctx.parent?.asset && !alt ? 'Add alt text for the image' : true,
            ),
        },
      ],
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical address (rarely needed)',
      type: 'url',
      description:
        'Leave blank. Only set this if this page is a near-copy of another page and you want search engines to treat the other one as the original.',
    },
    {
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      description: 'Switch on only for a page that should not appear in search results.',
    },
    {
      name: 'searchIntent',
      title: 'Who searches for this? (internal note)',
      type: 'text',
      rows: 3,
      description:
        'For your own reference, never shown on the site. Who is searching, what are they really asking, and which phrases should this page use naturally in its body copy?',
    },
  ],
}
