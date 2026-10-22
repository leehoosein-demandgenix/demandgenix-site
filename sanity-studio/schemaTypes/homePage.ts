// schemaTypes/homePage.ts
// One document, edited top to bottom in the order the page reads.
const photo = (name: string, title: string, group: string, description: string) => ({
  name,
  title,
  type: 'image',
  group,
  description,
  options: {hotspot: true},
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description: 'Describe the photo in a short sentence. Read by screen readers, search engines and AI assistants.',
      validation: (Rule: any) =>
        Rule.custom((alt: string, ctx: any) => (ctx.parent?.asset && !alt ? 'Add alt text for the photo' : true)),
    },
  ],
})

export default {
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    {name: 'hero', title: '1. Hero', default: true},
    {name: 'offer', title: '2. What I take on'},
    {name: 'honest', title: '3. The honest bit'},
    {name: 'start', title: '4. How we’d start'},
    {name: 'proof', title: '5. Proof'},
    {name: 'about', title: '6. About'},
    {name: 'closing', title: '7. Closing'},
    {name: 'faq', title: 'Questions'},
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
      description:
        'Plain words, no jargon. This is the page’s main heading, so make it say what the page is about. Aim for two lines.',
      validation: (Rule: any) => [Rule.required(), Rule.max(90).warning('Long for a headline. Two lines reads best.')],
    },
    {
      name: 'heroSub',
      title: 'Sub-line',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'One or two short sentences. Roughly 20 words.',
      validation: (Rule: any) => Rule.required(),
    },
    photo('heroPhoto', 'Portrait', 'hero', 'Portrait of you, roughly 4:5. Natural light, mid-conversation.'),

    // What I take on
    {name: 'offerHeading', title: 'Heading', type: 'string', group: 'offer'},
    {name: 'offerLede', title: 'Intro sentence', type: 'text', rows: 2, group: 'offer'},
    {
      name: 'offerItems',
      title: 'The things I take on',
      type: 'array',
      group: 'offer',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string', validation: (Rule: any) => Rule.required()},
            {name: 'description', title: 'One-line description', type: 'text', rows: 2},
          ],
          preview: {select: {title: 'name', subtitle: 'description'}},
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
      description: 'Bold and links available. Link to a relevant blog post where it helps.',
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

    // Proof
    {name: 'proofHeading', title: 'Heading', type: 'string', group: 'proof'},
    {name: 'caseStudyTitle', title: 'Case study headline', type: 'string', group: 'proof'},
    {name: 'caseStudyBody', title: 'Case study summary', type: 'text', rows: 3, group: 'proof'},
    {
      name: 'caseStudyMeasured',
      title: 'How was it measured?',
      type: 'text',
      rows: 2,
      group: 'proof',
      description:
        'One plain sentence on how the result was measured. Shown beside the figure. If you cannot say, leave the figure out.',
    },
    {
      name: 'caseStudyLink',
      title: 'Link to the full case study',
      type: 'string',
      group: 'proof',
      description: 'A path such as /blog/your-case-study/',
    },
    {
      name: 'feedbackHeading',
      title: 'Feedback heading',
      type: 'string',
      group: 'proof',
      description: 'The recommendations themselves are managed under Testimonials.',
    },

    // About
    {name: 'aboutHeading', title: 'Heading', type: 'string', group: 'about'},
    {name: 'aboutBody', title: 'Text', type: 'simpleRichText', group: 'about'},
    photo('aboutPhoto', 'Second photo', 'about', 'A square image of you working. Optional.'),

    // Closing
    {name: 'closingHeading', title: 'Heading', type: 'string', group: 'closing'},
    {name: 'closingNote', title: 'Small line under the button', type: 'string', group: 'closing'},

    // Questions (optional on the home page)
    {
      name: 'faqs',
      title: 'Questions and answers (optional)',
      type: 'array',
      group: 'faq',
      of: [{type: 'faqItem'}],
      description:
        'If you add any, they appear on the page and are published as FAQ structured data. Only add questions you want to be found for.',
    },

    // Search and sharing
    {name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo'},
  ],
  preview: {prepare: () => ({title: 'Home page'})},
}
