import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'threeColumnBlock',
  title: 'Three Column Section',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      validation: (Rule) => Rule.length(3).error('Must have exactly 3 columns'),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required()
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
              title: 'title',
              content: 'content'
            },
            prepare({ title, content }) {
              return {
                title: title || 'Untitled',
                subtitle: content ? content.substring(0, 50) + '...' : ''
              }
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      column1: 'columns.0.title',
      column2: 'columns.1.title',
      column3: 'columns.2.title'
    },
    prepare({ column1, column2, column3 }) {
      return {
        title: 'Three Column Section',
        subtitle: `${column1 || '?'} | ${column2 || '?'} | ${column3 || '?'}`
      }
    }
  }
})