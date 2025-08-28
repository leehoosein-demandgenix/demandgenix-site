// schemaTypes/siteSettings.ts
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    },
    {
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    },
    {
      name: 'companyNumber',
      title: 'Company Number',
      type: 'string',
    },
    {
      name: 'registeredAddress',
      title: 'Registered Address',
      type: 'text',
    },
  ],
}