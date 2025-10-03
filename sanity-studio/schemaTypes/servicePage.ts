// sanity-studio/schemaTypes/servicePage.ts

import { defineType } from 'sanity'

export default defineType({
  name: 'servicePage',
  title: 'Service Pages',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Main headline for the service page',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      description: 'Title for search engines (50-60 characters)',
      validation: Rule => Rule.max(60)
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
      description: 'Description for search engines (150-160 characters)',
      validation: Rule => Rule.max(160)
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Main Headline',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'subheading',
          title: 'Subheading',
          type: 'text',
          rows: 3
        },
        {
          name: 'primaryCta',
          title: 'Primary CTA Text',
          type: 'string'
        },
        {
          name: 'primaryCtaLink',
          title: 'Primary CTA Link',
          type: 'string'
        },
        {
          name: 'secondaryCta',
          title: 'Secondary CTA Text',
          type: 'string'
        },
        {
          name: 'secondaryCtaLink',
          title: 'Secondary CTA Link',
          type: 'string'
        }
      ]
    },
    {
      name: 'problemSection',
      title: 'Problem Section',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H3', value: 'h3'},
                {title: 'Quote', value: 'blockquote'}
              ],
              lists: [
                {title: 'Bullet', value: 'bullet'},
                {title: 'Number', value: 'number'}
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'}
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
            }
          ]
        }
      ]
    },
    {
      name: 'solutionOverview',
      title: 'Solution Overview',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H3', value: 'h3'}
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'}
                ]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'serviceOfferings',
      title: 'Service Offerings',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceOffering',
          title: 'Service Offering',
          fields: [
            {
              name: 'name',
              title: 'Service Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'subtitle',
              title: 'Subtitle/Badge',
              type: 'string',
              description: 'e.g., "Signature Sprint", "Most Popular"'
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              description: 'e.g., "3-4 weeks", "Ongoing"'
            },
            {
              name: 'investment',
              title: 'Investment/Price',
              type: 'string',
              description: 'e.g., "£3,500–£5,000", "£4,000/month"'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3
            },
            {
              name: 'deliverables',
              title: 'What You Get',
              type: 'array',
              of: [{type: 'string'}]
            },
            {
              name: 'perfectFor',
              title: 'Perfect For',
              type: 'text',
              rows: 2,
              description: 'Who this service is ideal for'
            },
            {
              name: 'featured',
              title: 'Featured Service',
              type: 'boolean',
              description: 'Highlight this service with special styling'
            }
          ]
        }
      ]
    },
    {
      name: 'processSection',
      title: 'Process & Methodology',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'steps',
          title: 'Process Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'processStep',
              fields: [
                {
                  name: 'title',
                  title: 'Step Title',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3
                },
                {
                  name: 'timeline',
                  title: 'Timeline',
                  type: 'string',
                  description: 'e.g., "Week 1", "Days 1-3"'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'whyChooseUs',
      title: 'Why Choose DemandGenix',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'points',
          title: 'Key Points',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'keyPoint',
              fields: [
                {
                  name: 'title',
                  title: 'Point Title',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'resultsSection',
      title: 'Results & Proof Points',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'metrics',
          title: 'Typical Improvements',
          type: 'array',
          of: [{type: 'string'}]
        },
        {
          name: 'testimonial',
          title: 'Featured Testimonial',
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string'
            },
            {
              name: 'title',
              title: 'Author Title',
              type: 'string'
            },
            {
              name: 'company',
              title: 'Company',
              type: 'string'
            }
          ]
        }
      ]
    },
    {
      name: 'gettingStarted',
      title: 'Getting Started Section',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                {title: 'Normal', value: 'normal'},
                {title: 'H3', value: 'h3'}
              ],
              lists: [
                {title: 'Bullet', value: 'bullet'}
              ],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'}
                ]
              }
            }
          ]
        },
        {
          name: 'primaryCta',
          title: 'Primary CTA Text',
          type: 'string'
        },
        {
          name: 'primaryCtaLink',
          title: 'Primary CTA Link',
          type: 'string'
        }
      ]
    },
    {
      name: 'faqSection',
      title: 'FAQ Section',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Section Headline',
          type: 'string'
        },
        {
          name: 'faqs',
          title: 'Frequently Asked Questions',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'faq',
              fields: [
                {
                  name: 'question',
                  title: 'Question',
                  type: 'string'
                },
                {
                  name: 'answer',
                  title: 'Answer',
                  type: 'text',
                  rows: 3
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'finalCta',
      title: 'Final CTA Section',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'CTA Headline',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Supporting Text',
          type: 'text',
          rows: 2
        },
        {
          name: 'primaryCta',
          title: 'Primary CTA Text',
          type: 'string'
        },
        {
          name: 'primaryCtaLink',
          title: 'Primary CTA Link',
          type: 'string'
        },
        {
          name: 'secondaryCta',
          title: 'Secondary CTA Text',
          type: 'string'
        },
        {
          name: 'secondaryCtaLink',
          title: 'Secondary CTA Link',
          type: 'string'
        }
      ]
    },
    {
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Set to true when ready to publish',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in navigation and listings'
    }
  ],
  
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      published: 'isPublished'
    },
    prepare(selection) {
      const {title, slug, published} = selection
      return {
        title: title,
        subtitle: `/${slug} ${published ? '✅' : '📝'}`
      }
    }
  }
})