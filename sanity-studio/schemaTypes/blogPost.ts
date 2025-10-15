import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Post Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80).warning('Shorter titles are better for SEO')
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      description: 'Brief summary for preview cards and meta description'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'content',
      title: 'Blog Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'}
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'}
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (Optional)'
            }
          ]
        },
        {
          type: 'threeColumnBlock'
        },
        {
      type: 'code',
      title: 'Code Block',
      options: {
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'Python', value: 'python' },
          { title: 'Bash', value: 'bash' },
          { title: 'SQL', value: 'sql' }
        ],
        withFilename: true
        }
      }
      ]
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Lee Hoosein'
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Demand Generation', value: 'demand-generation'},
          {title: 'Conversion Optimization', value: 'conversion-optimization'},
          {title: 'B2B Marketing', value: 'b2b-marketing'},
          {title: 'SaaS Growth', value: 'saas-growth'},
          {title: 'Analytics & Tracking', value: 'analytics-tracking'},
          {title: 'Case Studies', value: 'case-studies'},
          {title: 'Industry Insights', value: 'industry-insights'}
        ]
      }
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for optimal SEO')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters for optimal SEO')
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to publish/unpublish this post'
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
      description: 'Featured posts appear prominently on the blog page'
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'heroImage',
      published: 'isPublished'
    },
    prepare(selection) {
      const {title, author, published} = selection
      return {
        title: title,
        subtitle: `${author} ${published ? '• Published' : '• Draft'}`
      }
    }
  },
  orderings: [
    {
      title: 'Publish Date (Newest)',
      name: 'publishDateDesc',
      by: [{field: 'publishDate', direction: 'desc'}]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}]
    }
  ]
})