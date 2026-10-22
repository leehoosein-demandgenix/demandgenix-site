// schemaTypes/blogPage.ts
// The blog's index page and the call to action at the foot of every post. The posts themselves
// are managed as "Blog posts".
export default {
  name: 'blogPage',
  title: 'Blog page',
  type: 'document',
  groups: [
    {name: 'hero', title: '1. Hero', default: true},
    {name: 'lists', title: '2. Lists'},
    {name: 'cta', title: '3. After each post'},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    {name: 'heroKicker', title: 'Small line above the headline', type: 'string', group: 'hero'},
    {name: 'heroHeadline', title: 'Headline', type: 'string', group: 'hero', validation: (Rule: any) => Rule.required()},
    {name: 'heroSub', title: 'Sub-line', type: 'text', rows: 3, group: 'hero'},

    {name: 'featuredHeading', title: 'Featured articles heading', type: 'string', group: 'lists'},
    {name: 'allHeading', title: 'All articles heading', type: 'string', group: 'lists'},

    {name: 'postCtaHeading', title: 'Heading', type: 'string', group: 'cta', description: 'Shown under every post, above the main button.'},
    {name: 'postCtaNote', title: 'Small line under the button', type: 'string', group: 'cta'},

    {name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo'},
  ],
  preview: {prepare: () => ({title: 'Blog page'})},
}
