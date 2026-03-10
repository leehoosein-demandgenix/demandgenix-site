# Two-Column Table Block Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `twoColumnTable` label+value content block to blog posts, following the exact same pattern as the existing `comparisonTable`.

**Architecture:** New Sanity schema type registered globally → added to the blog content array → projected in the GROQ query → rendered by `blogHelpers.js` using inline styles consistent with the existing 3-column table.

**Tech Stack:** Sanity Studio v3 (TypeScript schema), GROQ, plain JavaScript renderer

**Spec:** `docs/superpowers/specs/2026-03-10-two-column-table-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `sanity-studio/schemaTypes/twoColumnTable.ts` | Create | Schema definition |
| `sanity-studio/schemaTypes/index.ts` | Modify | Import and register type |
| `sanity-studio/schemaTypes/blogPost.ts` | Modify | Add to content array |
| `src/lib/sanity.js` | Modify | Add GROQ projection case |
| `src/lib/blogHelpers.js` | Modify | Add renderer |

---

## Chunk 1: Sanity Schema

### Task 1: Create `twoColumnTable` schema

**Files:**
- Create: `sanity-studio/schemaTypes/twoColumnTable.ts`

Context: Mirror the existing `comparisonTable.ts` (`sanity-studio/schemaTypes/comparisonTable.ts`) but with 2 columns (`col1Header` optional, `col2Header` required) and row fields named `label` + `value` instead of `col1`/`col2`/`col3`.

- [ ] **Step 1: Create the schema file**

Create `/Users/leehoosein/demandgenix-site-new/sanity-studio/schemaTypes/twoColumnTable.ts` with this exact content:

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd /Users/leehoosein/demandgenix-site-new/sanity-studio && npx tsc --noEmit
```

Expected: No TypeScript errors.

- [ ] **Step 3: Register in `index.ts`**

Open `sanity-studio/schemaTypes/index.ts`. It currently looks like:

```ts
import comparisonTable from './comparisonTable'
```

Add the import directly after that line:

```ts
import twoColumnTable from './twoColumnTable'
```

Then find the `schemaTypes` array export:

```ts
export const schemaTypes = [..., comparisonTable, calloutBox, ...]
```

Add `twoColumnTable` immediately after `comparisonTable`:

```ts
export const schemaTypes = [..., comparisonTable, twoColumnTable, calloutBox, ...]
```

- [ ] **Step 4: Add to `blogPost.ts` content array**

Open `sanity-studio/schemaTypes/blogPost.ts`. Find this block (around line 108):

```ts
        {
          type: 'comparisonTable'
        },
        {
          type: 'calloutBox'
        },
```

Add `twoColumnTable` between them:

```ts
        {
          type: 'comparisonTable'
        },
        {
          type: 'twoColumnTable'
        },
        {
          type: 'calloutBox'
        },
```

- [ ] **Step 5: Verify TypeScript again**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Verify Studio starts cleanly**

```bash
npm run dev
```

Expected: Studio starts. Open a blog post — the content block picker should now show "Two-Column Table" as an option alongside "Comparison Table". Kill the dev server.

- [ ] **Step 7: Commit**

```bash
cd /Users/leehoosein/demandgenix-site-new && git add sanity-studio/schemaTypes/twoColumnTable.ts sanity-studio/schemaTypes/index.ts sanity-studio/schemaTypes/blogPost.ts
git commit -m "feat(schema): add twoColumnTable content block type"
```

---

## Chunk 2: Data Layer + Renderer

### Task 2: Add GROQ projection and renderer

**Files:**
- Modify: `src/lib/sanity.js` (around line 713)
- Modify: `src/lib/blogHelpers.js` (after line 165)

Context: Both changes mirror the exact pattern used for `comparisonTable`. The GROQ case goes immediately after the `comparisonTable` case (line 713 in `sanity.js`). The renderer goes immediately after the `comparisonTable` renderer block (after line 165 in `blogHelpers.js`).

- [ ] **Step 1: Add GROQ projection case**

Open `src/lib/sanity.js`. Find the `comparisonTable` GROQ case (around line 703):

```groq
        _type == "comparisonTable" => {
          _type,
          col1Header,
          col2Header,
          col3Header,
          rows[]{
            col1,
            col2,
            col3
          }
        },
```

Add the `twoColumnTable` case immediately after it (before `_type == "calloutBox"`):

```groq
        _type == "twoColumnTable" => {
          _type,
          col1Header,
          col2Header,
          rows[]{
            label,
            value
          }
        },
```

- [ ] **Step 2: Add the renderer**

Open `src/lib/blogHelpers.js`. Find the end of the `comparisonTable` renderer block. It ends at approximately:

```js
      html += '</tbody>';
      html += '</table>';
      html += '</div>';
      return html;
    }

    // Handle callout boxes
```

Insert the `twoColumnTable` renderer between the closing `}` of the `comparisonTable` block and the `// Handle callout boxes` comment:

```js
    // Handle two-column tables
    if (block._type === 'twoColumnTable') {
      const col1Header = block.col1Header || '';
      const col2Header = block.col2Header || '';
      const rows = block.rows || [];

      // Brand colours — consistent with comparisonTable
      const headerBg     = '#065f46'; // primary-800
      const col2Bg       = '#059669'; // primary-600
      const rowLabelBg   = '#ecfdf5'; // primary-50
      const rowLabelColor = '#064e3b'; // primary-900
      const borderColor  = '#a7f3d0'; // primary-200

      let html = '<div class="my-10 overflow-x-auto rounded-lg" style="box-shadow: 0 1px 4px rgba(0,0,0,0.08);">';
      html += '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
      html += '<thead>';
      html += '<tr>';
      html += `<th style="padding:0.75rem 1rem;text-align:left;background:${headerBg};color:#fff;border:1px solid ${headerBg};">${col1Header}</th>`;
      html += `<th style="padding:0.75rem 1rem;text-align:left;background:${col2Bg};color:#fff;border:1px solid ${col2Bg};">${col2Header}</th>`;
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>';

      rows.forEach((row, index) => {
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f9fafb';
        html += `<tr style="background:${rowBg};">`;
        html += `<td style="padding:0.75rem 1rem;font-weight:600;background:${rowLabelBg};color:${rowLabelColor};border:1px solid ${borderColor};white-space:nowrap;vertical-align:top;">${row.label || ''}</td>`;
        html += `<td style="padding:0.75rem 1rem;border:1px solid ${borderColor};color:#1f2937;vertical-align:top;line-height:1.6;">${row.value || ''}</td>`;
        html += '</tr>';
      });

      html += '</tbody>';
      html += '</table>';
      html += '</div>';
      return html;
    }
```

- [ ] **Step 3: Build to verify**

```bash
cd /Users/leehoosein/demandgenix-site-new && npm run build 2>&1 | tail -10
```

Expected: `[build] Complete!` with no errors. All Sanity queries succeed.

- [ ] **Step 4: Commit**

```bash
git add src/lib/sanity.js src/lib/blogHelpers.js
git commit -m "feat(blog): add twoColumnTable GROQ projection and renderer"
```

---

## Chunk 3: Verification

### Task 3: End-to-end verification

- [ ] **Step 1: Verify build output is clean**

```bash
npm run build 2>&1 | grep -E "(error|Error|warning|Warning|Complete)"
```

Expected: Only `[build] Complete!` — no errors or warnings from the new code.

- [ ] **Step 2: Check Studio adds the type correctly**

```bash
cd sanity-studio && npm run dev
```

Open a blog post in Studio. Click "Add block" in the content field. Confirm "Two-Column Table" appears. Add one with:
- Col1 Header: blank
- Col2 Header: "Result"
- One row: Label = "Pipeline growth", Value = "111%"

Save. Kill the dev server.

- [ ] **Step 3: Confirm rendered HTML in build**

```bash
cd /Users/leehoosein/demandgenix-site-new && npm run build 2>&1 | tail -5
```

Expected: `[build] Complete!`

- [ ] **Step 4: Final commit if any loose changes**

```bash
git status
# If clean, no commit needed
```
