// schemaTypes/servicesSection.ts
export default {
  name: 'servicesSection',
  title: 'Services Section',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Main heading for the services section',
      validation: (Rule: any) => Rule.required(),
      initialValue: 'Which sounds like you?',
    },
    {
      name: 'subheading',
      title: 'Section Subheading',
      type: 'text',
      description: 'Subtitle text below the heading',
      validation: (Rule: any) => Rule.required(),
      initialValue: 'Select your biggest challenge to see the recommended path.',
    },
  ],
}
