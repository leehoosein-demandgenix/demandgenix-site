import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'twoColumnTable',
  title: 'Two-Column Table',
  type: 'object',
  fields: [
    defineField({
      name: 'col1Header',
      title: 'Column 1 Header (Label)',
      type: 'string',
      description: 'Header for the label column — can be left blank or e.g. "Metric"',
      initialValue: ''
    }),
    defineField({
      name: 'col2Header',
      title: 'Column 2 Header (Value)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. "Result", "CAC", "Conversion Rate"'
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          title: 'Row',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'e.g. "Branded search volume", "Direct traffic"'
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.required()
            })
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Row',
                subtitle: subtitle ? subtitle.substring(0, 60) + '...' : ''
              }
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: { col2: 'col2Header' },
    prepare({ col2 }) {
      return {
        title: 'Two-Column Table',
        subtitle: col2 || ''
      }
    }
  }
})
