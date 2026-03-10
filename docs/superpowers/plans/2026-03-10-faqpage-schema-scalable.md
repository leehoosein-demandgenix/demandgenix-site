# FAQPage Schema — Scalable CMS-Driven Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded FAQPage JSON-LD schema with a CMS-driven approach, authoring FAQ items per post in Sanity and injecting schema automatically at build time.

**Architecture:** Add a `faqs` array field to the Sanity `blogPost` schema, extend the GROQ query to fetch it, then generate and render FAQPage JSON-LD dynamically in the blog template — replacing the hardcoded `aeoFaqSchema` variable while preserving the unrelated HowTo and Speakable schemas.

**Tech Stack:** Sanity Studio v3 (TypeScript schema), GROQ, Astro 4

**Spec:** `docs/superpowers/specs/2026-03-10-faqpage-schema-scalable-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `sanity-studio/schemaTypes/blogPost.ts` | Modify | Add `faqs` array field with `question`/`answer` sub-fields |
| `src/lib/sanity.js` | Modify | Add `faqs[]{ question, answer }` to `getBlogPostBySlug` GROQ projection |
| `src/pages/blog/[slug].astro` | Modify | Remove `aeoFaqSchema`; add dynamic `faqSchema` from `post.faqs` |

---

## Chunk 1: Sanity Schema + GROQ Query

### Task 1: Add `faqs` field to Sanity blogPost schema

**Files:**
- Modify: `sanity-studio/schemaTypes/blogPost.ts`

Context: The `blogPost` schema currently ends with a `readingTime` number field at line 199. The new `faqs` field goes after `metaDescription` (line 183) and before `isPublished`.

- [ ] **Step 1: Add the `faqs` field to `blogPost.ts`**

Open `sanity-studio/schemaTypes/blogPost.ts`. After the `metaDescription` field definition (which ends around line 183), insert:

```ts
defineField({
  name: 'faqs',
  title: 'FAQs (Structured Data)',
  type: 'array',
  description: 'FAQ items injected as FAQPage JSON-LD schema. Improves visibility in AI-driven search (AEO).',
  of: [
    {
      type: 'object',
      fields: [
        defineField({
          name: 'question',
          title: 'Question',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'answer',
          title: 'Answer',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required()
        })
      ],
      preview: {
        select: { title: 'question' }
      }
    }
  ]
}),
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd sanity-studio && npx tsc --noEmit
```

Expected: No TypeScript errors. If you see "defineField not found" errors, check the import at the top of `blogPost.ts` — `defineField` must be imported from `'sanity'`.

- [ ] **Step 3: Verify the Studio starts without errors**

```bash
npm run dev
```

Expected: Studio starts. Navigate to a blog post and confirm a new "FAQs (Structured Data)" field is visible below "Meta Description". Kill the dev server once confirmed.

- [ ] **Step 4: Commit**

```bash
cd .. && git add sanity-studio/schemaTypes/blogPost.ts
git commit -m "feat(schema): add faqs array field to blogPost for FAQPage JSON-LD"
```

---

### Task 2: Extend GROQ query to fetch FAQ data

**Files:**
- Modify: `src/lib/sanity.js` (lines 686–749, `getBlogPostBySlug`)

Context: The `getBlogPostBySlug` function fetches a blog post by slug. Its GROQ projection currently ends with `"heroImage": heroImage{ "url": asset->url, "alt": alt }` (line 740–743). The `faqs` field needs adding to this projection.

- [ ] **Step 1: Add `faqs` to the GROQ projection**

In `src/lib/sanity.js`, find the `getBlogPostBySlug` query. Add `faqs[]{ question, answer }` as the last field in the projection, before the closing `}`:

The projection currently ends with:
```groq
      "heroImage": heroImage{
        "url": asset->url,
        "alt": alt
      }
```

Change it to:
```groq
      "heroImage": heroImage{
        "url": asset->url,
        "alt": alt
      },
      faqs[]{ question, answer }
```

- [ ] **Step 2: Verify the query at build time**

```bash
npm run build 2>&1 | head -40
```

Expected: Build completes without errors. A GROQ parse error here would indicate a syntax mistake in the query.

- [ ] **Step 3: Commit**

```bash
git add src/lib/sanity.js
git commit -m "feat(sanity): add faqs to getBlogPostBySlug GROQ projection"
```

---

## Chunk 2: Blog Template — Dynamic Schema Injection

### Task 3: Replace hardcoded `aeoFaqSchema` with dynamic generation

**Files:**
- Modify: `src/pages/blog/[slug].astro` (lines 36–200)

Context:
- Lines 48–93: `const aeoFaqSchema = { ... }` — hardcoded FAQPage schema for one post. **Delete this entire block.**
- Lines 194–200: The `isAeoPost` Fragment renders `aeoFaqSchema`, `aeoHowToSchema`, and `aeoBlogPostingSchema`. **Remove only the `aeoFaqSchema` script tag from this fragment.**
- `AEO_SLUG`, `isAeoPost`, `aeoHowToSchema`, `aeoBlogPostingSchema` — **leave untouched.**

- [ ] **Step 1: Remove the hardcoded `aeoFaqSchema` variable**

Delete lines 48–93 in `[slug].astro` — the entire `const aeoFaqSchema = { ... };` block.

- [ ] **Step 2: Add the dynamic `faqSchema` variable**

After the `toIsoDateTime` helper (currently around line 150, may shift after deletion), add:

```ts
// Dynamic FAQPage schema — driven by post.faqs from Sanity
const faqSchema = post.faqs?.length
  ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.faqs.map((faq: { question: string; answer: string }) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  : null;
```

- [ ] **Step 3: Remove `aeoFaqSchema` from the `isAeoPost` Fragment**

Find the `isAeoPost` Fragment in the template (currently lines 194–200). It looks like:

```astro
{isAeoPost && (
  <Fragment slot="head">
    <script type="application/ld+json" is:inline set:html={JSON.stringify(aeoFaqSchema)}></script>
    <script type="application/ld+json" is:inline set:html={JSON.stringify(aeoHowToSchema)}></script>
    <script type="application/ld+json" is:inline set:html={JSON.stringify(aeoBlogPostingSchema)}></script>
  </Fragment>
)}
```

Remove only the `aeoFaqSchema` script line, leaving:

```astro
{isAeoPost && (
  <Fragment slot="head">
    <script type="application/ld+json" is:inline set:html={JSON.stringify(aeoHowToSchema)}></script>
    <script type="application/ld+json" is:inline set:html={JSON.stringify(aeoBlogPostingSchema)}></script>
  </Fragment>
)}
```

- [ ] **Step 4: Add the dynamic `faqSchema` render block**

Directly after the `blogStructuredData` script tag at line 192 (the one that always renders, not inside the `isAeoPost` Fragment — look for `set:html={JSON.stringify(blogStructuredData)}`), add:

```astro
{faqSchema && (
  <script type="application/ld+json" slot="head" set:html={JSON.stringify(faqSchema)}></script>
)}
```

- [ ] **Step 5: Build and verify no errors**

```bash
npm run build 2>&1 | head -60
```

Expected: Build succeeds with no TypeScript or Astro errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat(blog): replace hardcoded aeoFaqSchema with dynamic CMS-driven FAQPage schema"
```

---

## Chunk 3: Verification

### Task 4: End-to-end verification

- [ ] **Step 1: Run the dev server and check a post with no FAQs**

```bash
npm run dev
```

Open `http://localhost:4321/blog/why-mqls-dont-convert-youre-measuring-intent-wrong/` in a browser. View page source and confirm there is **no** `"@type":"FAQPage"` script tag. (The post has no FAQs yet — schema should be absent.)

- [ ] **Step 2: Check the demand-gen post still has HowTo + BlogPosting schemas**

Open `http://localhost:4321/blog/demand-gen-vs-lead-gen-which-should-your-lean-team-prioritise-right-now/` in a browser. View page source and confirm:
- `"@type":"HowTo"` is present ✓
- `"@type":"BlogPosting"` (with Speakable) is present ✓
- `"@type":"FAQPage"` is **absent** (it was removed; will return after Sanity migration)

- [ ] **Step 3: Add FAQ items to a test post in Sanity Studio**

In Sanity Studio, open any published blog post. Add 2 FAQ items using the new "FAQs (Structured Data)" field. Save and publish.

Wait for the CDN cache or run `npm run build` locally again, then check the post page source for a valid `"@type":"FAQPage"` block with both questions rendered.

- [ ] **Step 4: Validate schema**

Paste the page URL into [https://validator.schema.org](https://validator.schema.org) and confirm FAQPage is detected without errors.

- [ ] **Step 5: Final commit (if any loose changes)**

```bash
git status
# If clean, no commit needed
```

---

## Post-Implementation: Manual Sanity Migration

After the code is deployed, manually re-enter the 5 FAQ items from the demand-gen post into Sanity Studio. These are the questions that were previously hardcoded in `[slug].astro`:

1. "Can you do demand generation without lead generation?"
2. "What is the difference between demand gen and lead gen?"
3. "Which is better for a small marketing team: demand gen or lead gen?"
4. "How long does demand generation take to show results?"
5. "What metrics should a lean team track for demand gen?"

Then add FAQs for the MQLs post (`why-mqls-dont-convert-youre-measuring-intent-wrong`) with content authored by the post's editor/owner.

**Note:** This entire section is a content-author responsibility, not a developer task. No code changes are required — it is purely a content operation in Sanity Studio.
