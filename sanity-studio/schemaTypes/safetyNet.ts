// schemaTypes/safetyNet.ts
export default {
  name: 'safetyNet',
  title: 'Safety Net Section',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading for the safety net section',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Main description text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text for the call-to-action button',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      description: 'URL for the call-to-action button',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'string',
      description: 'Small italic text below the button',
    },
  ],
}
