// schemaTypes/hero.ts
export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Main Headline',
      type: 'string',
      description: 'The main headline (HTML allowed for styling)',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      description: 'The subtitle text below the headline',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Additional description text',
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
    },
    {
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
    },
    {
      name: 'ctaDescriptor',
      title: 'CTA Descriptor Text',
      type: 'text',
      description: 'Explanatory text that appears beneath the CTA button',
    },
  ],
}