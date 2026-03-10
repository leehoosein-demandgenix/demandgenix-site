# FAQPage JSON-LD Schema — Scalable CMS-Driven Approach

**Date:** 2026-03-10
**Status:** Approved

## Problem

FAQPage JSON-LD schema is currently hardcoded in `src/pages/blog/[slug].astro` behind a single slug check (`AEO_SLUG = 'demand-gen-vs-lead-gen-...'`). Any new post requiring FAQPage schema requires a code change and redeploy. The MQLs post (`why-mqls-dont-convert-youre-measuring-intent-wrong`) is missing FAQPage schema as a result.

## Goal

Allow FAQPage JSON-LD schema to be authored per-post in Sanity Studio, with automatic injection at build time — no code changes required per post.

## Scope

- FAQPage schema only. HowTo and Speakable schemas remain hardcoded for the demand-gen post.
- Existing demand-gen FAQ items to be migrated into Sanity manually by the author.

## Design

### 1. Sanity Schema (`sanity-studio/schemaTypes/blogPost.ts`)

Add a `faqs` field to the `blogPost` document type:

```ts
defineField({
  name: 'faqs',
  title: 'FAQs (Structured Data)',
  type: 'array',
  description: 'FAQ items for FAQPage JSON-LD schema. Improves AEO / AI search visibility.',
  of: [
    {
      type: 'object',
      fields: [
        defineField({ name: 'question', title: 'Question', type: 'string', validation: Rule => Rule.required() }),
        defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: Rule => Rule.required() })
      ],
      preview: { select: { title: 'question' } }
    }
  ]
})
```

Positioned after `metaDescription` in the Studio UI.

### 2. GROQ Query (`src/lib/sanity.js`)

Extend `getBlogPostBySlug` projection to include:

```groq
faqs[]{ question, answer }
```

No fallback change needed — `faqs` is optional.

### 3. Blog Template (`src/pages/blog/[slug].astro`)

- Remove `aeoFaqSchema` variable and its reference inside the `isAeoPost` fragment.
- Keep `AEO_SLUG`, `isAeoPost`, `aeoHowToSchema`, and `aeoBlogPostingSchema` unchanged.
- Add dynamic FAQ schema:

```js
const faqSchema = post.faqs?.length ? {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": post.faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  }))
} : null;
```

- Render in `<head>` slot independently:

```astro
{faqSchema && (
  <script type="application/ld+json" slot="head" set:html={JSON.stringify(faqSchema)}></script>
)}
```

## Files Changed

| File | Change |
|------|--------|
| `sanity-studio/schemaTypes/blogPost.ts` | Add `faqs` array field |
| `src/lib/sanity.js` | Add `faqs[]{ question, answer }` to GROQ projection |
| `src/pages/blog/[slug].astro` | Remove hardcoded `aeoFaqSchema`; add dynamic `faqSchema` |

## Out of Scope

- HowTo schema (remains hardcoded)
- Speakable schema (remains hardcoded)
- Any UI changes to the blog post template
