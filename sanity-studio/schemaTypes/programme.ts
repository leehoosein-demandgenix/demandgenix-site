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
      name: 'problemTag',
      title: 'Problem Tag',
      type: 'string',
      description: 'Tag shown in the problem selector',
      options: {
        list: [
          { title: "I don't know what's working", value: "diagnostic" },
          { title: "I know what's broken—fix it", value: "turnaround" },
          { title: "I need ongoing leadership", value: "leadership" }
        ]
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isEntryHero',
      title: 'Entry Hero Layout',
      type: 'boolean',
      description: 'Use special hero card layout (for Pipeline Diagnostic)',
      initialValue: false,
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
      description: 'e.g., "3–4 weeks", "Ongoing (rolling 90 days)"',
    },
    {
      name: 'durationSubtext',
      title: 'Duration Subtext',
      type: 'string',
      description: 'Additional duration info, e.g., "(1-2 days/week)"',
    },
    {
      name: 'investment',
      title: 'Investment Range',
      type: 'string',
      description: 'e.g., "£3,500–£5,000"',
    },
    {
      name: 'deliverables',
      title: 'Key Deliverables',
      type: 'array',
      description: 'List of key deliverables (for Diagnostic)',
      of: [{type: 'string'}],
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'e.g., "Book a 30-Minute Diagnostic"',
    },
    {
      name: 'ctaDescriptor',
      title: 'CTA Descriptor',
      type: 'text',
      description: 'Text shown below the CTA button',
    },
    {
      name: 'comparisonTable',
      title: 'Comparison Table',
      type: 'object',
      description: 'For Fractional Leadership comparison (Agency vs. Fractional Leader)',
      fields: [
        {
          name: 'rows',
          title: 'Comparison Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'agency',
                  title: 'Agency Column',
                  type: 'string',
                },
                {
                  name: 'fractional',
                  title: 'Fractional Leader Column',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      title: 'Linked Services',
      type: 'array',
      description: 'Services that are part of this programme (Sprints)',
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
