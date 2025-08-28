// schemaTypes/about.ts
export default {
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Rich text content for the about section',
    },
    {
      name: 'edgePoints',
      title: 'Our Edge Points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Point Title'},
            {name: 'description', type: 'text', title: 'Point Description'},
          ],
        },
      ],
    },
  ],
}
