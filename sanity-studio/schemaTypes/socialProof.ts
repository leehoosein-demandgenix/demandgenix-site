// schemaTypes/socialProof.ts
export default {
  name: 'socialProof',
  title: 'Social Proof',
  type: 'document',
  fields: [
    {
      name: 'testimonialQuote',
      title: 'Testimonial Quote',
      type: 'text',
      description: 'Featured testimonial or case study snippet',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'companyLogos',
      title: 'Company Logos',
      type: 'array',
      description: 'List of company logos to display',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Company Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'logo',
              title: 'Logo Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'showShieldIcon',
      title: 'Show Shield Icon',
      type: 'boolean',
      description: 'Display a shield icon before the testimonial',
      initialValue: true,
    },
  ],
}
