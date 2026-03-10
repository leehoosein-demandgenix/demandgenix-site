# Two-Column Table Block — Design Spec

**Date:** 2026-03-10
**Status:** Approved

## Problem

Blog posts currently support a 3-column `comparisonTable` block (row label + two value columns). There is no support for a simpler label+value table suitable for key facts, metrics, or specs-style content.

## Goal

Add a `twoColumnTable` content block to the blog, following the exact same pattern as `comparisonTable` — new Sanity schema type, registered globally, added to the blog content field, projected in GROQ, and rendered in `blogHelpers.js`.

## Use Case

Label + value tables. Examples:
- "Metric | Result"
- "Channel | CAC"
- "Stage | Conversion Rate"

Not a head-to-head comparison — a single value column per row.

## Approach

Option A: New `twoColumnTable` schema type. Mirrors `comparisonTable` exactly. Existing tables untouched. Studio UI is unambiguous.

## Files

| File | Action | Responsibility |
|------|--------|---------------|
| `sanity-studio/schemaTypes/twoColumnTable.ts` | Create | Schema definition |
| `sanity-studio/schemaTypes/index.ts` | Modify | Import and register type |
| `sanity-studio/schemaTypes/blogPost.ts` | Modify | Add to content array |
| `src/lib/sanity.js` | Modify | Add GROQ projection case |
| `src/lib/blogHelpers.js` | Modify | Add renderer |

## Schema Design (`twoColumnTable.ts`)

```ts
defineType({
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
```

## GROQ Projection (`sanity.js`)

Added to the `content[]` projection in `getBlogPostBySlug` in `src/lib/sanity.js`, immediately after the existing `comparisonTable` case (around line 703):

```groq
_type == "twoColumnTable" => {
  _type,
  col1Header,
  col2Header,
  rows[]{ label, value }
}
```

## Renderer (`blogHelpers.js`)

Inline-style HTML, same pattern as `comparisonTable`. Colours:

- Header row col1 (label header): dark green `#065f46` — matches `comparisonTable` header
- Header row col2 (value header): medium green `#059669` — matches `comparisonTable` col2
- Label cells: green-tinted `#ecfdf5` background, `#064e3b` text — matches `comparisonTable` row label styling
- Value cells: white/alternating `#f9fafb`, `#1f2937` text
- Borders: `#a7f3d0` (primary-200)
- Wrapper: `overflow-x-auto`, `rounded-lg`, box-shadow

No orange — this is not a two-item comparison, so the secondary colour is not used.

## Out of Scope

- No changes to `comparisonTable`
- No changes to `threeColumnBlock`
- No generic N-column table
