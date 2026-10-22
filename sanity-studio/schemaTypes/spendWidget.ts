// schemaTypes/spendWidget.ts
// The "Where the money goes" interactive. One set of wording, shown on the home and services pages.
// The site prints every tab's text into the page itself, so search engines and AI assistants read all of it.
export default {
  name: 'spendWidget',
  title: '"Where the money goes" interactive',
  type: 'object',
  fields: [
    {name: 'title', title: 'Heading', type: 'string', validation: (Rule: any) => Rule.required()},
    {
      name: 'areas',
      title: 'Tabs',
      type: 'array',
      validation: (Rule: any) => Rule.min(2).max(4),
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Tab name', type: 'string', validation: (Rule: any) => Rule.required()},
            {
              name: 'fixable',
              title: 'Usually fixable',
              type: 'text',
              rows: 2,
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'untraceable',
              title: 'Often can’t be tracked',
              type: 'text',
              rows: 2,
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {select: {title: 'name', subtitle: 'fixable'}},
        },
      ],
    },
    {
      name: 'footnote',
      title: 'Small print',
      type: 'string',
      description: 'Keep it honest: these are examples, not client results.',
    },
  ],
}
