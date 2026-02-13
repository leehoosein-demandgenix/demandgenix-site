export default {
  name: 'errorPage',
  title: 'Error Page (404)',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main heading shown on the 404 page',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'supportingText',
      title: 'Supporting Text',
      type: 'text',
      description: 'Descriptive text shown below the headline',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ctaText',
      title: 'Primary CTA Button Text',
      type: 'string',
      description: 'Text for the primary call-to-action button (e.g. "Fix Your Pipeline")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ctaLink',
      title: 'Primary CTA Button Link',
      type: 'string',
      description: 'URL for the primary call-to-action button',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'secondaryCtaText',
      title: 'Secondary CTA Text',
      type: 'string',
      description: 'Text for the secondary link (e.g. "Return Home")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'secondaryCtaLink',
      title: 'Secondary CTA Link',
      type: 'string',
      description: 'URL for the secondary link',
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
