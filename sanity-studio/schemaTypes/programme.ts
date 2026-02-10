// schemaTypes/programme.ts
export default {
  name: 'programme',
  title: 'Programmes',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Programme Title',
      type: 'string',
      description: 'e.g., "Pipeline Diagnostic"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'problemStatement',
      title: 'Problem Statement',
      type: 'text',
      description: 'e.g., "I don\'t know what\'s working"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'targetAudience',
      title: 'Target Audience/Context',
      type: 'text',
      description: 'Who this programme is for and when to use it',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., "2 weeks", "3 months"',
    },
    {
      name: 'investment',
      title: 'Investment Range',
      type: 'string',
      description: 'e.g., "£3,500–£5,000"',
    },
    {
      name: 'services',
      title: 'Linked Services',
      type: 'array',
      description: 'Services that are part of this programme',
      of: [
        {
          type: 'reference',
          to: [{type: 'service'}],
        },
      ],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this programme appears (1, 2, 3, etc.)',
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
}
