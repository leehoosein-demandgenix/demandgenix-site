// schemaTypes/service.ts
export default {
  name: 'service',
  title: 'Services',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Service Name',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price Range',
      type: 'string',
      description: 'e.g., £3,500–£5,000',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., 3–4 weeks',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'programme',
      title: 'Parent Programme',
      type: 'reference',
      to: [{type: 'programme'}],
      description: 'Optional: Link this service to a parent programme',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this service appears (1, 2, 3, etc.)',
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