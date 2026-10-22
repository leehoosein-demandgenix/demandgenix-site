// schemaTypes/simpleRichText.ts
// Paragraphs with bold, italic and links, and nothing else. Keeps copy consistent and lets
// you link to other pages and blog posts from the body text, which helps search engines.
export default {
  name: 'simpleRichText',
  title: 'Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'string',
                title: 'Address',
                description:
                  'Use a path such as /services/ or /blog/my-post/ for pages on this site (best for search), or a full https:// address for other sites.',
                validation: (Rule: any) => Rule.required(),
              },
            ],
          },
        ],
      },
    },
  ],
}
