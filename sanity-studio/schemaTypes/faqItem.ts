// schemaTypes/faqItem.ts
// One question and answer. The site publishes these as visible copy and as FAQ structured data,
// so the answer shown to people is exactly what search engines and AI assistants read.
export default {
  name: 'faqItem',
  title: 'Question and answer',
  type: 'object',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'Write it the way a real person would ask it, for example "What does it cost?"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'simpleRichText',
      description:
        'Answer in the first sentence, then add detail. Aim for 40 to 80 words so an AI assistant can quote it whole.',
      validation: (Rule: any) => [
        Rule.required(),
        Rule.custom((blocks: any[]) => {
          const words = (blocks || [])
            .map((b) => (b.children || []).map((c: any) => c.text || '').join(''))
            .join(' ')
            .trim()
            .split(/\s+/)
            .filter(Boolean).length
          if (words > 110) return `${words} words. Over 80 is hard to quote whole. Consider trimming.`
          return true
        }).warning(),
      ],
    },
  ],
  preview: {select: {title: 'question'}},
}
