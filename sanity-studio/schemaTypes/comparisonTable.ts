import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'comparisonTable',
  title: 'Comparison Table',
  type: 'object',
  fields: [
    defineField({
      name: 'col1Header',
      title: 'Column 1 Header (Row Labels)',
      type: 'string',
      description: 'Header for the first column — typically left blank or a category label (e.g. "Attribute")',
      initialValue: ''
    }),
    defineField({
      name: 'col2Header',
      title: 'Column 2 Header',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. "Demand Generation"'
    }),
    defineField({
      name: 'col3Header',
      title: 'Column 3 Header',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'e.g. "Lead Generation"'
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'col1',
              title: 'Row Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'e.g. "Goal", "Timeline", "Metrics"'
            }),
            defineField({
              name: 'col2',
              title: 'Column 2 Value',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'col3',
              title: 'Column 3 Value',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required()
            })
          ],
          preview: {
            select: {
              title: 'col1',
              subtitle: 'col2'
            },
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
    select: {
      col2: 'col2Header',
      col3: 'col3Header'
    },
    prepare({ col2, col3 }) {
      return {
        title: 'Comparison Table',
        subtitle: `${col2 || '?'} vs ${col3 || '?'}`
      }
    }
  }
})
