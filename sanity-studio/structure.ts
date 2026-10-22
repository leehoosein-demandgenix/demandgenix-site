// structure.ts
// Pages that exist exactly once are opened directly, so nobody can create a second Home page by mistake.
import type {StructureResolver} from 'sanity/structure'

export const SINGLETONS = [
  {type: 'homePage', id: 'homePage', title: 'Home page'},
  {type: 'servicesPage', id: 'servicesPage', title: 'Services page'},
  {type: 'siteSettings', id: 'siteSettings', title: 'Site settings'},
]

export const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type))

export const structure: StructureResolver = (S) => {
  const single = (s: (typeof SINGLETONS)[number]) =>
    S.listItem()
      .title(s.title)
      .id(s.id)
      .child(S.document().schemaType(s.type).documentId(s.id).title(s.title))

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items(SINGLETONS.filter((s) => s.type.endsWith('Page')).map(single)),
        ),
      single(SINGLETONS.find((s) => s.type === 'siteSettings')!),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.has(item.getId() as string)),
    ])
}
