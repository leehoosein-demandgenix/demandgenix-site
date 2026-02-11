// schemaTypes/programmesPage.ts
export default {
  name: 'programmesPage',
  title: 'Programmes Page',
  type: 'document',
  fields: [
    {
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
      description: 'Main heading for the programmes page hero',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      description: 'Subheading text below the main heading',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'metaTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Page title for SEO (appears in browser tab and search results)',
      validation: (Rule: any) => Rule.required().max(60),
    },
    {
      name: 'metaDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Page description for SEO (appears in search results)',
      validation: (Rule: any) => Rule.required().max(160),
    },
    {
      name: 'metaKeywords',
      title: 'SEO Keywords',
      type: 'string',
      description: 'Comma-separated keywords for SEO',
    },
    {
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image shown when page is shared on social media',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'heroHeading',
      subtitle: 'metaTitle',
    },
  },
}
