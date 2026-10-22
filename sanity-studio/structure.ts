// structure.ts
// Pages that exist exactly once are opened directly, so nobody can create a second Home page by mistake.
import type {StructureResolver} from 'sanity/structure'

export const SINGLETONS = [
  {type: 'homePage', id: 'homePage', title: 'Home page'},
  {type: 'servicesPage', id: 'servicesPage', title: 'Services page'},
  {type: 'contactPage', id: 'contactPage', title: 'Contact page'},
  {type: 'blogPage', id: 'blogPage', title: 'Blog page'},
  {type: 'siteSettings', id: 'siteSettings', title: 'Site settings'},
]

export const SINGLETON_TYPES = new Set(SINGLETONS.map((s) => s.type))

// Documents from the previous site. The website no longer reads any of them, so they are kept
// out of the way (and not deleted) until you decide to remove them.
const RETIRED = [
  'hero',
  'about',
  'safetyNet',
  'servicesSection',
  'programme',
  'programmesPage',
  'contact',
  'errorPage',
  'service',
  'socialProof',
]

export const structure: StructureResolver = (S) => {
  const single = (s: (typeof SINGLETONS)[number]) =>
    S.listItem()
      .title(s.title)
      .id(s.id)
      .child(S.document().schemaType(s.type).documentId(s.id).title(s.title))

  const isLive = (item: {getId(): string | undefined}) =>
    !SINGLETON_TYPES.has(item.getId() as string) && !RETIRED.includes(item.getId() as string)

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
      ...S.documentTypeListItems().filter(isLive),
      S.divider(),
      S.listItem()
        .title('Old site content (no longer used)')
        .child(
          S.list()
            .title('Old site content (no longer used)')
            .items(S.documentTypeListItems().filter((item) => RETIRED.includes(item.getId() as string))),
        ),
    ])
}
