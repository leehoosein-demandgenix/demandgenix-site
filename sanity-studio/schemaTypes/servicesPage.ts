// schemaTypes/servicesPage.ts
// Deliberately has no prices, tiers or rung names. Cost is discussed on the intro call.
export default {
  name: 'servicesPage',
  title: 'Services page',
  type: 'document',
  groups: [
    {name: 'hero', title: '1. Hero', default: true},
    {name: 'who', title: '2. Who it’s for'},
    {name: 'areas', title: '3. What I take on'},
    {name: 'honest', title: '4. The honest bit'},
    {name: 'start', title: '5. How we’d start'},
    {name: 'isnt', title: '6. What this isn’t'},
    {name: 'faq', title: '7. Questions'},
    {name: 'closing', title: '8. Closing'},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    // Hero
    {name: 'heroKicker', title: 'Small line above the headline', type: 'string', group: 'hero'},
    {
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      description: 'Plain words. This is the page’s main heading.',
      validation: (Rule: any) => [Rule.required(), Rule.max(90).warning('Long for a headline. Two lines reads best.')],
    },
    {
      name: 'heroSub',
      title: 'Sub-line',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Roughly 20 words.',
      validation: (Rule: any) => Rule.required(),
    },
    {name: 'familiarLabel', title: 'Quote panel label', type: 'string', group: 'hero'},
    {
      name: 'familiarQuote',
      title: 'Quote panel text',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'The situation in your buyer’s own words.',
    },
    {name: 'familiarNote', title: 'Quote panel note', type: 'string', group: 'hero'},

    // Who it's for
    {name: 'whoHeading', title: 'Heading', type: 'string', group: 'who'},
    {
      name: 'whoPoints',
      title: 'The situation, one line each',
      type: 'array',
      group: 'who',
      of: [{type: 'string'}],
    },
    {name: 'whoTail', title: 'Closing line', type: 'string', group: 'who'},

    // What I take on
    {name: 'areasHeading', title: 'Heading', type: 'string', group: 'areas'},
    {
      name: 'areas',
      title: 'The areas',
      type: 'array',
      group: 'areas',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name on the page', type: 'string', validation: (Rule: any) => Rule.required()},
            {
              name: 'searchName',
              title: 'Name for search engines',
              type: 'string',
              description:
                'The plain, searchable name of this service, used in structured data only, for example "Paid advertising management". Not shown on the page.',
            },
            {name: 'summary', title: 'One-line summary', type: 'text', rows: 2},
            {name: 'whatIDo', title: 'What I do', type: 'simpleRichText'},
            {
              name: 'lookFirst',
              title: 'What I look at first',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
          preview: {select: {title: 'name', subtitle: 'summary'}},
        },
      ],
    },

    // The honest bit
    {name: 'honestLabel', title: 'Small label', type: 'string', group: 'honest'},
    {name: 'honestHeading', title: 'Heading', type: 'string', group: 'honest'},
    {
      name: 'honestBody',
      title: 'Text',
      type: 'simpleRichText',
      group: 'honest',
      description: 'The "Where the money goes" interactive sits beside this. Its wording is under Site settings.',
    },

    // How we'd start
    {name: 'startHeading', title: 'Heading', type: 'string', group: 'start'},
    {
      name: 'startSteps',
      title: 'Steps, in order',
      type: 'array',
      group: 'start',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Step title', type: 'string', validation: (Rule: any) => Rule.required()},
            {name: 'body', title: 'What happens', type: 'simpleRichText'},
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    },
    {name: 'startNeed', title: 'What I’ll need from you', type: 'simpleRichText', group: 'start'},

    // What this isn't
    {name: 'isntHeading', title: 'Heading', type: 'string', group: 'isnt'},
    {
      name: 'isntItems',
      title: 'Points',
      type: 'array',
      group: 'isnt',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'lead', title: 'Bold lead-in', type: 'string', validation: (Rule: any) => Rule.required()},
            {name: 'text', title: 'Rest of the sentence', type: 'text', rows: 2},
          ],
          preview: {select: {title: 'lead', subtitle: 'text'}},
        },
      ],
    },

    // Questions
    {name: 'faqHeading', title: 'Heading', type: 'string', group: 'faq'},
    {
      name: 'faqs',
      title: 'Questions and answers',
      type: 'array',
      group: 'faq',
      of: [{type: 'faqItem'}],
      description:
        'These appear on the page and are published as FAQ structured data, which is how they get picked up by search results and AI assistants. Write real questions in the words people use.',
    },

    // Closing
    {name: 'closingHeading', title: 'Heading', type: 'string', group: 'closing'},
    {name: 'closingNote', title: 'Small line under the button', type: 'string', group: 'closing'},

    // Search and sharing
    {name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo'},
  ],
  preview: {prepare: () => ({title: 'Services page'})},
}
