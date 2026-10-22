// schemaTypes/contactPage.ts
export default {
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  groups: [
    {name: 'hero', title: '1. Hero', default: true},
    {name: 'form', title: '2. Form'},
    {name: 'expect', title: '3. What to expect'},
    {name: 'details', title: '4. Contact details'},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    {name: 'heroKicker', title: 'Small line above the headline', type: 'string', group: 'hero'},
    {
      name: 'heroHeadline',
      title: 'Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule: any) => [Rule.required(), Rule.max(90).warning('Long for a headline. Two lines reads best.')],
    },
    {name: 'heroSub', title: 'Sub-line', type: 'text', rows: 3, group: 'hero', validation: (Rule: any) => Rule.required()},

    {name: 'formHeading', title: 'Form heading', type: 'string', group: 'form'},
    {name: 'formIntro', title: 'Line under the heading', type: 'string', group: 'form'},
    {
      name: 'privacyNote',
      title: 'Privacy note under the button',
      type: 'simpleRichText',
      group: 'form',
      description: 'This is consent wording. Keep the link to the privacy policy, and check any change with whoever advises you on GDPR.',
    },
    {name: 'successMessage', title: 'Message after sending', type: 'text', rows: 2, group: 'form'},
    {
      name: 'errorMessage',
      title: 'Message if sending fails',
      type: 'text',
      rows: 2,
      group: 'form',
      description: 'Write {email} where the email link should go.',
    },

    {name: 'expectHeading', title: 'Heading', type: 'string', group: 'expect'},
    {
      name: 'expectSteps',
      title: 'Steps, in order',
      type: 'array',
      group: 'expect',
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

    {name: 'detailsHeading', title: 'Heading', type: 'string', group: 'details'},
    {name: 'responseTime', title: 'Response time', type: 'text', rows: 2, group: 'details', description: 'Say one thing, and say it once. It appears only here.'},
    {name: 'locationNote', title: 'Location line', type: 'string', group: 'details'},

    {name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo'},
  ],
  preview: {prepare: () => ({title: 'Contact page'})},
}
