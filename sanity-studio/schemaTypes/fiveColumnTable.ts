import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fiveColumnTable',
  title: 'Five Column Table',
  type: 'object',
  fields: [
    defineField({
      name: 'tableTitle',
      title: 'Table Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Displayed above the table as a label (e.g. "Feature Comparison")'
    }),
    defineField({
      name: 'col1Header',
      title: 'Column 1 Header (Row Labels)',
      type: 'string',
      description: 'Header for the first column — typically a category label (e.g. "Attribute")',
      initialValue: ''
    }),
    defineField({
      name: 'col2Header',
      title: 'Column 2 Header',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'col3Header',
      title: 'Column 3 Header',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'col4Header',
      title: 'Column 4 Header',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'col5Header',
      title: 'Column 5 Header',
      type: 'string',
      validation: (Rule) => Rule.required()
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
            }),
            defineField({
              name: 'col4',
              title: 'Column 4 Value',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'col5',
              title: 'Column 5 Value',
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
      tableTitle: 'tableTitle',
      col2: 'col2Header',
      col3: 'col3Header',
      col4: 'col4Header',
      col5: 'col5Header'
    },
    prepare({ tableTitle, col2, col3, col4, col5 }) {
      return {
        title: tableTitle || 'Five Column Table',
        subtitle: `${col2 || '?'} | ${col3 || '?'} | ${col4 || '?'} | ${col5 || '?'}`
      }
    }
  }
})
