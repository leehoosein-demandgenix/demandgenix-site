import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {schemaTypes} from './schemaTypes'
import {structure, SINGLETON_TYPES} from './structure'

export default defineConfig({
  name: 'default',
  title: 'DemandGenix CMS',

  projectId: 'fv5q0f3v',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons can't be created from the "+" menu, and can't be duplicated, unpublished or deleted.
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global' ? prev.filter((t) => !SINGLETON_TYPES.has(t.templateId)) : prev,
    actions: (prev, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({action}) => action && !['unpublish', 'delete', 'duplicate'].includes(action))
        : prev,
  },
})
