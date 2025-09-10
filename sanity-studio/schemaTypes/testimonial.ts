export default {
  name: 'testimonial',
  title: 'LinkedIn Testimonials',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Recommender Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
    },
    {
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      description: 'Upload their LinkedIn profile photo (optional)',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'recommendation',
      title: 'Recommendation Text',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required().min(50).max(300),
      description: 'The actual LinkedIn recommendation (keep it concise for web display)'
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn Profile URL',
      type: 'url',
      description: 'Link to their LinkedIn profile (optional)'
    },
    {
      name: 'relationship',
      title: 'Professional Relationship',
      type: 'string',
      options: {
        list: [
          {title: 'Colleague', value: 'colleague'},
          {title: 'Client', value: 'client'},
          {title: 'Manager', value: 'manager'},
          {title: 'Direct Report', value: 'direct-report'},
          {title: 'Collaborator', value: 'collaborator'},
          {title: 'Other', value: 'other'}
        ]
      }
    },
    {
      name: 'isPublic',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to show/hide this testimonial on your website'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this testimonial appears (1, 2, 3, etc.)'
    },
    {
      name: 'dateReceived',
      title: 'Date Received',
      type: 'date',
      description: 'When you received this LinkedIn recommendation'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'company',
      media: 'profilePhoto'
    },
    prepare(selection: any) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: `${subtitle} - Recommendation`
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}]
    },
    {
      title: 'Date Received',
      name: 'dateDesc',
      by: [{field: 'dateReceived', direction: 'desc'}]
    }
  ]
}