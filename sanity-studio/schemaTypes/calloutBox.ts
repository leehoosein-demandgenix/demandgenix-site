import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'calloutBox',
  title: 'Callout Box',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Insight (Green — brand primary)', value: 'insight' },
          { title: 'Warning (Orange — brand secondary)', value: 'warning' },
          { title: 'Tip (Blue)', value: 'tip' }
        ],
        layout: 'radio'
      },
      initialValue: 'insight',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title (Optional)',
      type: 'string',
      description: 'Optional bold heading shown above the callout text'
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
      content: 'content'
    },
    prepare({ type, title, content }) {
      const labels: Record<string, string> = {
        insight: 'Insight',
        warning: 'Warning',
        tip: 'Tip'
      }
      return {
        title: `[${labels[type] || 'Callout'}] ${title || ''}`.trim(),
        subtitle: content ? content.substring(0, 80) : ''
      }
    }
  }
})
